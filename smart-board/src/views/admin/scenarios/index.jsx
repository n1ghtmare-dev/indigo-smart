import React, { useEffect, useState } from "react";
import Card from "components/card";
import { apiFetch } from "config/auth";
import { useLiveEvents } from "contexts/LiveEvents";
import { MdLocalFireDepartment, MdPlayArrow } from "react-icons/md";

const PHASE_LABEL = {
  start: "Запуск…",
  rising: "🌡️ Температура растёт…",
  rule_fired: "❄️ Дом включает кондиционер…",
  cooling: "📉 Температура снижается…",
  resolved: "✅ Проблема устранена",
  error: "⚠️ Нет подходящих устройств",
};

const Scenarios = () => {
  const { subscribe } = useLiveEvents();
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(null);

  useEffect(() => {
    apiFetch("/scenario/state")
      .then((r) => r.json())
      .then((s) => { setRunning(!!s.running); setPhase(s.phase); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const unsub = subscribe((msg) => {
      if (msg.type !== "scenario_step") return;
      setPhase(msg.phase);
      setRunning(msg.phase !== "resolved" && msg.phase !== "error");
    });
    return unsub;
  }, [subscribe]);

  const launch = async () => {
    setRunning(true);
    setPhase("start");
    const r = await apiFetch("/scenario/overheat/start", { method: "POST" });
    if (!r.ok) {
      setRunning(false);
      if (r.status === 409) alert("Сценарий уже выполняется");
    }
  };

  return (
    <div className="pt-4">
      <div className="mb-6">
        <span className="pill pill-cyan">демонстрация</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
          Демо-<span className="text-grad">сценарии</span>
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Запускайте аварийные ситуации — система отреагирует на всех устройствах разом.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card extra="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
              <MdLocalFireDepartment className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Перегрев помещения</h3>
              <p className="text-sm text-gray-600">
                Температура поднимается выше нормы — дом автоматически включает кондиционер.
              </p>
            </div>
          </div>

          <button
            onClick={launch}
            disabled={running}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MdPlayArrow className="h-5 w-5" />
            {running ? "Сценарий идёт…" : "Запустить сценарий"}
          </button>

          {phase && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/80">
              {PHASE_LABEL[phase] || phase}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Scenarios;
