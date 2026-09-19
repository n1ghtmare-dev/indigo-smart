"""Transparent feasible-plan heuristic, not a claim of global optimisation."""
import copy
from decimal import Decimal, localcontext
from fractions import Fraction

from .calendar import duration, year_start
from .case_data import delivery_delay, demand_for, factor, load_dataset, scenario_named
from .case_engine import compile_investments, evaluate_plan, policy_default, source_timing
from .common import MASS_TOL, ZERO, decimal_time, json_value, number, time

STRATEGIES = {
    "EARTH_ONLY": {"label": "Только Земля", "sources": ["A", "B", "E"], "investments": []},
    "EARTH_NEW": {"label": "Земля + новый поставщик C", "sources": ["A", "B", "C", "E"], "investments": ["EARTH_NEW"]},
    "LUNAR": {"label": "Земля + лунное производство D", "sources": ["A", "B", "D", "E"], "investments": ["LUNAR_ISRU"]},
    "HYBRID": {"label": "Земля + C + лунное производство D", "sources": ["A", "B", "C", "D", "E"], "investments": ["EARTH_NEW", "LUNAR_ISRU"]},
}


def baseline_investments(strategy, zbo=True):
    items = []
    if zbo:
        items.append({"id": "ZBO", "exercise_at": "365", "commissioned_at": "1095/2"})
    for iid in STRATEGIES[strategy]["investments"]:
        if iid == "EARTH_NEW":
            items.append({"id": iid, "option_at": "0", "exercise_at": "365", "commissioned_at": "1095"})
        elif iid == "LUNAR_ISRU":
            items.append({"id": iid, "exercise_at": "1000", "commissioned_at": "1095"})
    return items


def emergency_streak_limit(data):
    raw = next((row["value"] for row in data.get("constraints", [])
                if row.get("constraint_id") == "EMERGENCY_BASE_STREAK"), "2")
    value = number(raw, minimum=Decimal(1))
    if value != value.to_integral_value():
        raise ValueError("Лимит последовательного использования E должен быть целым числом лет")
    return int(value)


def limit_emergency_streak(plan, max_streak):
    """Keep the most useful E years without violating the consecutive-year rule."""
    contracts = {c["id"]: c for c in plan["contracts"]}
    amounts = {year: ZERO for year in range(plan["first_year"], plan["last_year"] + 1)}
    for order in plan["orders"]:
        contract = contracts[order["contract_id"]]
        if contract["source"] == "E":
            amounts[contract["year"]] += number(order["planned_t"], minimum=ZERO)

    # Dynamic programming maximises retained emergency volume while allowing at
    # most max_streak consecutive years with positive planned E deliveries.
    states = {0: (ZERO, ())}
    for year in range(plan["first_year"], plan["last_year"] + 1):
        amount = amounts[year]
        next_states = {}

        def offer(run, total, kept):
            current = next_states.get(run)
            if current is None or total > current[0]:
                next_states[run] = (total, kept)

        for run, (total, kept) in states.items():
            offer(0, total, kept)
            if amount > MASS_TOL and run < max_streak:
                offer(run + 1, total + amount, kept + (year,))
        states = next_states

    kept_years = set(max(states.values(), key=lambda item: item[0])[1])
    removed = []
    for year, amount in amounts.items():
        if amount <= MASS_TOL or year in kept_years:
            continue
        contract_ids = {cid for cid, contract in contracts.items()
                        if contract["source"] == "E" and contract["year"] == year}
        removed_orders = [o for o in plan["orders"] if o["contract_id"] in contract_ids]
        plan["orders"] = [o for o in plan["orders"] if o["contract_id"] not in contract_ids]
        plan["contracts"] = [c for c in plan["contracts"] if c["id"] not in contract_ids]
        removed.append((year, removed_orders))
    return removed


