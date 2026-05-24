import React, { useState, useEffect } from "react";
import Card from "components/card";
import { apiFetch } from "config/auth";
import { MdSecurity, MdFilterAlt } from "react-icons/md";

const ACTION_COLORS = {
  login: "pill-green",
  logout: "pill",
  device_state: "pill-cyan",
  rule_create: "pill-gold",
  scene_create: "pill-gold",
  simulator_event: "pill",
};

const Audit = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const q = filter ? `?action=${filter}` : "";
    apiFetch(`/audit${q}`).then((r) => r.json()).then(setLogs);
    apiFetch("/audit/stats").then((r) => r.json()).then(setStats);
  }, [filter]);

  return (
    <div className="pt-4">
      <div className="mb-6">
        <span className="pill">{logs.length} записей · триггеры MySQL</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
          Журнал <span className="text-grad">действий</span>
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Заполняется автоматически через триггеры AFTER INSERT в device_states, automation_rules и scenes.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.action} extra="!p-4">
            <p className="text-[11px] uppercase tracking-wider text-gray-600">{s.action}</p>
            <p className="mt-1 text-2xl font-extrabold text-grad">{s.cnt}</p>
            <p className="text-[11px] text-gray-600">{s.pct}% от всех</p>
          </Card>
        ))}
      </div>

      <Card extra="!p-5 mt-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">События</h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
          >
            <option value="">Все действия</option>
            {stats.map((s) => <option key={s.action} value={s.action}>{s.action}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          {logs.map((l) => (
            <div
              key={l.id}
              className="grid grid-cols-[140px_1fr_120px_auto] items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5"
            >
              <span className="font-mono text-[11px] text-gray-600">
                {new Date(l.occurred_at).toLocaleString("ru-RU")}
              </span>
              <div>
                <span className={`pill ${ACTION_COLORS[l.action] || ""}`}>{l.action}</span>
                {l.entity_type && (
                  <span className="ml-2 text-xs text-gray-600">
                    {l.entity_type} #{l.entity_id}
                  </span>
                )}
              </div>
              <span className="text-xs text-white truncate">{l.user_name}</span>
              <span className="font-mono text-[10px] text-gray-700 truncate max-w-[300px]">
                {l.details ? JSON.stringify(l.details).substring(0, 80) : ""}
              </span>
            </div>
          ))}
          {logs.length === 0 && <p className="py-8 text-center text-gray-600">Записей нет</p>}
        </div>
      </Card>
    </div>
  );
};

export default Audit;
