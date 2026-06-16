import React, { useState, useEffect } from "react";
import Card from "components/card";
import { apiFetch } from "config/auth";
import { MdPlayArrow, MdDelete, MdAdd, MdHome } from "react-icons/md";

const Scenes = () => {
  const [scenes, setScenes] = useState([]);
  const [devices, setDevices] = useState([]);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [actions, setActions] = useState([{ device_id: "", state_value: "1" }]);
  const [toast, setToast] = useState(null); // { ok, text }

  const refresh = () => {
    apiFetch("/scenes").then((r) => r.json()).then(setScenes);
    apiFetch("/devices").then((r) => r.json()).then((d) =>
      setDevices(d.filter((x) => !x.is_sensor))
    );
  };

  useEffect(refresh, []);

  const run = async (id, sceneName) => {
    try {
      const r = await apiFetch(`/scenes/${id}/run`, { method: "POST" });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setToast({ ok: false, text: `Не удалось запустить (код ${r.status})` });
      } else {
        setToast({
          ok: true,
          text: `«${sceneName}» выполнен · ${data.actions_applied ?? 0} действий`,
        });
        refresh();
      }
    } catch {
      setToast({ ok: false, text: "Нет связи с сервером" });
    }
    setTimeout(() => setToast(null), 3500);
  };

  const remove = async (id) => {
    if (!window.confirm("Удалить сценарий?")) return;
    await apiFetch(`/scenes/${id}`, { method: "DELETE" });
    refresh();
  };

  const submit = async (e) => {
    e.preventDefault();
    const cleanActions = actions
      .filter((a) => a.device_id)
      .map((a) => ({ device_id: +a.device_id, state_type: "ON/OFF", state_value: a.state_value }));
    if (!name || cleanActions.length === 0) return;
    await apiFetch("/scenes", {
      method: "POST",
      body: JSON.stringify({ name, icon: "home", actions: cleanActions }),
    });
    setCreating(false);
    setName("");
    setActions([{ device_id: "", state_value: "1" }]);
    refresh();
  };

  return (
    <div className="pt-4">
      {toast && (
        <div
          className={`fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-lg backdrop-blur ${
            toast.ok
              ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
              : "border-red-400/30 bg-red-500/15 text-red-200"
          }`}
        >
          {toast.ok ? "✓ " : "⚠ "}
          {toast.text}
        </div>
      )}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <span className="pill pill-cyan">{scenes.length} сценариев</span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Сценарии <span className="text-grad">умного дома</span>
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Одно нажатие — несколько действий. «Ушёл из дома», «Доброе утро».
          </p>
        </div>
        <button onClick={() => setCreating(!creating)} className="btn-primary shrink-0 self-start sm:self-auto">
          <MdAdd className="inline" /> {creating ? "Отмена" : "Создать сценарий"}
        </button>
      </div>

      {creating && (
        <Card extra="!p-6 mb-5">
          <form onSubmit={submit} className="flex flex-col gap-4">
            <input
              placeholder="Название сценария"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white outline-none"
            />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
              Действия
            </p>
            {actions.map((a, i) => (
              <div key={i} className="flex gap-2">
                <select
                  value={a.device_id}
                  onChange={(e) => {
                    const next = [...actions];
                    next[i].device_id = e.target.value;
                    setActions(next);
                  }}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
                >
                  <option value="">Выберите устройство</option>
                  {devices.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.room})</option>
                  ))}
                </select>
                <select
                  value={a.state_value}
                  onChange={(e) => {
                    const next = [...actions];
                    next[i].state_value = e.target.value;
                    setActions(next);
                  }}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
                >
                  <option value="1">Включить</option>
                  <option value="0">Выключить</option>
                </select>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setActions([...actions, { device_id: "", state_value: "1" }])}
              className="text-xs font-semibold text-indigo-300 hover:text-indigo-200"
            >
              + Добавить действие
            </button>
            <button type="submit" className="btn-primary">Создать</button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenes.map((s) => (
          <Card key={s.id} extra="!p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                  Сценарий
                </p>
                <h3 className="mt-1 text-xl font-bold text-white">{s.name}</h3>
                <p className="mt-1 text-xs text-gray-600">
                  {s.actions_count} действий
                </p>
              </div>
              <div className="ico-grad flex h-10 w-10 items-center justify-center rounded-2xl text-white">
                <MdHome className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => run(s.id, s.name)} className="btn-primary flex-1">
                <MdPlayArrow className="inline" /> Запустить
              </button>
              <button
                onClick={() => remove(s.id)}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-300 hover:bg-red-500/20"
              >
                <MdDelete />
              </button>
            </div>
          </Card>
        ))}
        {scenes.length === 0 && (
          <Card extra="!p-8 col-span-full text-center">
            <p className="text-sm text-gray-600">
              Пока нет сценариев. Создайте первый — «Ушёл из дома» или «Доброе утро».
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Scenes;