def build_plan(strategy="EARTH_NEW", *, reserve_days="60", profile="BASE", dataset=None, policy=None, zbo=True, last_year=2040):
    with localcontext() as ctx:
        ctx.prec = 28
        return _build(strategy, number(reserve_days, minimum=Decimal(45), maximum=Decimal(120)), profile,
                      dataset or load_dataset(), copy.deepcopy(policy or policy_default()), zbo, last_year)


def _build(strategy, reserve_days, profile, data, policy, zbo, last_year):
    if strategy not in STRATEGIES or profile not in ("BASE", "LOW", "HIGH"):
        raise ValueError("Неизвестная стратегия/профиль спроса")
    scenario = scenario_named(profile)
    first, prep = 2035, policy["preparation_year"]
    max_emergency_streak = emergency_streak_limit(data)
    plan = {"schema_version": 2, "scope": "CASE_PLAN" if data["scope"] == "CASE_INPUT" else "RESEARCH_PLAN",
            "plan_id": f"{strategy}_{profile}_R{reserve_days}", "label": STRATEGIES[strategy]["label"],
            "dataset_id": data["dataset_id"], "first_year": first, "last_year": last_year, "policy": policy,
            "construction": {"method": "annual_least_variable_cost_then_equal_monthly_batches", "not_global_optimum": True,
                             "reserve_days": str(reserve_days), "planning_profile": profile,
                             "reserve_basis": "max(profile demand, mandatory stress demand), not multiplied together",
                             "terminal_target_t": "0", "B_backup_from_year": 2037,
                             "emergency_max_planned_streak_years": max_emergency_streak},
            "investments": baseline_investments(strategy, zbo), "contracts": [], "orders": []}
    if last_year != 2040 or data["dataset_id"] != "case-v1":
        plan["plan_id"] += f"_{last_year}_RESEARCH"
    if policy["policy_id"] != "TEAM_POLICY_V1":
        plan["plan_id"] += "_" + policy["policy_id"]
    investments, inv_issues = compile_investments(plan, data, policy, scenario_named("BASE"))
    if inv_issues:
        raise ValueError("График инвестиций не соответствует выбранным допущениям")
    timing = {sid: source_timing(s, investments, policy, prep) for sid, s in data["sources"].items()}
    storage_initial = data["storage"]["BASE"]
    zbo_inv = next((i for i in investments if i.id == "ZBO"), None)

    def retention(at):
        mode = "ZBO" if zbo_inv and at >= zbo_inv.commissioned_at else "BASE"
        return 1 - number(data["storage"][mode]["loss_rate_on_throughput"])

    def opening_target(year):
        total = demand_for(data, scenario, year)[0]
        stress_total = demand_for(data, scenario_named("MANDATORY_STRESS"), year)[0] if year <= 2040 else total
        return max(total, stress_total) * reserve_days / 365

    opening = opening_target(first)
    prep_gross = opening / (1 - number(storage_initial["loss_rate_on_throughput"]))
    prep_source = "B"
    if prep_source not in policy["prestart_channels"]:
        raise ValueError("Конструктор начального запаса требует явно разрешённый подготовительный B")
    prep_arrival = Fraction(-1)
    prep_lead = timing[prep_source][1]
    plan["contracts"].append({"id": "PREP-B", "source": prep_source, "year": prep,
                              "reserved_annual": str(prep_gross), "decision_at": str(prep_arrival - prep_lead), "role": "opening_inventory"})
    plan["orders"].append({"id": "PREP-STOCK", "contract_id": "PREP-B", "ordered_at": str(prep_arrival - prep_lead),
                           "arrival_at": str(prep_arrival), "planned_t": str(prep_gross), "role": "opening_inventory"})
    allowed = list(STRATEGIES[strategy]["sources"])
    # Data-driven optional sources appear only on research copies with explicit flag.
    allowed.extend(sid for sid, s in data["sources"].items() if s.get("include_in_research_planner") and sid not in allowed)
    for year in range(first, last_year + 1):
        target = opening_target(year + 1) if year < last_year else number(policy["terminal_inventory_target_t"], minimum=ZERO)
        remaining_net = demand_for(data, scenario, year)[0] + target - opening
        allocations, windows = {}, {}
        for sid in sorted(allowed, key=lambda k: number(data["sources"][k]["variable_cost_mln_per_t"])):
            available, lead, order_floor = timing[sid]
            if available is None or available >= year_start(year + 1):
                continue
            start = max(year_start(year), available)
            earliest = max(start, order_floor + lead if order_floor is not None else start)
            dates = [year_start(year) + duration(m, "month") for m in range(12)
                     if year_start(year) + duration(m, "month") >= earliest]
            if not dates:
                continue
            net_fraction = sum((retention(at) for at in dates), ZERO) / len(dates)
            fraction = decimal_time(year_start(year + 1) - start) / 365
            limit = number(data["sources"][sid]["capacity_t_per_year"]) * fraction
            amount = min(limit, max(ZERO, remaining_net) / net_fraction)
            allocations[sid] = amount
            windows[sid] = (start, dates, fraction)
            remaining_net -= amount * net_fraction
        if remaining_net > MASS_TOL:
            # A useful diagnostic plan can still be evaluated and show unmet service;
            # do not increase source capacities to repair the heuristic.
            plan.setdefault("construction_warnings", []).append({"year": year, "unallocated_net_t": str(remaining_net)})
        for sid, amount in allocations.items():
            start, dates, fraction = windows[sid]
            source = data["sources"][sid]
            reserved = amount / fraction
            if sid == "B" and year >= 2037:
                reserved = number(source["capacity_t_per_year"])
            if sid == "E" and amount > MASS_TOL:
                reserved = number(source["capacity_t_per_year"])
            if reserved <= MASS_TOL:
                continue
            cid = f"{sid}-{year}"
            lead = timing[sid][1]
            plan["contracts"].append({"id": cid, "source": sid, "year": year, "start": str(start),
                                      "reserved_annual": str(reserved), "decision_at": str(dates[0] - lead),
                                      "role": "planned_with_backup" if reserved * fraction > amount + MASS_TOL else "planned"})
            if amount > MASS_TOL:
                per_batch, booked = amount / len(dates), ZERO
                for n, at in enumerate(dates):
                    quantity = amount - booked if n == len(dates) - 1 else per_batch
                    plan["orders"].append({"id": f"{cid}-{n + 1:02d}", "contract_id": cid, "ordered_at": str(at - lead),
                                           "arrival_at": str(at), "planned_t": str(quantity), "role": "planned"})
                    booked += quantity
        opening = target
    removed_emergency = limit_emergency_streak(plan, max_emergency_streak)
    for year, orders in removed_emergency:
        removed_net = sum((number(order["planned_t"]) * retention(time(order["arrival_at"])) for order in orders), ZERO)
        warning = next((item for item in plan.get("construction_warnings", []) if item["year"] == year), None)
        if warning:
            warning["unallocated_net_t"] = str(number(warning["unallocated_net_t"]) + removed_net)
            warning["constraint"] = "EMERGENCY_BASE_STREAK"
        else:
            plan.setdefault("construction_warnings", []).append({"year": year, "unallocated_net_t": str(removed_net),
                                                                  "constraint": "EMERGENCY_BASE_STREAK"})
    if plan.get("construction_warnings"):
        plan["construction_warnings"].sort(key=lambda item: item["year"])
    return plan


