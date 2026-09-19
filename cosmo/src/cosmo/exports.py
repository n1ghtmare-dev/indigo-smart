"""Portable, reproducible run packages and compact summaries."""
import csv
import hashlib
import html
import json
import os
import platform
from zipfile import ZIP_DEFLATED, ZipFile
from datetime import datetime, timezone
from dataclasses import asdict, is_dataclass
from decimal import Decimal
from pathlib import Path

from . import __version__
from .case_data import ROOT
from .common import ZERO, json_value


def dump_json(path, payload):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(json_value(payload), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def csv_text(rows):
    import io
    rows = json_value(rows)
    stream = io.StringIO(newline="")
    fields = list(dict.fromkeys(k for row in rows for k in row)) if rows else ["no_current_rows"]
    writer = csv.DictWriter(stream, fieldnames=fields)
    writer.writeheader()
    writer.writerows(rows)
    return stream.getvalue()


def write_csv(path, rows):
    Path(path).write_text(csv_text(rows), encoding="utf-8")


def result_summary(result):
    annual = result.get("annual", [])
    economic = result.get("economics") or {}
    physical = result.get("physical") or {}
    intervals = [row for row in physical.get("intervals", [])
                 if annual and row.get("year", annual[0]["year"] - 1) >= annual[0]["year"]]
    reserve_margins = [row["opening_t"] - row["required_reserve_t"] for row in annual]
    rejected_t = sum((row.get("rejected_gross_t", ZERO) + row.get("curtailed_inventory_t", ZERO)
                      for row in annual), ZERO) if annual else None
    key_issue = next((v for severity in ("hard", "target") for v in result["violations"]
                      if v.severity == severity), None)
    return {"plan_id": result["plan_id"], "scenario_id": result["scenario_id"], "status": result["status"],
            "total_mln": economic.get("total_mln"), "pv_mln": economic.get("pv_mln"),
            "capex_mln": economic.get("components_mln", {}).get("capex"),
            "cost_per_served_t": economic.get("cost_per_served_t"),
            "served_t": sum((r["served_t"] for r in annual), ZERO) if annual else None,
            "rejected_t": rejected_t,
            "shortage_t": sum((r["shortage_t"] for r in annual), ZERO) if annual else None,
            "critical_shortage_t": sum((r["shortage_critical_t"] for r in annual), ZERO) if annual else None,
            "worst_total_service": min((r["total_service"] for r in annual if r["total_service"] is not None), default=None),
            "worst_critical_service": min((r["critical_service"] for r in annual if r["critical_service"] is not None), default=None),
            "minimum_inventory_t": min((r["closing_t"] for r in intervals), default=None),
            "final_inventory_t": annual[-1]["closing_t"] if annual else None,
            "minimum_reserve_margin_t": min(reserve_margins, default=None),
            "hard_violations": sum(v.severity == "hard" for v in result["violations"]),
            "target_violations": sum(v.severity == "target" for v in result["violations"]),
            "key_violation": key_issue.code if key_issue else None,
            "violation_codes": ";".join(sorted({v.code for v in result["violations"]})),
            "max_violation_excess": max((v.excess for v in result["violations"]), default=ZERO),
            "audit_status": result.get("audit", {}).get("status", "NOT_APPLICABLE")}


def fmt(value, digits=3):
    if value is None:
        return "—"
    if isinstance(value, (Decimal, float)):
        return f"{value:,.{digits}f}".replace(",", " ")
    return str(value)


def table(rows, columns):
    def cell(value):
        return html.escape(fmt(value))
    rows = [asdict(row) if is_dataclass(row) else row for row in rows]
    return "<table><thead><tr>" + "".join("<th>" + html.escape(label) + "</th>" for _, label in columns) + "</tr></thead><tbody>" + "".join("<tr>" + "".join("<td>" + cell(row.get(key)) + "</td>" for key, _ in columns) + "</tr>" for row in rows) + "</tbody></table>"


def html_document(title, body, css_url="../../docs/plain.css", home_url="../../docs/index.html"):
    return '<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + html.escape(title) + '</title><link rel="stylesheet" href="' + html.escape(css_url, quote=True) + '"></head><body><main><nav><a href="' + html.escape(home_url, quote=True) + '">Документация проекта</a></nav><h1>' + html.escape(title) + '</h1>' + body + '</main></body></html>\n'


def export_run(directory, plan, dataset, scenario, result, *, reference=None, include_inventory=True, create_bundle=True):
    directory = Path(directory).resolve()
    directory.mkdir(parents=True, exist_ok=True)
    package = {"plan": plan, "dataset": dataset, "scenario": scenario, "reference_plan": reference}
    canonical = json.dumps(json_value(package), sort_keys=True, ensure_ascii=False, separators=(",", ":")).encode()
    metadata = {"generated_at_utc": datetime.now(timezone.utc).isoformat(), "engine_version": __version__,
                "python_version": platform.python_version(), "package_sha256": hashlib.sha256(canonical).hexdigest(),
                "source_sha256": {str(p.relative_to(ROOT)): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted((ROOT / "src/cosmo").glob("*.py"))}}
    dump_json(directory / "input-package.json", package)
    dump_json(directory / "plan.json", plan)
    summary = result_summary(result)
    summary.update({"data_version": result.get("dataset_id", dataset.get("dataset_id")),
                    "policy_version": result.get("policy_id", plan.get("policy", {}).get("policy_id")),
                    "calculated_at_utc": metadata["generated_at_utc"],
                    "engine_version": metadata["engine_version"],
                    "input_sha256": metadata["package_sha256"],
                    "compact_export": not include_inventory})
    full = copy_without_inventory(result) if not include_inventory else result
    dump_json(directory / "result.json", {"metadata": metadata, "summary": summary, "result": full})
    economic = result.get("economics") or {}
    physical = result.get("physical") or {}
    for filename, rows in (("annual.csv", result.get("annual", [])), ("preparation.csv", [result["preparation"]] if result.get("preparation") else []),
                           ("payments.csv", economic.get("payments", [])), ("contracts.csv", result.get("contracts", [])),
                           ("deliveries.csv", result.get("deliveries", [])), ("violations.csv", result.get("violations", [])),
                           ("inventory.csv", physical.get("intervals", []) if include_inventory else [])):
        write_csv(directory / filename, rows)
    body = '<p class="note">Результат условен относительно раскрытых допущений ' + html.escape(plan['policy']['policy_id']) + '. Это учебный кейс, не инженерный проект. Нет статистической гарантии надёжности.</p>'
    body += '<p class="note">Версия данных: ' + html.escape(str(summary["data_version"])) + '; политика: ' + html.escape(str(summary["policy_version"])) + '; расчёт UTC: ' + html.escape(summary["calculated_at_utc"]) + '; SHA-256 входов: <code>' + html.escape(summary["input_sha256"]) + '</code>.</p>'
    body += table([summary], [("scenario_id", "Сценарий"), ("status", "Статус"), ("total_mln", "Всего, млн"), ("pv_mln", "PV, млн"), ("capex_mln", "CAPEX, млн"), ("rejected_t", "Не принято, т"), ("shortage_t", "Дефицит, т"), ("critical_shortage_t", "Крит. дефицит, т"), ("worst_total_service", "Общий сервис"), ("worst_critical_service", "Крит. сервис"), ("minimum_inventory_t", "Мин. запас, т"), ("final_inventory_t", "Конечный запас, т"), ("minimum_reserve_margin_t", "Мин. запас сверх норматива, т"), ("key_violation", "Ключевое нарушение")])
    body += '<h2>По годам</h2>' + table(result.get("annual", []), [("year", "Год"), ("opening_t", "Начало, т"), ("required_reserve_t", "Норматив, т"), ("offered_gross_t", "Предложено, т"), ("gross_t", "Принято, т"), ("rejected_gross_t", "Не принято, т"), ("losses_t", "Потери, т"), ("served_t", "Выдача, т"), ("shortage_t", "Дефицит, т"), ("shortage_critical_t", "Крит. дефицит, т"), ("closing_t", "Конец, т"), ("total_service", "Общий сервис"), ("critical_service", "Крит. сервис")])
    body += '<h2>Нарушения</h2>' + table(result.get("violations", []), [("code", "Правило"), ("at", "День"), ("subject", "Объект"), ("actual", "Факт"), ("limit", "Предел"), ("excess", "Отклонение"), ("severity", "Тип")])
    if not result.get("annual"):
        body += '<p>Расчёт остановлен. Итоговые стоимость и обслуживание не выдумываются; см. нарушение выше.</p>'
    inventory_label = 'Дневной запас CSV' if include_inventory else 'Запас CSV (дневной журнал исключён)'
    bundle_link = '<a href="run-package.zip">Единый пакет ZIP</a> · <a href="manifest.json">Метаданные JSON</a> · ' if create_bundle else ''
    body += '<h2>Воспроизведение</h2><p>' + bundle_link + '<a href="input-package.json">Полный пакет входов</a> · <a href="result.json">Результат и хеши</a> · <a href="annual.csv">Годы CSV</a> · <a href="deliveries.csv">Поставки CSV</a> · <a href="payments.csv">Платежи CSV</a> · <a href="violations.csv">Нарушения CSV</a> · <a href="inventory.csv">' + inventory_label + '</a></p>'
    body += '<pre><code>python3 scripts/run_case.py --package ' + html.escape(os.path.relpath(directory / "input-package.json", ROOT)) + ' --output results/replayed</code></pre>'
    css = os.path.relpath(ROOT / "docs/plain.css", directory)
    home = os.path.relpath(ROOT / "docs/index.html", directory)
    (directory / "report.html").write_text(html_document(plan["plan_id"], body, css, home), encoding="utf-8")
    manifest = {
        "schema_version": 1,
        "generated_at_utc": metadata["generated_at_utc"],
        "engine_version": metadata["engine_version"],
        "input_sha256": metadata["package_sha256"],
        "data_version": summary["data_version"],
        "policy_version": summary["policy_version"],
        "scenario_id": result["scenario_id"],
        "units": {"mass": "t", "money": "million constant 2035 units", "time": "model day, 365 days/year", "service": "share 0..1"},
        "assumptions": {"scope": plan.get("scope"), "conditional_on_team_assumptions": result.get("conditional_on_team_assumptions", False),
                        "research_notes": dataset.get("research_notes", []), "policy_resolutions": plan.get("policy", {}).get("resolutions", {})},
        "compact_export": not include_inventory,
        "omitted": ["daily physical inventory intervals"] if not include_inventory else [],
        "files": ["input-package.json", "plan.json", "result.json", "annual.csv", "preparation.csv", "payments.csv",
                  "contracts.csv", "deliveries.csv", "violations.csv", "inventory.csv", "report.html"]
    }
    if create_bundle:
        dump_json(directory / "manifest.json", manifest)
        with ZipFile(directory / "run-package.zip", "w", ZIP_DEFLATED) as archive:
            for filename in manifest["files"] + ["manifest.json"]:
                archive.write(directory / filename, arcname=filename)
    return summary


def copy_without_inventory(result):
    result = dict(result)
    if result.get("physical"):
        result["physical"] = {**result["physical"], "intervals": [], "intervals_omitted_from_compact_export": True}
    if result.get("partial_physical"):
        result["partial_physical"] = {**result["partial_physical"], "intervals": [], "intervals_omitted_from_compact_export": True}
    return result
