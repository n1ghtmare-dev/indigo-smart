"""Contract charges, investment gates and dated cash flow, in million units."""
from collections import defaultdict
from dataclasses import dataclass
from decimal import Decimal, localcontext
from fractions import Fraction

from .calendar import model_year, year_start
from .common import MASS_TOL, ZERO, decimal_time, number, time, unique_ids, violation

CATEGORIES = ("procurement", "reservation", "holding", "fixed_opex", "capex")


@dataclass(frozen=True)
class Contract:
    id: str
    source: str
    year: int
    start: Fraction
    end: Fraction
    source_capacity: object
    reserved_annual: object
    price: object
    reservation_rate: object
    take_or_pay: object

    def __post_init__(self):
        for name in ("start", "end"):
            object.__setattr__(self, name, time(getattr(self, name)))
        if not self.source or not year_start(self.year) <= self.start < self.end <= year_start(self.year + 1):
            raise ValueError("Contract must occupy a nonempty part of exactly one declared year")
        for name in ("source_capacity", "reserved_annual", "price", "reservation_rate", "take_or_pay"):
            object.__setattr__(self, name, number(getattr(self, name), name, minimum=ZERO,
                                                maximum=1 if name == "take_or_pay" else None))


@dataclass(frozen=True)
class Payment:
    id: str
    at: Fraction
    category: str
    amount_mln: object
    attribution_year: int
    subject: str

    def __post_init__(self):
        object.__setattr__(self, "at", time(self.at))
        object.__setattr__(self, "amount_mln", number(self.amount_mln, "payment", minimum=ZERO))
        if self.category not in CATEGORIES:
            raise ValueError("Unknown payment category")
        year_start(self.attribution_year)


@dataclass(frozen=True)
class Investment:
    id: str
    required_capex: object
    payments: tuple
    commissioned_at: Fraction | None
    earliest_commission: Fraction
    annual_opex: object
    financing_deadline: Fraction | None = None

    def __post_init__(self):
        object.__setattr__(self, "payments", tuple(self.payments))
        for name in ("required_capex", "annual_opex"):
            object.__setattr__(self, name, number(getattr(self, name), name, minimum=ZERO))
        for name in ("commissioned_at", "earliest_commission", "financing_deadline"):
            if getattr(self, name) is not None:
                object.__setattr__(self, name, time(getattr(self, name)))
        unique_ids(self.payments)
        if any(p.category != "capex" or p.subject != self.id for p in self.payments):
            raise ValueError("Investment payments must be CAPEX and refer to that investment")


def contract_charges(contract, ordered_t):
    ordered_t = number(ordered_t, "ordered_t", minimum=ZERO)
    fraction = decimal_time(contract.end - contract.start) / 365
    reserved_period = contract.reserved_annual * fraction
    payable = max(ordered_t, contract.take_or_pay * reserved_period)
    return {"contract_id": contract.id, "period_fraction": fraction,
            "reserved_period_t": reserved_period, "ordered_t": ordered_t,
            "payable_t": payable, "procurement_mln": contract.price * payable,
            "reservation_mln": contract.reservation_rate * contract.reserved_annual * fraction}


def check_contracts(contracts, ordered_by_contract):
    unique_ids(contracts)
    if not set(ordered_by_contract).issubset({c.id for c in contracts}):
        raise ValueError("Order references unknown contract")
    issues, groups = [], defaultdict(list)
    for c in contracts:
        groups[c.source, c.year].append(c)
        charge = contract_charges(c, ordered_by_contract.get(c.id, ZERO))
        if charge["ordered_t"] > charge["reserved_period_t"] + MASS_TOL:
            issues.append(violation("ORDER_VOLUME_EXCEEDED", c.start, charge["ordered_t"], charge["reserved_period_t"], "t", c.id))
    for (source, year), group in groups.items():
        capacities = {c.source_capacity for c in group}
        if len(capacities) != 1:
            raise ValueError("Conflicting capacity for the same source/year")
        capacity = capacities.pop()
        points = sorted({t for c in group for t in (c.start, c.end)})
        for at in points[:-1]:
            reserved = sum((c.reserved_annual for c in group if c.start <= at < c.end), ZERO)
            if reserved > capacity + MASS_TOL:
                issues.append(violation("CAPACITY_EXCEEDED", at, reserved, capacity, "t/year", source))
    return issues


