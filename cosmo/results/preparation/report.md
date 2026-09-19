# Проверка подготовки

Статус: **PASS**. Проверок: 40; ошибок: 0.

Это проверка исходных данных и конфигураций, не проверка исполнимости плана снабжения.

Дата UTC: 2026-09-18T22:22:27.760975+00:00. Python: 3.14.3.

Команда: `python3 scripts/verify_preparation.py --write-report`.

| Проверка | Результат |
|---|---|
| original:data/original/organizer/README.md | PASS  |
| original:data/original/organizer/data/README.md | PASS  |
| original:data/original/organizer/data/constraints.csv | PASS  |
| original:data/original/organizer/data/demand.csv | PASS  |
| original:data/original/organizer/data/investment_options.csv | PASS  |
| original:data/original/organizer/data/storage_options.csv | PASS  |
| original:data/original/organizer/data/supply_sources.csv | PASS  |
| original:data/original/organizer/docs/CALCULATION_RULES.md | PASS  |
| original:data/original/organizer/docs/CASE_RULES.md | PASS  |
| original:data/original/organizer/docs/DATA_DICTIONARY.md | PASS  |
| original:data/original/organizer/docs/FAQ.md | PASS  |
| original:data/original/organizer/docs/SCIENTIFIC_BASIS.md | PASS  |
| original:data/original/organizer/docs/STRESS_PROTOCOL.md | PASS  |
| original:data/original/organizer/scenarios/README.md | PASS  |
| original:data/original/organizer/scenarios/base.yaml | PASS  |
| original:data/original/organizer/scenarios/mandatory_stress.yaml | PASS  |
| original:data/original/organizer/validation/control_cases.md | PASS  |
| original:data/original/organizer/validation/expected_checks.json | PASS  |
| original:data/original/pdf/additional.pdf | PASS  |
| original:data/original/pdf/case-statement.pdf | PASS  |
| original:data/original/pdf/evaluation-criteria.pdf | PASS  |
| manifest | PASS  |
| reference:demand | PASS  |
| reference:supply_sources | PASS  |
| reference:storage_options | PASS  |
| reference:investment_options | PASS  |
| reference:constraints | PASS  |
| golden:demand | PASS  |
| golden:supply | PASS  |
| golden:storage | PASS  |
| golden:investments | PASS  |
| golden:constraints | PASS  |
| scenario:base | PASS  |
| scenario:mandatory_stress | PASS  |
| model:explicit_conventions | PASS  |
| criteria:20_evidence_map | PASS  |
| derived:scenario_inputs_only | PASS  |
| fingerprint:data/source-manifest.json | PASS  |
| fingerprint:configs/model.json | PASS  |
| fingerprint:configs/acceptance.json | PASS  |

Ограничения: исходный XLSX отсутствует; ERRATA_AND_PROVENANCE.md не найден в сохранённом коммите; Q01–Q05 открыты; ядро проверено на синтетических примерах, интеграция полного кейса ещё не выполнена.

Хеши прочитанных входных файлов — в report.json. Таблица scenario-inputs.csv содержит только входы четырёх сценариев (24 строки), не поставки или финансовые результаты. Критический спрос LOW/HIGH вычислен пропорционально общему по правилу кейса и FAQ (CASE_INPUT_DERIVED).
