"""Load frozen organizer inputs; explicitly separate extensions and scenarios."""
import copy
import csv
import hashlib
import json
from decimal import Decimal
from pathlib import Path

from .common import ZERO, number, time

ROOT = Path(__file__).resolve().parents[2]


def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"), parse_float=Decimal)


def load_dataset(root=ROOT):
    tables = {}
    hashes = {}
    manifest = load_json(root / "data/source-manifest.json")
    expected = {entry["path"]: entry["sha256"] for entry in manifest["files"]}
    for name in ("demand", "supply_sources", "storage_options", "investment_options", "constraints"):
        path = root / f"data/reference/{name}.csv"
        hashes[name] = hashlib.sha256(path.read_bytes()).hexdigest()
        if hashes[name] != expected.get(f"data/original/organizer/data/{name}.csv"):
            raise ValueError(f"Контрольная таблица {name} изменена; используйте исследовательскую копию")
        with path.open(encoding="utf-8", newline="") as stream:
            tables[name] = list(csv.DictReader(stream))
    sources = {r["source_id"]: dict(r) for r in tables["supply_sources"]}
    for key, inv in (("C", "EARTH_NEW"), ("D", "LUNAR_ISRU")):
        sources[key]["investment_id"] = inv
    return {"dataset_id": "case-v1", "scope": "CASE_INPUT", "hashes": hashes,
            "sources": sources, "demand": {r["year"]: r for r in tables["demand"]},
            "storage": {r["storage_id"]: r for r in tables["storage_options"]},
            "investments": {r["investment_id"]: r for r in tables["investment_options"]},
            "constraints": tables["constraints"], "research_notes": []}


def validate_dataset(data, first_year, last_year):
    if not data.get("dataset_id") or not data.get("sources"):
        raise ValueError("Нужны dataset_id и хотя бы один источник")
    if first_year > last_year or last_year - first_year > 30:
        raise ValueError("Горизонт должен содержать от 1 до 31 года")
    if data.get("scope") == "CASE_INPUT" and (first_year, last_year) != (2035, 2040):
        raise ValueError("Контрольный набор имеет горизонт 2035–2040; расширение — только на исследовательской копии")
    for year in range(first_year, last_year + 1):
        if str(year) not in data["demand"]:
            raise ValueError(f"Нет спроса за {year}")
        r = data["demand"][str(year)]
        total = number(r["base_total_t"], minimum=ZERO)
        number(r["base_critical_t"], minimum=ZERO, maximum=total)
        for field in ("low_total_t", "high_total_t"):
            number(r[field], minimum=ZERO)
    for sid, source in data["sources"].items():
        if source["source_id"] != sid or not sid or len(sid) > 40:
            raise ValueError("Некорректный идентификатор источника")
        for field in ("capacity_t_per_year", "variable_cost_mln_per_t", "reservation_rate_mln_per_t_year_capacity", "lead_time_min_value", "lead_time_max_value"):
            number(source[field], field, minimum=ZERO)
        number(source["take_or_pay_share"], minimum=ZERO, maximum=1)
        if number(source["lead_time_min_value"]) > number(source["lead_time_max_value"]):
            raise ValueError("Минимальный срок больше максимального")
        if source["lead_time_unit"] not in ("day", "week", "month", "year"):
            raise ValueError("Неизвестная единица срока")
        if not source.get("reliability_profile"):
            raise ValueError("Для источника нужна явно заданная метаинформация надёжности")
    if last_year > 2040 and not data.get("extension_constraints"):
        raise ValueError("Для расширения после 2040 нужны явные ограничения extension_constraints")
    if last_year > 2040:
        ext = data["extension_constraints"]
        for key, supported in (("service_total", ".97"), ("service_critical", ".99"), ("reserve_days", "45"), ("emergency_max_planned_streak_years", "2")):
            if key not in ext or number(ext[key]) != number(supported):
                raise ValueError(f"Расширение должно явно сохранять {key}={supported}; иные значения пока не поддерживаются")
        if not ext.get("capex_budgets"):
            raise ValueError("Для расширения нужно явно задать накопительные бюджеты")


def scenario_named(name, root=ROOT):
    if name in ("BASE", "MANDATORY_STRESS"):
        filename = "base" if name == "BASE" else "mandatory_stress"
        return load_json(root / f"configs/scenarios/{filename}.json")
    if name in ("LOW", "HIGH"):
        scenario = scenario_named("BASE", root)
        scenario.update(scenario_id=name, demand_profile=name.lower(), status="CASE_SENSITIVITY")
        return scenario
    raise ValueError(f"Неизвестный сценарий: {name}")


def demand_for(data, scenario, year):
    row = data["demand"][str(year)]
    total = number(row[scenario.get("demand_profile", "base") + "_total_t"])
    base = number(row["base_total_t"])
    critical = total * number(row["base_critical_t"]) / base if base else ZERO
    multiplier = number(scenario.get("demand_multipliers_by_year", {}).get(str(year), scenario.get("demand_multiplier_default", 1)), minimum=ZERO)
    return total * multiplier, critical * multiplier


def factor(scenario, field, source, year, default=1):
    return number(scenario.get(field, {}).get(source, {}).get(str(year), default), minimum=ZERO)


def delivery_delay(scenario, source, year, planned_at):
    days = factor(scenario, "delivery_delays_days_by_source_year", source, year, 0)
    for window in scenario.get("delivery_delay_windows", []):
        if window["source"] == source and time(window["planned_from"]) <= time(planned_at) < time(window["planned_until"]):
            # Overlapping declarations describe one delay, not a duplicate shock.
            days = max(days, number(window["delay_days"], minimum=ZERO))
    return days


def research_scenario(name, **changes):
    if not name.startswith("TEAM_"):
        raise ValueError("Исследовательский сценарий должен иметь префикс TEAM_")
    result = copy.deepcopy(scenario_named("BASE"))
    result.update(scenario_id=name, status="TEAM_ASSUMPTION", service_threshold_mode="target")
    result.update(changes)
    return result