def check_investments(investments):
    unique_ids(investments)
    unique_ids([p for i in investments for p in i.payments])
    issues = []
    for inv in investments:
        paid = sum((p.amount_mln for p in inv.payments), ZERO)
        if paid > inv.required_capex + MASS_TOL:
            issues.append(violation("CAPEX_OPTION_OVERPAID", max((p.at for p in inv.payments), default=Fraction(0)), paid, inv.required_capex, "mln", inv.id))
        if inv.commissioned_at is None:
            continue  # An unexercised paid option is a cost, not working capacity.
        if inv.commissioned_at < inv.earliest_commission:
            issues.append(violation("EARLY_COMMISSION", inv.commissioned_at, decimal_time(inv.commissioned_at), decimal_time(inv.earliest_commission), "day", inv.id, lower=True))
        paid_at_commission = sum((p.amount_mln for p in inv.payments if p.at <= inv.commissioned_at), ZERO)
        if paid_at_commission + MASS_TOL < inv.required_capex:
            issues.append(violation("UNFUNDED_COMMISSION", inv.commissioned_at, paid_at_commission, inv.required_capex, "mln", inv.id, lower=True))
        if inv.financing_deadline is not None:
            paid_before_deadline = sum((p.amount_mln for p in inv.payments if p.at < inv.financing_deadline), ZERO)
            if paid_before_deadline + MASS_TOL < inv.required_capex:
                issues.append(violation("MISSED_FINANCING_DEADLINE", inv.financing_deadline, paid_before_deadline, inv.required_capex, "mln", inv.id, lower=True))
    return issues


def cash_flow(contracts, ordered_by_contract, investments, physical, *, first_year, last_year, real_discount_rate=None, capex_budgets=()):
    """Price a completed physical trace. Invalid gates return issues, no ledger."""
    with localcontext() as ctx:
        ctx.prec = 28
        return _cash_flow(contracts, ordered_by_contract, investments, physical, first_year, last_year, real_discount_rate, capex_budgets)


def _cash_flow(contracts, ordered_by_contract, investments, physical, first_year, last_year, rate, budgets):
    start, end = year_start(first_year), year_start(last_year + 1)
    if start >= end:
        raise ValueError("Empty economic horizon")
    if [r["year"] for r in physical["annual"]] != list(range(first_year, last_year + 1)):
        raise ValueError("Physical and economic years differ")
    if any(not first_year <= c.year <= last_year for c in contracts):
        raise ValueError("Contract outside economic horizon; prestart contracts not yet integrated")
    if any(p.at >= end for i in investments for p in i.payments):
        raise ValueError("CAPEX at/after horizon end requires a longer horizon")
    issues = check_contracts(contracts, ordered_by_contract) + check_investments(investments)
    if issues:
        return {"status": "INVALID_PLAN", "violations": issues, "payments": [], "total_mln": None}
    rate = None if rate is None else number(rate, "real_discount_rate")
    if rate is not None and rate <= -1:
        raise ValueError("Discount rate must exceed -1")
    payments, charges = [], []
    for c in contracts:
        charge = contract_charges(c, ordered_by_contract.get(c.id, ZERO))
        charges.append(charge)
        for category in ("procurement", "reservation"):
            payments.append(Payment(f"{c.id}:{category}", year_start(c.year + 1), category,
                                    charge[category + "_mln"], c.year, c.id))
    for row in physical["annual"]:
        year = row["year"]
        payments.append(Payment(f"holding:{year}", year_start(year + 1), "holding", row["holding_mln"], year, "storage"))
    for inv in investments:
        for p in inv.payments:
            # Actual date retained for PV and budgets; prestart attribution explicit.
            payments.append(Payment(p.id, p.at, p.category, p.amount_mln,
                                    max(first_year, model_year(p.at)), p.subject))
        if inv.commissioned_at is not None:
            for year in range(first_year, last_year + 1):
                active_days = max(Fraction(0), year_start(year + 1) - max(year_start(year), inv.commissioned_at))
                if active_days:
                    payments.append(Payment(f"{inv.id}:opex:{year}", year_start(year + 1), "fixed_opex",
                                            inv.annual_opex * decimal_time(active_days) / 365, year, inv.id))
    unique_ids(payments)
    payments.sort(key=lambda p: (p.at, p.id))
    for cutoff, limit in budgets:
        cutoff, limit = time(cutoff), number(limit, minimum=ZERO)
        total = sum((p.amount_mln for p in payments if p.category == "capex" and p.at < cutoff), ZERO)
        if total > limit + MASS_TOL:
            issues.append(violation("CAPEX_BUDGET_EXCEEDED", cutoff, total, limit, "mln"))
    components = {c: sum((p.amount_mln for p in payments if p.category == c), ZERO) for c in CATEGORIES}
    total = sum(components.values(), ZERO)
    served = sum((r["served_t"] for r in physical["annual"]), ZERO)
    pv = None if rate is None else sum((p.amount_mln / (1 + rate) ** (decimal_time(p.at) / 365) for p in payments), ZERO)
    annual = [{"year": y, **{c: sum((p.amount_mln for p in payments if p.attribution_year == y and p.category == c), ZERO) for c in CATEGORIES}} for y in range(first_year, last_year + 1)]
    return {"status": "CONSTRAINT_VIOLATIONS" if issues else "CALCULATED", "violations": issues,
            "payments": payments, "contract_charges": charges, "annual": annual,
            "components_mln": components, "total_mln": total, "real_discount_rate": rate,
            "pv_mln": pv, "pv_reference_day": Fraction(0),
            "cost_per_served_t": total / served if served else None}
