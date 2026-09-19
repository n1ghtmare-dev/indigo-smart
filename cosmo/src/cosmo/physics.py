"""Mass balance, demand dispatch and stock-time integral, with explicit failures."""
from collections import defaultdict
from dataclasses import dataclass
from decimal import Decimal, localcontext
from fractions import Fraction

from .calendar import event_grid, model_year, year_start
from .common import MASS_TOL, SHARE_TOL, ZERO, decimal_time, number, time, unique_ids, violation


@dataclass(frozen=True)
class Demand:
    total_t: object
    critical_t: object

    def __post_init__(self):
        object.__setattr__(self, "total_t", number(self.total_t, "total demand", minimum=ZERO))
        object.__setattr__(self, "critical_t", number(self.critical_t, "critical demand", minimum=ZERO, maximum=self.total_t))


@dataclass(frozen=True)
class Arrival:
    id: str
    at: Fraction
    gross_t: object

    def __post_init__(self):
        object.__setattr__(self, "at", time(self.at))
        object.__setattr__(self, "gross_t", number(self.gross_t, "gross inflow", minimum=ZERO))


@dataclass(frozen=True)
class Storage:
    id: str
    at: Fraction
    capacity_t: object
    loss_rate: object
    holding_rate: object

    def __post_init__(self):
        object.__setattr__(self, "at", time(self.at))
        for name in ("capacity_t", "loss_rate", "holding_rate"):
            value = number(getattr(self, name), name, minimum=ZERO,
                           maximum=1 if name == "loss_rate" else None)
            object.__setattr__(self, name, value)


class PhysicalInfeasibility(Exception):
    """Stop on overflow: do not clip stock, invent disposal, or fabricate later KPIs."""
    def __init__(self, issue, intervals=(), annual=()):
        self.issue = issue
        self.intervals = list(intervals)
        self.annual = list(annual)
        super().__init__(f"{issue.code} at day {issue.at}: {issue.actual} > {issue.limit}")


def reserve_required(annual_demand):
    return number(annual_demand, minimum=ZERO) * 45 / 365


def dispatch(opening, gross, loss_rate, demand, critical):
    opening, gross = number(opening, minimum=ZERO), number(gross, minimum=ZERO)
    loss_rate = number(loss_rate, minimum=ZERO, maximum=1)
    demand = number(demand, minimum=ZERO)
    critical = number(critical, minimum=ZERO, maximum=demand)
    losses = gross * loss_rate
    stock_after = opening + gross - losses
    served_critical = min(stock_after, critical)
    served_other = min(stock_after - served_critical, demand - critical)
    served = served_critical + served_other
    return {"opening_t": opening, "gross_t": gross, "losses_t": losses,
            "after_inflow_t": stock_after, "served_t": served,
            "served_critical_t": served_critical, "closing_t": stock_after - served,
            "shortage_t": demand - served, "shortage_critical_t": critical - served_critical}


def simulate(demands, arrivals, storages, *, opening_t="0", service_mode="hard", loss_limits=None, max_step=1):
    """Simulate whole consecutive years. Inputs here are synthetic/compiled events.

    This function does not validate contracts or authorise commissioning. The
    caller must validate those first. End-boundary events belong to the next run.
    """
    with localcontext() as ctx:
        ctx.prec = 28
        return _simulate(demands, arrivals, storages, opening_t, service_mode, loss_limits or {}, max_step)


