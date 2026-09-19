"""Shared precise numbers and machine-readable constraint violations."""
from dataclasses import asdict, dataclass, is_dataclass
from decimal import Decimal
from fractions import Fraction

ZERO = Decimal(0)
ONE = Decimal(1)
MASS_TOL = Decimal("1e-9")
SHARE_TOL = Decimal("1e-12")


def number(value, name="value", *, minimum=None, maximum=None):
    # Reject float and bool: an API caller must not smuggle binary rounding in.
    if isinstance(value, (float, bool)) or not isinstance(value, (str, int, Decimal)):
        raise ValueError(f"{name}: use a decimal string, integer or Decimal")
    try:
        result = Decimal(value)
    except ArithmeticError as exc:
        raise ValueError(f"{name}: invalid decimal") from exc
    if not result.is_finite():
        raise ValueError(f"{name}: must be finite")
    if minimum is not None and result < minimum:
        raise ValueError(f"{name}: must be >= {minimum}")
    if maximum is not None and result > maximum:
        raise ValueError(f"{name}: must be <= {maximum}")
    return result


def time(value):
    if isinstance(value, (float, bool)) or not isinstance(value, (str, int, Decimal, Fraction)):
        raise ValueError("time: use an exact rational/decimal value, not float")
    try:
        return Fraction(value)
    except (ValueError, ZeroDivisionError, ArithmeticError) as exc:
        raise ValueError("time: invalid rational value") from exc


def decimal_time(value):
    value = time(value)
    return Decimal(value.numerator) / Decimal(value.denominator)


def unique_ids(items):
    ids = [item.id for item in items]
    if any(not isinstance(i, str) or not i.strip() for i in ids) or len(ids) != len(set(ids)):
        raise ValueError("IDs must be nonempty and unique")


@dataclass(frozen=True)
class Violation:
    code: str
    at: Fraction
    actual: Decimal
    limit: Decimal
    excess: Decimal
    unit: str
    subject: str = ""
    severity: str = "hard"


def violation(code, at, actual, limit, unit, subject="", *, lower=False, severity="hard"):
    actual, limit = number(actual), number(limit)
    return Violation(code, time(at), actual, limit,
                     max(ZERO, limit - actual if lower else actual - limit), unit, subject, severity)


def json_value(value):
    """Lossless JSON boundary: measured decimals and rational dates are strings."""
    if is_dataclass(value):
        return json_value(asdict(value))
    if isinstance(value, (Decimal, Fraction)):
        return str(value)
    if isinstance(value, dict):
        return {str(k): json_value(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [json_value(v) for v in value]
    return value