def adapt_to_stress(base_plan, dataset=None):
    return adapt_to_scenario(base_plan, scenario_named("MANDATORY_STRESS"), dataset)


def adapt_to_scenario(base_plan, scenario, dataset=None):
    """Add B/E orders after revelation; never change baseline commitments.

    Restores the baseline year-end inventory target where remaining contractual
    capacity allows. Failed restoration is visible, not silently optimised away.
    """
    with localcontext() as ctx:
        ctx.prec = 28
        data = dataset or load_dataset()
        plan = copy.deepcopy(base_plan)
        plan.update(plan_id=base_plan["plan_id"] + "_ADAPTED_" + scenario["scenario_id"], adaptation_of=base_plan["plan_id"],
                    reaction_at=base_plan["policy"]["reaction_day"], adaptation_scenario_id=scenario["scenario_id"])
        reaction = time(plan["reaction_at"])
        base_result = evaluate_plan(base_plan, data, scenario_named("BASE"))
        if base_result["physical"] is None:
            raise ValueError("Нельзя адаптировать исходный план без полного физического журнала")
        target_end = {r["year"]: r["closing_t"] for r in base_result["annual"]}
        stress = scenario
        investments, _ = compile_investments(plan, data, plan["policy"], stress)
        zbo = next((i for i in investments if i.id == "ZBO"), None)
        contracts = {c["id"]: c for c in plan["contracts"]}
        opening = base_result["annual"][0]["opening_t"]
        used = {cid: sum((number(o["planned_t"]) for o in plan["orders"] if o["contract_id"] == cid), ZERO) for cid in contracts}
        warnings = []
        for year in range(plan["first_year"], plan["last_year"] + 1):
            scenario_demand = demand_for(data, stress, year)[0]
            original_net = ZERO
            for o in base_plan["orders"]:
                c = contracts[o["contract_id"]]
                delivered_at = time(o["arrival_at"]) + time(delivery_delay(stress, c["source"], c["year"], o["arrival_at"]))
                if not year_start(year) <= delivered_at < year_start(year + 1):
                    continue
                loss_mode = "ZBO" if zbo and delivered_at >= zbo.commissioned_at else "BASE"
                retained = 1 - number(data["storage"][loss_mode]["loss_rate_on_throughput"])
                original_net += number(o["planned_t"]) * factor(stress, "actual_delivery_shares_by_source_year", c["source"], c["year"]) * retained
            missing_net = max(ZERO, scenario_demand + target_end[year] - opening - original_net)
            added_net = ZERO
            if year_start(year + 1) > reaction and missing_net > MASS_TOL:
                for sid in ("B", "E"):
                    if sid not in data["sources"]:
                        continue
                    c = next((c for c in contracts.values() if c["source"] == sid and c["year"] == year), None)
                    if c is None:
                        continue  # Recourse uses reserved backup, not magically new capacity.
                    lead = duration(data["sources"][sid]["lead_time_max_value"], data["sources"][sid]["lead_time_unit"])
                    dates = [year_start(year) + duration(m, "month") for m in range(12)
                             if year_start(year) + duration(m, "month") >= reaction + lead]
                    if not dates:
                        continue
                    cstart = time(c.get("start", year_start(year)))
                    cend = time(c.get("end", year_start(year + 1)))
                    room = number(c["reserved_annual"]) * decimal_time(cend - cstart) / 365 - used[c["id"]]
                    retained = sum((1 - number(data["storage"]["ZBO" if zbo and at >= zbo.commissioned_at else "BASE"]["loss_rate_on_throughput"]) for at in dates), ZERO) / len(dates)
                    amount = min(max(ZERO, room), missing_net / retained)
                    if amount <= MASS_TOL:
                        continue
                    booked = ZERO
                    for n, at in enumerate(dates):
                        quantity = amount - booked if n == len(dates) - 1 else amount / len(dates)
                        plan["orders"].append({"id": f"RECOURSE-{sid}-{year}-{n + 1:02d}", "contract_id": c["id"],
                                               "ordered_at": str(at - lead), "arrival_at": str(at), "planned_t": str(quantity), "role": "emergency"})
                        booked += quantity
                    used[c["id"]] += amount
                    added_net += amount * retained
                    missing_net -= amount * retained
                if missing_net > MASS_TOL:
                    warnings.append({"year": year, "unrestored_target_t": str(missing_net)})
            opening = max(ZERO, opening + original_net + added_net - scenario_demand)
        plan["adaptation_notes"] = {"method": "additional reserved B/E orders only", "warnings": warnings,
                                    "no_cancelled_orders": True, "no_changed_investments": True}
        return plan


