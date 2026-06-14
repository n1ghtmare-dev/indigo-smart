import React, { useEffect, useState } from "react";
import { apiFetch } from "config/auth";
import { useLiveEvents } from "contexts/LiveEvents";
import { MdLocalFireDepartment } from "react-icons/md";

const PHASE_LABEL = {
  start: "Запуск…",
  rising: "🌡️ Температура растёт…",
  rule_fired: "❄️ Включаем кондиционер…",
  cooling: "📉 Снижается…",
  resolved: "✅ Готово",
  error: "⚠️ Нет устройств",
};

// Кнопка запуска демо-сценария «Перегрев». Самодостаточна: сама знает состояние
// (через live-канал) и блокируется на время прогона. Можно ставить на любую
// страницу — в т.ч. на главную, чтобы запускать прямо с телефона.
export default function ScenarioLaunchButton({ className = "" }) {
  const { subscribe } = useLiveEvents();
  const [phase, setPhase] = useState(null);
  const running = phase !== null && phase !== "resolved" && phase !== "error";

  useEffect(() => {
    apiFetch("/scenario/state")
      .then((r) => r.json())
      .then((s) => setPhase(s.phase))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const unsub = subscribe((msg) => {
      if (msg.type === "scenario_step") setPhase(msg.phase);
    });
    return unsub;
  }, [subscribe]);

  const launch = async () => {
    setPhase("start");
    try {
      const r = await apiFetch("/scenario/overheat/start", { method: "POST" });
      if (!r.ok) {
        setPhase(null);
        if (r.status === 409) alert("Сценарий уже выполняется");
      }
    } catch {
      setPhase(null);
    }
  };

  return (
    <button
      onClick={launch}
      disabled={running}
      className={`flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      <MdLocalFireDepartment className="h-5 w-5" />
      {running ? PHASE_LABEL[phase] || "Идёт…" : "Запустить демо"}
    </button>
  );
}