def _simulate(demands, arrivals, storages, opening_t, service_mode, loss_limits, max_step):
    years = sorted(demands)
    if not years or years != list(range(years[0], years[-1] + 1)):
        raise ValueError("Demand years must be nonempty and consecutive")
    if any(not isinstance(d, Demand) for d in demands.values()):
        raise ValueError("Each year requires a Demand")
    if service_mode not in ("hard", "target"):
        raise ValueError("service_mode must be hard or target")
    if not set(loss_limits).issubset(demands):
        raise ValueError("Loss-limit year outside demand horizon")
    loss_limits = {y: number(v, minimum=ZERO, maximum=1) for y, v in loss_limits.items()}
    start, end = year_start(years[0]), year_start(years[-1] + 1)
    unique_ids(arrivals)
    unique_ids(storages)
    storages = sorted(storages, key=lambda s: s.at)
    if not storages or storages[0].at != start or len({s.at for s in storages}) != len(storages):
        raise ValueError("Require exactly one initial storage at horizon start; no simultaneous storage changes")
    if any(not start <= a.at <= end for a in arrivals) or any(not start <= s.at < end for s in storages):
        raise ValueError("Event outside horizon")
    stock = number(opening_t, "opening_t", minimum=ZERO)
    active = storages[0]
    rows, issues, annual = [], [], {}

    def capacity_check(at, partial_rows=None):
        if stock > active.capacity_t + MASS_TOL:
            raise PhysicalInfeasibility(
                violation("STORAGE_OVERFLOW", at, stock, active.capacity_t, "t", active.id),
                rows if partial_rows is None else partial_rows,
                annual.values(),
            )

    capacity_check(start)
    inflows = defaultdict(lambda: ZERO)
    for arrival in arrivals:
        inflows[arrival.at] += arrival.gross_t
    changes = {s.at: s for s in storages}
    grid = event_grid(start, end, [a.at for a in arrivals] + list(changes), max_step)
    for at, until in zip(grid, grid[1:]):
        year = model_year(at)
        if at == year_start(year):
            required = reserve_required(demands[year].total_t)
            annual[year] = {"year": year, "opening_t": stock, "required_reserve_t": required}
            if stock + MASS_TOL < required:
                issues.append(violation("OPENING_RESERVE_SHORTFALL", at, stock, required, "t", str(year), lower=True))
        active = changes.get(at, active)
        capacity_check(at)
        fraction = decimal_time(until - at) / 365
        demand = demands[year].total_t * fraction
        critical = demands[year].critical_t * fraction
        row = dispatch(stock, inflows[at], active.loss_rate, demand, critical)
        stock = row["after_inflow_t"]
        row.update({"at": at, "until": until, "year": year, "storage_id": active.id,
                    "demand_t": demand, "critical_demand_t": critical,
                    "inventory_t_year": (row["after_inflow_t"] + row["closing_t"]) / 2 * fraction})
        row["holding_mln"] = row["inventory_t_year"] * active.holding_rate
        capacity_check(at, [*rows, row])
        rows.append(row)
        stock = row["closing_t"]
    for year, summary in annual.items():
        part = [r for r in rows if r["year"] == year]
        for field in ("gross_t", "losses_t", "served_t", "served_critical_t", "shortage_t", "shortage_critical_t", "inventory_t_year", "holding_mln"):
            summary[field] = sum((r[field] for r in part), ZERO)
        summary["closing_t"] = part[-1]["closing_t"]
        summary["total_demand_t"] = demands[year].total_t
        summary["critical_demand_t"] = demands[year].critical_t
        summary["total_service"] = summary["served_t"] / demands[year].total_t if demands[year].total_t else None
        summary["critical_service"] = summary["served_critical_t"] / demands[year].critical_t if demands[year].critical_t else None
        for metric in ("total_service", "critical_service"):
            if summary[metric] is not None:
                if summary[metric] > 1 + SHARE_TOL:
                    raise ArithmeticError("Annual service exceeds demand beyond numerical tolerance")
                summary[metric] = min(Decimal(1), summary[metric])
        summary["loss_share"] = summary["losses_t"] / summary["gross_t"] if summary["gross_t"] else None
        for metric, minimum in (("total_service", Decimal(".97")), ("critical_service", Decimal(".99"))):
            if summary[metric] is not None and summary[metric] + SHARE_TOL < minimum:
                issues.append(violation(metric.upper() + "_SHORTFALL", year_start(year + 1), summary[metric], minimum, "share", str(year), lower=True, severity=service_mode))
        if year in loss_limits and summary["loss_share"] is not None and summary["loss_share"] > loss_limits[year] + SHARE_TOL:
            issues.append(violation("LOSS_CEILING_EXCEEDED", year_start(year + 1), summary["loss_share"], loss_limits[year], "share", str(year)))
    return {"intervals": rows, "annual": list(annual.values()), "violations": issues,
            "closing_t": stock, "excluded_end_boundary_arrivals": [a.id for a in arrivals if a.at == end]}