def reserve_emergency_capacity(base_plan, dataset=None):
    """Add the prepaid 2038-2040 E capacity used by the management package."""
    data = dataset or load_dataset()
    prepared = copy.deepcopy(base_plan)
    reaction = time(prepared["policy"]["reaction_day"])
    first_year = 2035 + reaction // 365
    expected_years = range(first_year, prepared["last_year"] + 1)
    capacity = number(data["sources"]["E"]["capacity_t_per_year"])
    already_prepared = all(any(c["source"] == "E" and c["year"] == year and c.get("role") == "contingent_backup"
                               and number(c["reserved_annual"]) == capacity for c in prepared["contracts"])
                           for year in expected_years)
    if not already_prepared and not prepared["plan_id"].endswith("_E_INSURANCE"):
        prepared["plan_id"] += "_E_INSURANCE"
    for year in expected_years:
        existing = next((c for c in prepared["contracts"] if c["source"] == "E" and c["year"] == year), None)
        if existing:
            existing.update(reserved_annual=str(capacity), role="contingent_backup",
                            decision_at=str(min(time(existing.get("decision_at", year_start(year) - 42)), year_start(year) - 42)))
        else:
            prepared["contracts"].append({"id": f"E-INSURANCE-{year}", "source": "E", "year": year,
                                          "reserved_annual": str(capacity),
                                          "decision_at": str(year_start(year) - 42), "role": "contingent_backup"})
    return prepared


