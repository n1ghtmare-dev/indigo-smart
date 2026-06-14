import React, { useState, useEffect, useRef, useCallback } from "react";
import Card from "components/card";
import { apiFetch } from "config/auth";
import { useLiveEvents } from "contexts/LiveEvents";
import {
  MdLightbulb,
  MdSensors,
  MdPowerSettingsNew,
  MdAcUnit,
  MdDirectionsRun,
  MdThermostat,
  MdWaterDrop,
  MdEdit,
  MdCheck,
  MdAdd,
  MdDelete,
} from "react-icons/md";

const ICONS = {
  Лампа: MdLightbulb,
  Розетка: MdPowerSettingsNew,
  "Умная розетка": MdPowerSettingsNew,
  Кондиционер: MdAcUnit,
  "Датчик движения": MdDirectionsRun,
  "Датчик температуры": MdThermostat,
  "Датчик влажности": MdWaterDrop,
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const FloorPlan = () => {
  const [devices, setDevices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null); // {id, name, description}
  const [adding, setAdding] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: "", description: "" });
  const canvasRef = useRef(null);
  const dragRef = useRef(null);

  const { subscribe } = useLiveEvents();
  const [alertRoom, setAlertRoom] = useState(null); // { roomId, cooling } | null
  useEffect(() => {
    const unsub = subscribe((msg) => {
      if (msg.type !== "scenario_step") return;
      if (msg.phase === "resolved" || msg.phase === "error") { setAlertRoom(null); return; }
      setAlertRoom({ roomId: msg.room_id, cooling: msg.phase === "cooling" });
    });
    return unsub;
  }, [subscribe]);

  const refresh = useCallback(() => {
    apiFetch("/devices").then((r) => r.json()).then(setDevices);
    apiFetch("/rooms").then((r) => r.json()).then(setRooms);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // --- toggle device on/off (view mode) ---
  const toggle = async (d) => {
    if (d.is_sensor || editMode) return;
    await apiFetch(`/devices/${d.id}/state`, {
      method: "PUT",
      body: JSON.stringify({
        state_type: "ON/OFF",
        state_value: d.status === "on" ? "0" : "1",
      }),
    });
    refresh();
  };

  // --- generic pointer-drag helper ---
  const startDrag = (e, kind, payload) => {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    const canvas = canvasRef.current?.getBoundingClientRect();
    if (!canvas) return;
    dragRef.current = {
      kind,
      payload,
      canvas,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };
  };

  useEffect(() => {
    const onMove = (e) => {
      const drag = dragRef.current;
      if (!drag) return;
      const { canvas, kind, payload } = drag;
      const dxPct = ((e.clientX - drag.startX) / canvas.width) * 100;
      const dyPct = ((e.clientY - drag.startY) / canvas.height) * 100;
      if (Math.abs(e.clientX - drag.startX) + Math.abs(e.clientY - drag.startY) > 3) {
        drag.moved = true;
      }

      if (kind === "device") {
        // device pos is relative to its room, but during drag track in canvas %
        const relX = ((e.clientX - canvas.left) / canvas.width) * 100;
        const relY = ((e.clientY - canvas.top) / canvas.height) * 100;
        setDevices((prev) =>
          prev.map((d) =>
            d.id === payload.id ? { ...d, _ghostX: relX, _ghostY: relY } : d
          )
        );
      } else if (kind === "room-move") {
        setRooms((prev) =>
          prev.map((r) =>
            r.id === payload.id
              ? {
                  ...r,
                  layout_x: clamp(payload.origX + dxPct, 0, 100 - r.layout_w),
                  layout_y: clamp(payload.origY + dyPct, 0, 100 - r.layout_h),
                }
              : r
          )
        );
      } else if (kind === "room-resize") {
        setRooms((prev) =>
          prev.map((r) =>
            r.id === payload.id
              ? {
                  ...r,
                  layout_w: clamp(payload.origW + dxPct, 10, 100 - r.layout_x),
                  layout_h: clamp(payload.origH + dyPct, 10, 100 - r.layout_y),
                }
              : r
          )
        );
      }
    };

    const onUp = async (e) => {
      const drag = dragRef.current;
      dragRef.current = null;
      if (!drag || !drag.moved) return;
      const { kind, payload, canvas } = drag;

      try {
        if (kind === "device") {
          const relX = ((e.clientX - canvas.left) / canvas.width) * 100;
          const relY = ((e.clientY - canvas.top) / canvas.height) * 100;
          // find room under cursor (first match)
          const dropRoom = rooms.find(
            (r) =>
              relX >= r.layout_x &&
              relX <= r.layout_x + r.layout_w &&
              relY >= r.layout_y &&
              relY <= r.layout_y + r.layout_h
          );
          if (!dropRoom) {
            setError("Отпусти устройство внутри какой-нибудь комнаты.");
            refresh();
            return;
          }
          // pos relative to room (0..100)
          const posX = clamp(
            ((relX - dropRoom.layout_x) / dropRoom.layout_w) * 100,
            2,
            98
          );
          const posY = clamp(
            ((relY - dropRoom.layout_y) / dropRoom.layout_h) * 100,
            2,
            98
          );
          await apiFetch(`/devices/${payload.id}`, {
            method: "PATCH",
            body: JSON.stringify({
              room_id: dropRoom.id,
              pos_x: posX,
              pos_y: posY,
            }),
          });
          refresh();
        } else if (kind === "room-move" || kind === "room-resize") {
          const r = rooms.find((x) => x.id === payload.id);
          if (!r) return;
          await apiFetch(`/rooms/${payload.id}`, {
            method: "PATCH",
            body: JSON.stringify({
              layout_x: r.layout_x,
              layout_y: r.layout_y,
              layout_w: r.layout_w,
              layout_h: r.layout_h,
            }),
          });
        }
      } catch (err) {
        setError(err.message);
        refresh();
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [rooms, refresh]);

  // --- room CRUD ---
  const saveRoom = async () => {
    if (!editingRoom) return;
    await apiFetch(`/rooms/${editingRoom.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: editingRoom.name,
        description: editingRoom.description,
      }),
    });
    setEditingRoom(null);
    refresh();
  };

  const deleteRoom = async (id) => {
    if (!window.confirm("Удалить эту комнату? (только пустую)")) return;
    const r = await apiFetch(`/rooms/${id}`, { method: "DELETE" });
    if (!r.ok) {
      const txt = await r.text();
      setError(`Не удалось удалить: ${txt.slice(0, 150)}`);
      return;
    }
    refresh();
  };

  const createRoom = async (e) => {
    e.preventDefault();
    const r = await apiFetch("/rooms", {
      method: "POST",
      body: JSON.stringify({
        name: newRoom.name,
        description: newRoom.description,
        layout_x: 60,
        layout_y: 60,
        layout_w: 30,
        layout_h: 30,
      }),
    });
    if (!r.ok) {
      const txt = await r.text();
      setError(`Не удалось создать: ${txt.slice(0, 150)}`);
      return;
    }
    setNewRoom({ name: "", description: "" });
    setAdding(false);
    refresh();
  };

  return (
    <div className="pt-4">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="pill pill-cyan">
            {devices.length} устройств · {rooms.length} комнат
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
            План <span className="text-grad">помещений</span>
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {editMode
              ? "Режим редактирования: тащи устройства мышкой между комнат, тащи угол комнаты чтобы изменить размер, клик по названию — переименовать."
              : "Клик по устройству — включить/выключить. Нажми «Редактировать» чтобы менять план."}
          </p>
        </div>
        <div className="flex gap-2">
          {editMode && (
            <button
              onClick={() => setAdding(true)}
              className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-400/20"
            >
              <MdAdd className="inline" /> Комната
            </button>
          )}
          <button
            onClick={() => {
              setEditMode((v) => !v);
              setEditingRoom(null);
              setAdding(false);
            }}
            className={
              editMode
                ? "rounded-xl border border-green-400/40 bg-green-400/15 px-4 py-2 text-sm font-semibold text-green-300"
                : "btn-primary"
            }
          >
            {editMode ? (
              <>
                <MdCheck className="inline" /> Готово
              </>
            ) : (
              <>
                <MdEdit className="inline" /> Редактировать
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
          <button
            className="ml-3 text-white/70 hover:text-white"
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}

      {adding && (
        <Card extra="!p-5 mb-4">
          <form
            onSubmit={createRoom}
            className="flex flex-wrap items-end gap-3"
          >
            <label className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wider text-gray-600">
                Название комнаты
              </span>
              <input
                required
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                placeholder="например: Кабинет"
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wider text-gray-600">
                Описание (необязательно)
              </span>
              <input
                value={newRoom.description}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, description: e.target.value })
                }
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white"
              />
            </label>
            <button type="submit" className="btn-primary h-[42px]">
              Создать
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-300"
            >
              Отмена
            </button>
          </form>
        </Card>
      )}

      <Card extra="!p-5">
        <div
          ref={canvasRef}
          className="relative w-full overflow-hidden rounded-2xl border border-white/[0.06]"
          style={{
            aspectRatio: "16 / 9",
            background:
              "linear-gradient(180deg, rgba(99,102,241,0.06), rgba(106,210,255,0.03))",
            userSelect: editMode ? "none" : "auto",
          }}
        >
          {/* Rooms */}
          {rooms.map((r) => {
            if (
              r.layout_x == null ||
              r.layout_y == null ||
              r.layout_w == null ||
              r.layout_h == null
            )
              return null;
            return (
              <div
                key={r.id}
                className={`absolute rounded-xl border-2 border-dashed transition-colors ${
                  editMode
                    ? "border-cyan-400/40 bg-cyan-400/[0.04]"
                    : "border-white/[0.12]"
                }`}
                style={{
                  left: `${r.layout_x}%`,
                  top: `${r.layout_y}%`,
                  width: `${r.layout_w}%`,
                  height: `${r.layout_h}%`,
                  ...(alertRoom && alertRoom.roomId === r.id
                    ? {
                        boxShadow: alertRoom.cooling
                          ? "0 0 0 3px rgba(16,185,129,0.9), 0 0 30px rgba(16,185,129,0.6)"
                          : "0 0 0 3px rgba(239,68,68,0.9), 0 0 30px rgba(239,68,68,0.7)",
                        transition: "box-shadow 0.4s ease",
                      }
                    : {}),
                }}
              >
                <div
                  onPointerDown={(e) =>
                    startDrag(e, "room-move", {
                      id: r.id,
                      origX: parseFloat(r.layout_x),
                      origY: parseFloat(r.layout_y),
                    })
                  }
                  className={`flex items-center justify-between px-3 pt-2 ${
                    editMode ? "cursor-move" : ""
                  }`}
                >
                  {editingRoom?.id === r.id ? (
                    <input
                      autoFocus
                      value={editingRoom.name}
                      onChange={(e) =>
                        setEditingRoom({
                          ...editingRoom,
                          name: e.target.value,
                        })
                      }
                      onBlur={saveRoom}
                      onKeyDown={(e) => e.key === "Enter" && saveRoom()}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="bg-transparent text-[11px] font-bold uppercase tracking-widest text-white outline-none"
                    />
                  ) : (
                    <span
                      onClick={(e) => {
                        if (!editMode) return;
                        e.stopPropagation();
                        setEditingRoom({
                          id: r.id,
                          name: r.name,
                          description: r.description || "",
                        });
                      }}
                      className={`text-[11px] font-bold uppercase tracking-widest ${
                        editMode
                          ? "text-cyan-300 hover:text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {r.name}
                    </span>
                  )}
                  {editMode && (
                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => deleteRoom(r.id)}
                      title="Удалить (пустую) комнату"
                      className="rounded-md p-1 text-red-300/70 hover:bg-red-500/15 hover:text-red-300"
                    >
                      <MdDelete className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {/* Resize handle */}
                {editMode && (
                  <div
                    onPointerDown={(e) =>
                      startDrag(e, "room-resize", {
                        id: r.id,
                        origW: parseFloat(r.layout_w),
                        origH: parseFloat(r.layout_h),
                      })
                    }
                    className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize rounded-tl-md bg-cyan-400/40"
                    title="Тяни чтобы изменить размер"
                  />
                )}
              </div>
            );
          })}

          {/* Devices */}
          {devices.map((d) => {
            const room = rooms.find((r) => r.id === d.room_id);
            if (!room || room.layout_x == null) return null;
            // Use ghost coords during drag, else compute from room + pos
            let left, top;
            if (d._ghostX != null) {
              left = d._ghostX;
              top = d._ghostY;
            } else {
              left =
                parseFloat(room.layout_x) +
                (parseFloat(room.layout_w) * (d.pos_x ?? 50)) / 100;
              top =
                parseFloat(room.layout_y) +
                (parseFloat(room.layout_h) * (d.pos_y ?? 50)) / 100;
            }
            const Icon = ICONS[d.type] || MdSensors;
            const isOn = d.status === "on";
            const dragging = d._ghostX != null;
            return (
              <div
                key={d.id}
                onPointerDown={(e) => editMode && startDrag(e, "device", { id: d.id })}
                onClick={(e) => {
                  if (editMode) {
                    e.stopPropagation();
                    return;
                  }
                  toggle(d);
                }}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 ${
                  editMode
                    ? "cursor-move"
                    : d.is_sensor
                    ? "cursor-default"
                    : "cursor-pointer"
                } ${dragging ? "z-50 scale-110" : ""}`}
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
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default FloorPlan;
