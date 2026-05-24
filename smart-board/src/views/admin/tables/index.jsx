import React, { useState, useEffect } from "react";
import Card from "components/card";
import {
  MdCheckCircle,
  MdCancel,
  MdThermostat,
  MdSensors,
  MdMeetingRoom,
  MdLightbulb,
} from "react-icons/md";
import { apiFetch } from "config/auth";

const Tables = () => {
  const [devices, setDevices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);

  const refresh = () => {
    Promise.all([
      apiFetch("/devices").then((r) => r.json()),
      apiFetch("/rooms").then((r) => r.json()),
    ])
      .then(([d, rm]) => {
        setDevices(d);
        setRooms(rm);
      })
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    refresh();
  }, []);

  const toggleDevice = async (deviceId, currentStatus) => {
    setBusy(deviceId);
    setError(null);
    try {
      const r = await apiFetch(`/devices/${deviceId}/state`, {
        method: "PUT",
        body: JSON.stringify({
          state_type: "ON/OFF",
          state_value: currentStatus === "on" ? "0" : "1",
        }),
      });
      if (r.status === 401) {
        setError("Сессия истекла. Войдите заново.");
        return;
      }
      if (!r.ok) {
        const txt = await r.text();
        setError(`Ошибка ${r.status}: ${txt.slice(0, 120)}`);
        return;
      }
      refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="pt-4">
      <div className="mb-6">
        <span className="pill pill-cyan">
          <MdMeetingRoom className="h-3 w-3" />
          {rooms.length} комнат · {devices.length} устройств
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
          Управление <span className="text-grad">устройствами</span>
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Список устройств по комнатам с возможностью включения/выключения.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.id} extra="!p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                  Комната
                </p>
                <h3 className="mt-1 text-xl font-bold text-white">
                  {room.name}
                </h3>
                <p className="mt-1 text-xs text-gray-600">{room.description}</p>
              </div>
              <div className="ico-grad flex h-10 w-10 items-center justify-center rounded-2xl text-white">
                <MdMeetingRoom className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-grad">
                {room.device_count}
              </span>
              <span className="text-xs text-gray-600">устройств</span>
            </div>
          </Card>
        ))}
      </div>

      <Card extra="w-full mt-6 !p-[22px]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
              Все устройства
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">
              Каталог и управление
            </h2>
          </div>
          <span className="pill pill-green">
            {devices.filter((d) => d.status === "on").length} активны
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}

        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                  Название
                </th>
                <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                  Комната
                </th>
                <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                  Тип
                </th>
                <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                  Статус
                </th>
                <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                  Действие
                </th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-white/[0.04] transition hover:bg-white/[0.025]"
                >
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                          d.is_sensor
                            ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                            : "border-indigo-400/30 bg-indigo-400/10 text-indigo-300"
                        }`}
                      >
                        {d.is_sensor ? (
                          <MdSensors className="h-4 w-4" />
                        ) : (
                          <MdLightbulb className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-sm font-bold text-white">
                        {d.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 text-sm text-gray-600">{d.room}</td>
                  <td className="py-3.5 text-sm text-gray-600">
                    {d.is_sensor && (
                      <MdThermostat className="mr-1 inline h-4 w-4 text-cyan-300" />
                    )}
                    {d.type}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`pill ${
                        d.status === "on" ? "pill-green" : "pill-red"
                      }`}
                    >
                      {d.status === "on" ? (
                        <MdCheckCircle className="h-3 w-3" />
                      ) : (
                        <MdCancel className="h-3 w-3" />
                      )}
                      {d.status === "on" ? "ВКЛ" : "ВЫКЛ"}
                    </span>
                  </td>
                  <td className="py-3.5">
                    {!d.is_sensor ? (
                      <button
                        onClick={() => toggleDevice(d.id, d.status)}
                        disabled={busy === d.id}
                        className={
                          (d.status === "on" ? "btn-danger" : "btn-primary") +
                          (busy === d.id ? " opacity-50" : "")
                        }
                      >
                        {busy === d.id
                          ? "..."
                          : d.status === "on"
                          ? "Выключить"
                          : "Включить"}
                      </button>
                    ) : (
                      <span className="text-[11px] text-gray-600">сенсор</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 sm:hidden">
          {devices.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-white">{d.name}</p>
                <span
                  className={`pill ${
                    d.status === "on" ? "pill-green" : "pill-red"
                  }`}
                >
                  {d.status === "on" ? "ВКЛ" : "ВЫКЛ"}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                {d.room} · {d.type}
              </p>
              {!d.is_sensor && (
                <button
                  onClick={() => toggleDevice(d.id, d.status)}
                  disabled={busy === d.id}
                  className={`mt-3 w-full ${
                    d.status === "on" ? "btn-danger" : "btn-primary"
                  } ${busy === d.id ? "opacity-50" : ""}`}
                >
                  {busy === d.id ? "..." : d.status === "on" ? "Выключить" : "Включить"}
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Tables;
