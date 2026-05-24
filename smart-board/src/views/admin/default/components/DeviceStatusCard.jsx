import React, { useState, useEffect } from "react";
import { MdCheckCircle, MdCancel, MdSensors } from "react-icons/md";
import Card from "components/card";
import { API_BASE } from "config/api";

const DeviceStatusCard = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/devices`)
      .then((res) => res.json())
      .then(setDevices)
      .catch(console.error);
  }, []);

  const activeCount = devices.filter((d) => d.status === "on").length;

  return (
    <Card extra="!p-[22px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
            В реальном времени
          </p>
          <h4 className="mt-1 text-xl font-bold text-white">
            Статус устройств
          </h4>
        </div>
        <span className="pill pill-cyan">
          {activeCount} / {devices.length} активны
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {devices.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-600">Загрузка...</p>
        ) : (
          devices.map((device) => (
            <div
              key={device.id}
              className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-all hover:border-white/15 hover:bg-white/[0.05]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                    device.status === "on"
                      ? "border-green-500/40 bg-green-500/15 text-green-400"
                      : "border-white/10 bg-white/[0.03] text-gray-600"
                  }`}
                >
                  {device.status === "on" ? (
                    <MdCheckCircle className="h-5 w-5" />
                  ) : (
                    <MdCancel className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{device.name}</p>
                  <p className="text-[11px] text-gray-600">
                    {device.room} · {device.type}
                  </p>
                </div>
              </div>
              <span
                className={`pill ${
                  device.status === "on" ? "pill-green" : "pill-red"
                }`}
              >
                {device.status === "on" ? "ВКЛ" : "ВЫКЛ"}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default DeviceStatusCard;
