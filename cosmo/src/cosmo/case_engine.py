"""Compile real case plans into the tested calendar/physics/economics primitives."""
import copy
from collections import defaultdict
from dataclasses import replace
from decimal import Decimal, localcontext
from fractions import Fraction

from .audit import audit_result
from .calendar import Shipment, check_shipments, duration, model_year, year_start
from .case_data import ROOT, delivery_delay, demand_for, factor, load_dataset, load_json, scenario_named, validate_dataset
from .common import MASS_TOL, ZERO, decimal_time, json_value, number, time, unique_ids, violation
from .economics import Contract, Investment, Payment, cash_flow, check_contracts, check_investments
from .physics import Arrival, Demand, Storage, simulate


def policy_default():
    return load_json(ROOT / "configs/implementation-policy.json")


def compile_investments(plan, data, policy, scenario):
    items, issues = [], []
    for raw in plan.get("investments", []):
        iid = raw["id"]
        if iid not in data["investments"]:
            raise ValueError(f"Неизвестная инвестиция {iid}")
        terms = data["investments"][iid]
        multiplier = number(scenario.get("capex_multiplier", 1), minimum=ZERO)
        payments = []
        for kind, field in (("option", "option_fee_mln"), ("exercise", "exercise_cost_mln")):
            at = raw.get(kind + "_at")
            if at is not None:
                payments.append(Payment(f"{iid}:{kind}", at, "capex", number(terms[field]) * multiplier,
                                        max(plan["first_year"], model_year(at)), iid))
        commission = None if raw.get("commissioned_at") is None else time(raw["commissioned_at"])
        exercise = raw.get("exercise_at")
        if commission is not None and exercise is None:
            raise ValueError(f"Для ввода {iid} нужна дата исполнения/финансирования")
        earliest, deadline = Fraction(0), None
        if iid == "EARTH_NEW":
            if raw.get("option_at") is None:
                raise ValueError("Earth-New: сначала оплачивается опцион 90")
            if exercise is not None and time(raw["option_at"]) > time(exercise):
                raise ValueError("Earth-New: опцион оплачен позже исполнения")
            earliest = time(exercise or 0) + duration(policy["earth_new_preparation_months"], "month")
        elif iid == "ZBO":
            earliest = max(time(exercise or 0), year_start(int(data["storage"]["ZBO"]["available_from_year"]))) + duration(policy["zbo_installation_months"], "month")
            if exercise is not None and time(exercise) < year_start(2036):
                issues.append(violation("ZBO_NOT_AVAILABLE", exercise, decimal_time(time(exercise)), decimal_time(year_start(2036)), "day", iid, lower=True))
            commission = None if commission is None else commission + duration(scenario.get("zbo_delay_days", 0), "day")
        elif iid == "LUNAR_ISRU":
            earliest, deadline = year_start(2038), year_start(2038)
        items.append(Investment(iid, number(terms["total_capex_mln"]) * multiplier, tuple(payments), commission,
                                earliest, number(terms["fixed_opex_mln_per_year"]), deadline))
    unique_ids(items)
    return items, issues + check_investments(items)


def source_timing(source, investments, policy, preparation_year):
    sid = source["source_id"]
    inv_id = source.get("investment_id")
    if inv_id:
        inv = next((i for i in investments if i.id == inv_id), None)
        if inv is None or inv.commissioned_at is None:
            return None, None, None
        commissioned = inv.commissioned_at
        if inv_id == "EARTH_NEW":
            lead = duration(policy["earth_new_regular_delivery_months"], "month")
        elif inv_id == "LUNAR_ISRU":
            lead = duration(policy["isru_delivery_months"], "month")
        else:
            lead = duration(source["lead_time_max_value"], source["lead_time_unit"])
        return commissioned, lead, commissioned  # no order before startup
    available = year_start(int(source["available_from_year"]))
    if sid in policy["prestart_channels"]:
        available = min(available, year_start(preparation_year))
    return available, duration(source["lead_time_max_value"], source["lead_time_unit"]), None


def evaluate_plan(plan, dataset=None, scenario=None, *, reference_plan=None, max_step=1):
    with localcontext() as ctx:
        ctx.prec = 28
        return _evaluate(copy.deepcopy(plan), dataset or load_dataset(), scenario or scenario_named("BASE"), reference_plan, max_step)


