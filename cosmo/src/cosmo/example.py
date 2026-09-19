"""Small integration boundary for explicitly synthetic examples only."""
from collections import defaultdict
from decimal import localcontext

from .calendar import Event, Shipment, check_shipments, ordered_events, year_start
from .common import ZERO, number, unique_ids
from .economics import Contract, Investment, Payment, cash_flow, check_contracts, check_investments
from .physics import Arrival, Demand, Storage, simulate


def run_example(config, *, max_step=1):
    with localcontext() as ctx:
        ctx.prec = 28
        return _run_example(config, max_step)


def _run_example(config, max_step):
    if config.get("schema_version") != 1 or config.get("scope") != "SYNTHETIC_NOT_CASE_BASE":
        raise ValueError("This runner accepts only schema 1 SYNTHETIC_NOT_CASE_BASE examples")
    if not isinstance(config.get("plan_id"), str) or not config["plan_id"].strip():
        raise ValueError("plan_id is required")
    if number(config["opening_t"]) != ZERO:
        raise ValueError("Example runner requires zero opening stock; paid prestart inventory is not implemented")
    first, last = config["first_year"], config["last_year"]
    start, end = year_start(first), year_start(last + 1)
    if start >= end:
        raise ValueError("Empty horizon")
    demand_rows = config["demand"]
    if sorted(r["year"] for r in demand_rows) != list(range(first, last + 1)):
        raise ValueError("Demand years must cover the horizon exactly once")
    demands = {r["year"]: Demand(r["total_t"], r["critical_t"]) for r in demand_rows}
    contracts = [Contract(**c) for c in config["contracts"]]
    shipments = [Shipment(**s) for s in config["shipments"]]
    storages = [Storage(**s) for s in config["storage"]]
    if not storages:
        raise ValueError("Initial storage is required")
    storages.sort(key=lambda s: s.at)
    investments = [Investment(**{**i, "payments": tuple(Payment(**p) for p in i["payments"])}) for i in config["investments"]]
    unique_ids(contracts)
    unique_ids(investments)
    indexed = {c.id: c for c in contracts}
    inv_index = {i.id: i for i in investments}
    orders = defaultdict(lambda: ZERO)
    for s in shipments:
        if s.contract_id not in indexed:
            raise ValueError(f"Unknown contract for {s.id}")
        contract = indexed[s.contract_id]
        if s.source != contract.source or not contract.start <= s.arrival_at < contract.end:
            raise ValueError(f"Shipment {s.id}: source or contractual delivery period mismatch")
        if not start <= s.arrival_at < end:
            raise ValueError("Shipment outside example horizon")
        orders[s.contract_id] += s.planned_t
    for storage in storages[1:]:
        if storage.id not in inv_index or inv_index[storage.id].commissioned_at != storage.at:
            raise ValueError("Storage change must link to an investment commissioned at that exact time")
    if any(not first <= c.year <= last for c in contracts):
        raise ValueError("Contract outside example horizon")
    if any(p.at >= end for i in investments for p in i.payments):
        raise ValueError("Payment outside example horizon")
    issues = check_shipments(shipments) + check_contracts(contracts, orders) + check_investments(investments)
    events = [Event(f"year:{y}", year_start(y), "year_open") for y in range(first, last + 1)]
    events += [Event(f"storage:{s.id}", s.at, "commission") for s in storages]
    events += [Event(f"arrival:{s.id}", s.arrival_at, "arrival") for s in shipments]
    result = {"scope": config["scope"], "plan_id": config["plan_id"], "calendar": ordered_events(events)}
    if issues:
        return {**result, "status": "INVALID_SCHEDULE_OR_CONTRACT", "violations": issues, "physical": None, "economics": None}
    physical = simulate(demands, [Arrival(s.id, s.arrival_at, s.gross_t) for s in shipments], storages,
                        opening_t=config["opening_t"], service_mode=config["service_mode"], max_step=max_step)
    economic = cash_flow(contracts, orders, investments, physical, first_year=first, last_year=last,
                         real_discount_rate=config["real_discount_rate"],
                         capex_budgets=[(b["cutoff"], b["limit_mln"]) for b in config["capex_budgets"]])
    issues = physical["violations"] + economic["violations"]
    return {**result, "status": "INFEASIBLE" if any(i.severity == "hard" for i in issues) else "CALCULATED",
            "violations": issues, "physical": physical, "economics": economic}