def emergency_bridge_measure(base_plan, scenario, dataset=None):
    """Preventive E reservation + recourse bridge, with all costs and lead times.

    This is a separately funded preventive alternative, not a retroactive edit of
    the selected base. Only additional recourse B volumes may be moved to E.
    """
    data = dataset or load_dataset()
    prepared = reserve_emergency_capacity(base_plan, data)
    reaction = time(prepared["policy"]["reaction_day"])
    first_year = 2035 + reaction // 365
    adapted = adapt_to_scenario(prepared, scenario, data)
    unmitigated = evaluate_plan(prepared, data, scenario)
    if not unmitigated.get("physical"):
        return prepared, adapted
    earliest_e = reaction + duration(data["sources"]["E"]["lead_time_max_value"], data["sources"]["E"]["lead_time_unit"])
    earliest_b = reaction + duration(data["sources"]["B"]["lead_time_max_value"], data["sources"]["B"]["lead_time_unit"])
    shortfall = sum((r["shortage_t"] for r in unmitigated["physical"]["intervals"] if earliest_e <= r["at"] < earliest_b), ZERO)
    retained = 1 - number(data["storage"]["ZBO"]["loss_rate_on_throughput"])
    cid = next(c["id"] for c in prepared["contracts"] if c["source"] == "E" and c["year"] == first_year)
    available_e = number(data["sources"]["E"]["capacity_t_per_year"]) - sum((number(o["planned_t"]) for o in adapted["orders"] if o["contract_id"] == cid), ZERO)
    movable = [o for o in adapted["orders"] if o["id"].startswith(f"RECOURSE-B-{first_year}-")]
    bridge = min(shortfall / retained, available_e)
    if bridge > MASS_TOL:
        remaining = bridge
        for order in movable:
            subtract = min(number(order["planned_t"]), remaining)
            order["planned_t"] = str(number(order["planned_t"]) - subtract)
            remaining -= subtract
        adapted["orders"].append({"id": "RECOURSE-E-BRIDGE", "contract_id": cid,
                                  "ordered_at": str(reaction), "arrival_at": str(earliest_e),
                                  "planned_t": str(bridge), "role": "emergency"})
        adapted["adaptation_notes"]["bridge_t"] = str(bridge)
    return prepared, adapted