def _evaluate(plan, data, scenario, reference, max_step):
    if plan.get("schema_version") != 2 or plan.get("scope") not in ("CASE_PLAN", "RESEARCH_PLAN"):
        raise ValueError("Нужен план schema_version=2, scope CASE_PLAN или RESEARCH_PLAN")
    if not isinstance(plan.get("plan_id"), str) or not plan["plan_id"].strip():
        raise ValueError("У плана нет plan_id")
    first, last = plan["first_year"], plan["last_year"]
    validate_dataset(data, first, last)
    if data.get("scope") == "CASE_INPUT" and data != load_dataset():
        raise ValueError("Изменён контрольный набор: смените scope и dataset_id исследовательской копии")
    if data.get("scope") != "CASE_INPUT" and plan.get("scope") != "RESEARCH_PLAN":
        raise ValueError("Исследовательские данные требуют явного RESEARCH_PLAN")
    if plan.get("dataset_id") != data["dataset_id"]:
        raise ValueError("Версия данных плана не совпадает с загруженным набором")
    policy = plan.get("policy")
    if not isinstance(policy, dict) or not policy.get("policy_id") or not policy.get("resolutions"):
        raise ValueError("План должен сохранять явные допущения policy/resolutions")
    if plan["scope"] == "CASE_PLAN":
        number(policy["earth_new_preparation_months"], minimum=Decimal(18), maximum=Decimal(24))
        number(policy["isru_delivery_months"], minimum=Decimal(1), maximum=Decimal(2))
        number(policy["earth_new_regular_delivery_months"], minimum=Decimal(2), maximum=Decimal(6))
    else:
        # Research copies may test timing outside the team ranges, but zero or
        # negative durations remain invalid model inputs.
        number(policy["earth_new_preparation_months"], minimum=Decimal("0.01"), maximum=Decimal(120))
        number(policy["isru_delivery_months"], minimum=Decimal("0.01"), maximum=Decimal(120))
        number(policy["earth_new_regular_delivery_months"], minimum=Decimal("0.01"), maximum=Decimal(120))
    number(policy["zbo_installation_months"], minimum=ZERO)
    if not policy.get("prestart_existing_storage"):
        raise ValueError("Физический подготовительный запас требует явной доступности существующего хранилища")
    prep = policy["preparation_year"]
    if not isinstance(prep, int) or prep != first - 1:
        raise ValueError("Подготовительный период первой версии — один год перед горизонтом")
    if first != 2035 and plan["scope"] != "RESEARCH_PLAN":
        raise ValueError("Изменение начала горизонта требует исследовательского плана")
    if scenario.get("apply_reliability_to_deliveries", False):
        raise ValueError("Надёжность нельзя автоматически умножать на фактическую поставку")
    # Mandatory scenarios cannot be silently weakened by changing their dictionaries.
    if scenario.get("scenario_id") in ("BASE", "MANDATORY_STRESS") and json_value(scenario) != json_value(scenario_named(scenario["scenario_id"])):
        raise ValueError("Контрольный сценарий изменён; используйте отдельный TEAM_* сценарий")
    investments, issues = compile_investments(plan, data, policy, scenario)
    timing = {sid: source_timing(s, investments, policy, prep) for sid, s in data["sources"].items()}
    contracts, raw_contracts = [], {}
    for raw in plan["contracts"]:
        sid, year, cid = raw["source"], raw["year"], raw["id"]
        if sid not in data["sources"] or cid in raw_contracts:
            raise ValueError("Неизвестный источник или повтор контракта")
        if not prep <= year <= last:
            raise ValueError("Год контракта вне горизонта")
        source = data["sources"][sid]
        available, lead, order_floor = timing[sid]
        if available is None:
            issues.append(violation("SOURCE_NOT_COMMISSIONED", year_start(year), 0, 1, "availability", sid, lower=True))
            available = year_start(last + 1)
        start = time(raw.get("start", year_start(year)))
        end = time(raw.get("end", year_start(year + 1)))
        if start < available:
            issues.append(violation("CONTRACT_BEFORE_AVAILABILITY", start, decimal_time(start), decimal_time(available), "day", cid, lower=True))
        price = number(source["variable_cost_mln_per_t"]) * factor(scenario, "variable_price_multipliers_by_source_year", sid, year, scenario.get("variable_price_multiplier_default", 1))
        contracts.append(Contract(cid, sid, year, start, end, source["capacity_t_per_year"], raw["reserved_annual"],
                                  price, number(source["reservation_rate_mln_per_t_year_capacity"]) * number(scenario.get("reservation_tariff_multiplier", 1)), source["take_or_pay_share"]))
        raw_contracts[cid] = raw
    unique_ids(contracts)
    c_index = {c.id: c for c in contracts}
    orders, shipments, actual_arrivals, scheduled = defaultdict(lambda: ZERO), [], [], []
    seen_orders = set()
    actual_by_source_year = defaultdict(lambda: ZERO)
    outstanding = []
    emergency_years = set()
    for raw in plan["orders"]:
        if raw["id"] in seen_orders:
            raise ValueError("Повтор идентификатора заказа")
        seen_orders.add(raw["id"])
        if raw["contract_id"] not in c_index:
            raise ValueError(f"Заказ {raw['id']} ссылается на неизвестный контракт")
        contract = c_index[raw["contract_id"]]
        sid, year = contract.source, contract.year
        available, lead, order_floor = timing[sid]
        if available is None:
            continue
        arrival_at, ordered_at = time(raw["arrival_at"]), time(raw["ordered_at"])
        amount = number(raw["planned_t"], minimum=ZERO)
        if not contract.start <= arrival_at < contract.end:
            raise ValueError(f"Заказ {raw['id']}: поставка вне договорного периода")
        decision_at = time(raw_contracts[contract.id].get("decision_at", ordered_at))
        if ordered_at < decision_at:
            issues.append(violation("ORDER_BEFORE_CONTRACT", ordered_at, decimal_time(ordered_at), decimal_time(decision_at), "day", raw["id"], lower=True))
        if order_floor is not None and ordered_at < order_floor:
            issues.append(violation("ORDER_BEFORE_COMMISSION", ordered_at, decimal_time(ordered_at), decimal_time(order_floor), "day", raw["id"], lower=True))
        share = factor(scenario, "actual_delivery_shares_by_source_year", sid, year, scenario.get("actual_delivery_share_default", 1))
        shipment = Shipment(raw["id"], sid, contract.id, ordered_at, arrival_at, lead, amount, share, available)
        shipments.append(shipment)
        orders[contract.id] += amount
        delay = delivery_delay(scenario, sid, year, arrival_at)
        delivered_at = arrival_at + time(delay)
        scheduled.append({"id": shipment.id, "source": sid, "contract_id": contract.id, "ordered_at": ordered_at,
                          "planned_arrival_at": arrival_at, "actual_arrival_at": delivered_at,
                          "planned_t": amount, "actual_share": share, "gross_t": shipment.gross_t, "role": raw.get("role", "planned")})
        if delivered_at < year_start(last + 1):
            actual_arrivals.append(Arrival(shipment.id, delivered_at, shipment.gross_t))
            actual_by_source_year[sid, model_year(delivered_at)] += shipment.gross_t
        else:
            outstanding.append(shipment.id)
        if sid == "E" and amount > ZERO and (scenario["scenario_id"] == "BASE" or raw.get("role", "planned") == "planned") and year >= first:
            emergency_years.add(year)
    issues.extend(check_shipments(shipments))
    issues.extend(check_contracts(contracts, orders))
    for (sid, year), actual in actual_by_source_year.items():
        cap = number(data["sources"][sid]["capacity_t_per_year"])
        if actual > cap + MASS_TOL:
            issues.append(violation("ACTUAL_ANNUAL_CAPACITY_EXCEEDED", year_start(year), actual, cap, "t", sid))
    for year in range(first + 2, last + 1):
        if all(y in emergency_years for y in (year - 2, year - 1, year)):
            issues.append(violation("EMERGENCY_BASE_STREAK", year_start(year), 3, 2, "years", "E"))
    if plan.get("adaptation_of"):
        if reference is None or reference.get("plan_id") != plan["adaptation_of"]:
            raise ValueError("Для адаптации нужен исходный сохранённый план")
        reaction = time(plan["reaction_at"])
        if any(plan.get(k) != reference.get(k) for k in ("policy", "first_year", "last_year", "dataset_id")):
            raise ValueError("Адаптация не может скрытно менять допущения, горизонт или набор данных")
        if plan["investments"] != reference["investments"]:
            raise ValueError("Адаптация первой версии не может менять инвестиции исходного плана")
        old_orders = {o["id"]: o for o in reference["orders"]}
        new_orders = {o["id"]: o for o in plan["orders"]}
        if any(new_orders.get(k) != v for k, v in old_orders.items()):
            raise ValueError("Адаптация не может отменять или переписывать исходные заказы")
        for oid, raw in new_orders.items():
            if oid not in old_orders and time(raw["ordered_at"]) < reaction:
                raise ValueError("Новый заказ адаптации сделан до момента реакции")
        old_contracts = {c["id"]: c for c in reference["contracts"]}
        if any(raw_contracts.get(k) != v for k, v in old_contracts.items()):
            raise ValueError("Адаптация должна сохранять исходные контрактные обязательства")
    result = {"scope": plan["scope"], "plan_id": plan["plan_id"], "scenario_id": scenario["scenario_id"],
              "dataset_id": data["dataset_id"], "policy_id": policy["policy_id"], "conditional_on_team_assumptions": True,
              "deliveries": scheduled, "outstanding_deliveries": outstanding, "contracts": contracts,
              "investments": investments, "violations": issues, "physical": None, "economics": None}
    if issues:
        return {**result, "status": "INVALID_PLAN", "audit": {"status": "NOT_APPLICABLE", "checks": 0}}
    demands = {prep: Demand(0, 0), **{y: Demand(*demand_for(data, scenario, y)) for y in range(first, last + 1)}}
    base_storage = data["storage"]["BASE"]
    storages = [Storage("BASE", year_start(prep), base_storage["capacity_t"], base_storage["loss_rate_on_throughput"], base_storage["holding_cost_mln_per_t_year"])]
    for inv in investments:
        if inv.id == "ZBO" and inv.commissioned_at is not None and inv.commissioned_at < year_start(last + 1):
            terms = data["storage"]["ZBO"]
            storages.append(Storage("ZBO", inv.commissioned_at, terms["capacity_t"], terms["loss_rate_on_throughput"], terms["holding_cost_mln_per_t_year"]))
    ceiling = scenario.get("loss_ceiling", {"enabled": False})
    loss_limits = {y: ceiling["max_losses_divided_by_throughput"] for y in range(first, last + 1)
                   if ceiling.get("enabled") and ceiling["from_year"] <= y <= ceiling.get("through_year", last)}
    physical = simulate(demands, actual_arrivals, storages,
                        service_mode=scenario["service_threshold_mode"],
                        loss_limits=loss_limits, max_step=max_step)
    budgets = [(year_start(2038), "1800"), (year_start(2041), "2800")]
    for raw in data.get("extension_constraints", {}).get("capex_budgets", []):
        budgets.append((time(raw["cutoff"]), raw["limit_mln"]))
    economic = cash_flow(contracts, orders, investments, physical, first_year=prep, last_year=last,
                         real_discount_rate=policy["real_discount_rate"], capex_budgets=budgets)
    # Shift preparation costs to the first FINANCIAL year, retaining real dates for PV.
    economic["payments"] = [replace(p, attribution_year=max(first, p.attribution_year)) for p in economic["payments"]]
    categories = economic["components_mln"]
    economic["annual"] = [{"year": y, **{c: sum((p.amount_mln for p in economic["payments"] if p.attribution_year == y and p.category == c), ZERO) for c in categories}} for y in range(first, last + 1)]
    issues = physical["violations"] + economic["violations"]
    hard = [i for i in issues if i.severity == "hard"]
    targets = [i for i in issues if i.severity == "target"]
    result.update(physical=physical, economics=economic, violations=issues,
                  status="INFEASIBLE" if hard else "TARGETS_MISSED" if targets else "FEASIBLE",
                  preparation=physical["annual"][0], annual=physical["annual"][1:],
                  hard_violations=len(hard), target_violations=len(targets))
    result["audit"] = audit_result(result)
    return result
