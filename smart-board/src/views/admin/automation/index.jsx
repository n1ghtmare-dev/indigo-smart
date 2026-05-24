import React, { useState, useEffect } from "react";
import Card from "components/card";
import { apiFetch } from "config/auth";
import { MdAdd, MdDelete, MdAutoAwesome, MdToggleOn, MdToggleOff } from "react-icons/md";

const Automation = () => {
  const [rules, setRules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [devices, setDevices] = useState([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sensor_device_id: "",
    reading_type: "temperature",
    operator: ">",
    threshold_value: 25,
    target_device_id: "",
    action_state_value: "1",
    cooldown_seconds: 300,
  });

  const refresh = () => {
    apiFetch("/rules").then((r) => r.json()).then(setRules);
    apiFetch("/rules/log").then((r) => r.json()).then(setLogs);
    apiFetch("/devices").then((r) => r.json()).then(setDevices);
  };

  useEffect(refresh, []);

  const toggle = async (id, enabled) => {
    await apiFetch(`/rules/${id}?enabled=${!enabled}`, { method: "PATCH" });
    refresh();
  };

  const remove = async (id) => {
    if (!window.confirm("Удалить правило?")) return;
    await apiFetch(`/rules/${id}`, { method: "DELETE" });
    refresh();
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      sensor_device_id: +form.sensor_device_id || null,
      target_device_id: +form.target_device_id,
      threshold_value: +form.threshold_value,
      action_state_type: "ON/OFF",
    };
    await apiFetch("/rules", { method: "POST", body: JSON.stringify(payload) });
    setCreating(false);
    refresh();
  };

  const sensors = devices.filter((d) => d.is_sensor);
  const actuators = devices.filter((d) => !d.is_sensor);

  return (
    <div className="pt-4">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="pill pill-gold">{rules.length} правил · {rules.filter(r => r.enabled).length} активных</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
            Правила <span className="text-grad">автоматизации</span>
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            «Если в спальне жарко &gt; 26°C — включить кондиционер». Если-то логика для дома.
          </p>
        </div>
        <button onClick={() => setCreating(!creating)} className="btn-primary">
          <MdAdd className="inline" /> {creating ? "Отмена" : "Создать правило"}
        </button>
      </div>

      {creating && (
        <Card extra="!p-6 mb-5">
          <form onSubmit={submit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-[11px] uppercase tracking-wider text-gray-600">Название</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wider text-gray-600">Сенсор</span>
              <select
                value={form.sensor_device_id}
                onChange={(e) => setForm({ ...form, sensor_device_id: e.target.value })}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white"
              >
                <option value="">Выберите...</option>
                {sensors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wider text-gray-600">Тип показания</span>
              <select
                value={form.reading_type}
                onChange={(e) => setForm({ ...form, reading_type: e.target.value })}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white"
              >
                <option value="temperature">temperature</option>
                <option value="humidity">humidity</option>
                <option value="motion">motion</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wider text-gray-600">Условие</span>
              <div className="flex gap-2">
                <select
                  value={form.operator}
                  onChange={(e) => setForm({ ...form, operator: e.target.value })}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white"
                >
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value=">=">≥</option>
                  <option value="<=">≤</option>
                  <option value="motion">motion</option>
                </select>
                <input
                  type="number"
                  step="0.1"
                  value={form.threshold_value}
                  onChange={(e) => setForm({ ...form, threshold_value: e.target.value })}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white"
                />
              </div>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wider text-gray-600">Cooldown (сек)</span>
              <input
                type="number"
                value={form.cooldown_seconds}
                onChange={(e) => setForm({ ...form, cooldown_seconds: +e.target.value })}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wider text-gray-600">Целевое устройство</span>
              <select
                value={form.target_device_id}
                onChange={(e) => setForm({ ...form, target_device_id: e.target.value })}
                required
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white"
              >
                <option value="">Выберите...</option>
                {actuators.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wider text-gray-600">Действие</span>
              <select
                value={form.action_state_value}
                onChange={(e) => setForm({ ...form, action_state_value: e.target.value })}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white"
              >
                <option value="1">Включить</option>
                <option value="0">Выключить</option>
              </select>
            </label>
            <button type="submit" className="btn-primary md:col-span-2 mt-2">Создать правило</button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card extra="!p-5">
          <h3 className="mb-3 text-xl font-bold text-white">Правила</h3>
          <div className="flex flex-col gap-2">
            {rules.map((r) => {
              const sensor = devices.find((d) => d.id === r.sensor_device_id);
              const target = devices.find((d) => d.id === r.target_device_id);
              return (
                <div key={r.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{r.name}</p>
                      <p className="mt-1 text-xs text-gray-600">
                        ЕСЛИ {sensor?.name || `#${r.sensor_device_id}`}.{r.reading_type} {r.operator} {r.threshold_value}
                      </p>
                      <p className="text-xs text-cyan-300">
                        ТО {target?.name || `#${r.target_device_id}`} → {r.action_state_value === "1" ? "ВКЛ" : "ВЫКЛ"}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => toggle(r.id, r.enabled)} className="p-1 text-white">
                        {r.enabled ? <MdToggleOn className="h-7 w-7 text-green-400" /> : <MdToggleOff className="h-7 w-7 text-gray-500" />}
                      </button>
                      <button onClick={() => remove(r.id)} className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-red-300">
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {rules.length === 0 && <p className="py-6 text-center text-sm text-gray-600">Пока нет правил</p>}
          </div>
        </Card>

        <Card extra="!p-5">
          <h3 className="mb-3 text-xl font-bold text-white">Журнал срабатываний</h3>
          <div className="flex flex-col gap-1.5">
            {logs.slice(0, 12).map((l) => (
              <div key={l.id} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div>
                  <p className="text-xs text-gray-600">
                    {new Date(l.triggered_at).toLocaleString("ru-RU")}
                  </p>
                  <p className="text-sm font-medium text-white">{l.message}</p>
                </div>
                <span className={`pill ${l.result === "success" ? "pill-green" : "pill-red"}`}>
                  {l.result}
                </span>
              </div>
            ))}
            {logs.length === 0 && <p className="py-6 text-center text-sm text-gray-600">Срабатываний пока не было</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Automation;
