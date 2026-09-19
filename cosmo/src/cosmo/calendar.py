"""365-day model calendar. This is deliberately not a Gregorian date parser."""
from dataclasses import dataclass
from fractions import Fraction

from .common import ZERO, number, time, unique_ids, violation

EPOCH_YEAR = 2035
DAYS_PER_YEAR = 365
PRIORITY = {"year_open": 0, "commission": 10, "arrival": 20}


def year_start(year):
    if isinstance(year, bool) or not isinstance(year, int):
        raise ValueError("year must be an integer")
    return Fraction((year - EPOCH_YEAR) * DAYS_PER_YEAR)


def model_year(at):
    return EPOCH_YEAR + time(at) // DAYS_PER_YEAR


def duration(value, unit):
    factors = {"day": Fraction(1), "week": Fraction(7), "month": Fraction(365, 12), "year": Fraction(365)}
    if unit not in factors:
        raise ValueError(f"Unsupported time unit: {unit}")
    value = time(value)
    if value < 0:
        raise ValueError("Negative lead time")
    return value * factors[unit]


@dataclass(frozen=True)
class Event:
    id: str
    at: Fraction
    kind: str

    def __post_init__(self):
        object.__setattr__(self, "at", time(self.at))
        if self.kind not in PRIORITY:
            raise ValueError(f"Unsupported event kind: {self.kind}")


def ordered_events(events):
    unique_ids(events)
    return sorted(events, key=lambda e: (e.at, PRIORITY[e.kind], e.id))


def event_grid(start, end, event_times=(), max_step=1):
    start, end, max_step = time(start), time(end), time(max_step)
    if start >= end or max_step <= 0 or max_step > 1:
        raise ValueError("Require start < end and 0 < max_step <= 1 day")
    points = {start, end}
    cursor = start
    while cursor < end:
        points.add(cursor)
        cursor += max_step
    for value in event_times:
        value = time(value)
        if not start <= value <= end:
            raise ValueError("Event outside declared horizon")
        points.add(value)
    for year in range(model_year(start), model_year(end) + 1):
        boundary = year_start(year)
        if start <= boundary <= end:
            points.add(boundary)
    return sorted(points)


@dataclass(frozen=True)
class Shipment:
    id: str
    source: str
    contract_id: str
    ordered_at: Fraction
    arrival_at: Fraction
    lead_days: Fraction
    planned_t: object
    actual_share: object = "1"
    available_at: Fraction = Fraction(0)

    def __post_init__(self):
        for field in ("ordered_at", "arrival_at", "lead_days", "available_at"):
            object.__setattr__(self, field, time(getattr(self, field)))
        if self.lead_days < 0 or not self.source or not self.contract_id:
            raise ValueError("Shipment requires nonnegative lead time, source and contract")
        object.__setattr__(self, "planned_t", number(self.planned_t, "planned_t", minimum=ZERO))
        object.__setattr__(self, "actual_share", number(self.actual_share, "actual_share", minimum=ZERO, maximum=1))

    @property
    def gross_t(self):
        # Reliability intentionally not accepted as a physical multiplier.
        return self.planned_t * self.actual_share


def check_shipments(shipments):
    unique_ids(shipments)
    issues = []
    for shipment in shipments:
        earliest = max(shipment.ordered_at + shipment.lead_days, shipment.available_at)
        if shipment.arrival_at < earliest:
            from .common import decimal_time
            issues.append(violation("EARLY_DELIVERY", shipment.arrival_at,
                                    decimal_time(shipment.arrival_at), decimal_time(earliest),
                                    "day", shipment.id, lower=True))
    return issues
