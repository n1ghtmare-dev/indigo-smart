import React, { useState, useEffect } from "react";
import Card from "components/card";
import { apiFetch } from "config/auth";
import { MdLightbulb, MdSensors, MdPowerSettingsNew, MdAcUnit, MdDirectionsRun, MdThermostat, MdWaterDrop } from "react-icons/md";

const ROOM_LAYOUT = {
  // room_id → [x, y, w, h] in % of canvas
  1: { x: 5, y: 5, w: 45, h: 45, name: "Гостиная" },
  2: { x: 50, y: 5, w: 45, h: 45, name: "Кухня" },
  3: { x: 5, y: 50, w: 90, h: 45, name: "Спальня" },
};

const ICONS = {
  "Лампа": MdLightbulb,
  "Розетка": MdPowerSettingsNew,
  "Умная розетка": MdPowerSettingsNew,
  "Кондиционер": MdAcUnit,
  "Датчик движения": MdDirectionsRun,
  "Датчик температуры": MdThermostat,
  "Датчик влажности": MdWaterDrop,
};

const FloorPlan = () => {
  const [devices, setDevices] = useState([]);
  const [rooms, setRooms] = useState([]);

  const refresh = () => {
    apiFetch("/devices").then((r) => r.json()).then(setDevices);
    apiFetch("/rooms").then((r) => r.json()).then(setRooms);
  };
  useEffect(refresh, []);

  const toggle = async (d) => {
    if (d.is_sensor) return;
    await apiFetch(`/devices/${d.id}/state`, {
      method: "PUT",
      body: JSON.stringify({
        state_type: "ON/OFF",
        state_value: d.status === "on" ? "0" : "1",
      }),
    });
    refresh();
  };

  return (
    <div className="pt-4">
      <div className="mb-6">
        <span className="pill pill-cyan">{devices.length} устройств · {rooms.length} комнат</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
          План <span className="text-grad">помещений</span>
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Кликните на устройство, чтобы переключить его состояние.
        </p>
      </div>

      <Card extra="!p-5">
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-white/[0.06]"
          style={{
            aspectRatio: "16 / 9",
            background:
              "linear-gradient(180deg, rgba(99,102,241,0.06), rgba(106,210,255,0.03))",
          }}
        >
          {/* Rooms outline */}
          {Object.entries(ROOM_LAYOUT).map(([rid, r]) => (
            <div
              key={rid}
              className="absolute rounded-xl border-2 border-dashed border-white/[0.12]"
              style={{
                left: `${r.x}%`, top: `${r.y}%`,
                width: `${r.w}%`, height: `${r.h}%`,
                background: "rgba(255,255,255,0.015)",
              }}
            >
              <span className="absolute left-3 top-2 text-[11px] font-bold uppercase tracking-widest text-gray-700">
                {r.name}
              </span>
            </div>
          ))}

          {/* Devices */}
          {devices.map((d) => {
            const room = ROOM_LAYOUT[d.room_id];
            if (!room) return null;
            // device pos_x/pos_y is in 0..100 within the room
            // we need to nest it: room left + (pos_x% of room width)
            const left = room.x + (room.w * (d.pos_x || 50)) / 100;
            const top = room.y + (room.h * (d.pos_y || 50)) / 100;
            const Icon = ICONS[d.type] || MdSensors;
            const isOn = d.status === "on";
            return (
              <button
                key={d.id}
                onClick={() => toggle(d)}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
                  d.is_sensor ? "cursor-default" : "cursor-pointer"
                }`}
                style={{ left: `${left}%`, top: `${top}%` }}
                title={d.name}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-all ${
                    d.is_sensor
                      ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-300"
                      : isOn
                      ? "border-yellow-300/60 bg-yellow-400/25 text-yellow-200"
                      : "border-white/15 bg-white/[0.04] text-gray-500"
                  }`}
                  style={
                    isOn && !d.is_sensor
                      ? { boxShadow: "0 0 24px rgba(255, 215, 0, 0.55)" }
                      : {}
                  }
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 group-hover:opacity-100">
                  {d.name}
                </span>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default FloorPlan;
