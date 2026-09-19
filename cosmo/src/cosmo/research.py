"""Explicit research inputs, not forecasts or modifications of case-v1."""
import copy

from .case_data import load_dataset, research_scenario


def extension_dataset():
    data = copy.deepcopy(load_dataset())
    data.update(dataset_id="TEAM_EXTENSION_2041_X_V1", scope="TEAM_ASSUMPTION")
    data["demand"]["2041"] = {"year": "2041", "base_total_t": "429", "base_critical_t": "275",
                              "low_total_t": "343.2", "high_total_t": "536.25", "status": "TEAM_ASSUMPTION"}
    source = copy.deepcopy(data["sources"]["B"])
    source.update(source_id="X", name="Source-X (synthetic research)", capacity_t_per_year="40",
                  variable_cost_mln_per_t="7.5", reservation_rate_mln_per_t_year_capacity="0.2",
                  lead_time_min_value="3", lead_time_max_value="3", available_from_year="2041",
                  reliability_profile="TEAM_ASSUMPTION constant:0.90", status="TEAM_ASSUMPTION",
                  include_in_research_planner=True, notes="Synthetic sixth source; not an organizer forecast")
    data["sources"]["X"] = source
    data["sources"]["D"]["reliability_profile"] += ";2041:TEAM_ASSUMPTION:0.93"
    data["extension_constraints"] = {"capex_budgets": [{"cutoff": "2555", "limit_mln": "2800"}],
                                    "service_total": "0.97", "service_critical": "0.99", "reserve_days": "45",
                                    "emergency_max_planned_streak_years": 2}
    data["research_notes"] = ["2041 demand is 2040 BASE ×1.10; low/high are ×0.8/1.25 of that value.",
                              "All existing source real prices and capacities held constant at case levels, not forecast estimates.",
                              "2041 D reliability held at 0.93 as metadata, not as a delivery multiplier.",
                              "2041 cumulative CAPEX ceiling explicitly retained at 2800; service and reserve rules explicitly retained.",
                              "Source-X capacity40, price7.5, reservation0.2, TOP0, lead3months, reliability0.90 are synthetic inputs."]
    return data


def risk_scenarios():
    return [
        {"risk_id": "RISK_A_DELAY", "title": "Партии Earth-Core первого полугодия 2038 задержаны на 90 дней", "owner": "Руководитель логистики",
         "cause": "Сдвиг пускового окна/графика; 30–90 дней — исследовательский диапазон, не статистика", "dependencies": "Совпадение с ростом спроса усиливает эффект; здесь не сложено с mandatory stress",
         "measure": "Добавочные B/E-заказы после выявления; сроки сохраняются", "scenario": research_scenario("TEAM_A_DELAY_90", delivery_delay_windows=[{"source": "A", "planned_from": "1095", "planned_until": "2555/2", "delay_days": "90"}])},
        {"risk_id": "RISK_C_DELAY", "title": "Партии нового поставщика мая–октября 2038 задержаны на 60 дней", "owner": "Менеджер нового поставщика",
         "cause": "Незрелость первого эксплуатационного года; диапазон 30–90 дней выбран командой", "dependencies": "Ввод C и доступность B; не интерпретируется как вероятность 0.12",
         "measure": "Сохранённый резерв мощности B и дополнительные заказы; остаточный дефицит показан", "scenario": research_scenario("TEAM_C_DELAY_60", delivery_delay_windows=[{"source": "C", "planned_from": "1095", "planned_until": "8395/6", "delay_days": "60"}])},
        {"risk_id": "RISK_DEMAND", "title": "Спрос +25% с 2038", "owner": "Оператор и потребители",
         "cause": "Проверка внеплановых миссий; сценарный диапазон +5…+30%, не прогноз", "dependencies": "Увеличивает резерв и потребность во всех каналах одновременно",
         "measure": "Законтрактованная гибкость и своевременный дозаказ; прошлый начальный запас задним числом не меняется", "scenario": research_scenario("TEAM_DEMAND_125", demand_multipliers_by_year={"2038": "1.25", "2039": "1.25", "2040": "1.25"})},
        {"risk_id": "RISK_PRICE", "title": "Земные A/B цены +50% в 2038–2039", "owner": "Финансовый директор",
         "cause": "Исследовательский ценовой шок, диапазон +10…+50%; компоненты цены не выдумываются", "dependencies": "Цена не создаёт физическую недопоставку сама по себе",
         "measure": "Сравнение диверсификации; при текущем плане повышение затрат сохраняется, компенсация не моделируется", "scenario": research_scenario("TEAM_PRICE_150", variable_price_multipliers_by_source_year={"A": {"2038": "1.5", "2039": "1.5"}, "B": {"2038": "1.5", "2039": "1.5"}})},
        {"risk_id": "RISK_CAPEX", "title": "CAPEX +30%", "owner": "Инвестор и инженер проекта",
         "cause": "Проверка 10–30% перерасхода без вероятностной калибровки", "dependencies": "Для капиталоёмкой архитектуры может нарушить лимит до 2038",
         "measure": "Переход к менее капиталоёмкой альтернативе до инвестиционного решения; после оплаты прошлые платежи не отменяются", "scenario": research_scenario("TEAM_CAPEX_130", capex_multiplier="1.3")},
        {"risk_id": "RISK_D_SUPPLY", "title": "ISRU: только 50% плана в 2038", "owner": "Оператор ISRU",
         "cause": "Исследовательская фактическая недопоставка; коэффициент 0.5 не умножается ещё раз на 0.78", "dependencies": "Риск относится к лунной альтернативе; отсутствие D в выбранном плане тоже численный результат",
         "measure": "Дополнительный B при наличии резерва; альтернативная архитектура без D", "scenario": research_scenario("TEAM_D_HALF", actual_delivery_shares_by_source_year={"D": {"2038": "0.5"}})},
    ]
