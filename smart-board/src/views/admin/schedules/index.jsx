import React, { useState, useEffect } from "react";
import Card from "components/card";
import { apiFetch } from "config/auth";
import { MdAdd, MdDelete, MdSchedule } from "react-icons/md";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const Schedules = () => {
  const [items, setItems] = useState([]);
  const [devices, setDevices] = useState([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "", device_id: "", state_value: "1", fire_time: "19:00",
    days: [true, true, true, true, true, false, false],
  });

  const refresh = () => {
    apiFetch("/schedules").then((r) => r.json()).then(setItems);
    apiFetch("/devices").then((r) => r.json()).then((d) =>
      setDevices(d.filter((x) => !x.is_sensor))
    );
  };
  useEffect(refresh, []);

  const mask = (days) => days.reduce((acc, on, i) => (on ? acc | (1 << i) : acc), 0);

  const submit = async (e) => {
    e.preventDefault();
    await apiFetch("/schedules", {
      method: "POST",
      body: JSON.stringify({
        name: form.name,
        device_id: +form.device_id,
        state_type: "ON/OFF",
        state_value: form.state_value,
        fire_time: form.fire_time + ":00",
        days_mask: mask(form.days) || 127,
      }),
    });
    setCreating(false);
    refresh();
  };

  const remove = async (id) => {
    if (!window.confirm("Удалить расписание?")) return;
    await apiFetch(`/schedules/${id}`, { method: "DELETE" });
    refresh();
  };

  return (
    <div className="pt-4">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="pill">{items.length} расписаний</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
            Расписания <span className="text-grad">включений</span>
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            «Включить свет в 19:00 каждый будний день»
          </p>
        </div>
        <button onClick={() => setCreating(!creating)} className="btn-primary">
          <MdAdd className="inline" /> {creating ? "Отмена" : "Создать"}
        </button>
      </div>

      {creating && (
        <Card extra="!p-6 mb-5">
          <form onSubmit={submit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              placeholder="Название"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="md:col-span-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white"
            />
            <select
              value={form.device_id}
              onChange={(e) => setForm({ ...form, device_id: e.target.value })}
              required
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white"
            >
              <option value="">Устройство...</option>
              {devices.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <select
              value={form.state_value}
              onChange={(e) => setForm({ ...form, state_value: e.target.value })}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white"
            >
              <option value="1">Включить</option>
              <option value="0">Выключить</option>
            </select>
            <input
              type="time"
              value={form.fire_time}
              onChange={(e) => setForm({ ...form, fire_time: e.target.value })}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white"
            />
            <div className="flex flex-wrap gap-1.5 self-center">
              {DAYS.map((d, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => {
                    const next = [...form.days];
                    next[i] = !next[i];
                    setForm({ ...form, days: next });
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    form.days[i]
                      ? "bg-indigo-500/20 border border-indigo-400/40 text-indigo-200"
                      : "border border-white/10 bg-white/[0.02] text-gray-600"
                  }`}
                >{d}</button>
              ))}
            </div>
            <button type="submit" className="btn-primary md:col-span-2 mt-2">Создать</button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => {
          const dev = devices.find((d) => d.id === s.device_id);
          return (
            <Card key={s.id} extra="!p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-600">Расписание</p>
                  <h3 className="mt-1 text-lg font-bold text-white">{s.name}</h3>
                </div>
                <div className="ico-grad flex h-9 w-9 items-center justify-center rounded-xl text-white">
                  <MdSchedule className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-extrabold text-grad">{s.fire_time.substring(0, 5)}</p>
              <p className="text-xs text-gray-600">
                {dev?.name || "—"} → {s.state_value === "1" ? "ВКЛ" : "ВЫКЛ"}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {DAYS.map((d, i) => (
                  <span
                    key={i}
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      s.days_mask & (1 << i)
                        ? "bg-cyan-500/20 text-cyan-200"
                        : "bg-white/[0.04] text-gray-700"
                    }`}
                  >{d}</span>
                ))}
              </div>
              <button onClick={() => remove(s.id)} className="mt-3 text-xs text-red-300 hover:text-red-200">
                <MdDelete className="inline" /> Удалить
              </button>
            </Card>
          );
        })}
        {items.length === 0 && (
          <Card extra="!p-8 col-span-full text-center">
            <p className="text-sm text-gray-600">Расписаний пока нет</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Schedules;
