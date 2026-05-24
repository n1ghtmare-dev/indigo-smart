import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "components/card";
import LineChart from "components/charts/LineChart";
import { apiFetch } from "config/auth";
import { MdArrowBack, MdInsights, MdAutoFixHigh } from "react-icons/md";

const DeviceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [generating, setGenerating] = useState(false);

  const refresh = () => {
    apiFetch(`/devices/${id}`).then((r) => r.json()).then(setDevice);
    apiFetch(`/forecast/${id}?reading_type=temperature`).then((r) => r.json()).then(setForecast);
  };
  useEffect(refresh, [id]);

  const toggle = async () => {
    await apiFetch(`/devices/${id}/state`, {
      method: "PUT",
      body: JSON.stringify({ state_type: "ON/OFF", state_value: device.status === "on" ? "0" : "1" }),
    });
    refresh();
  };

  const genForecast = async () => {
    setGenerating(true);
    try {
      await apiFetch(`/forecast/generate/${id}?reading_type=temperature&horizon_hours=24`, { method: "POST" });
      refresh();
    } finally {
      setGenerating(false);
    }
  };

  if (!device) return <div className="pt-4 text-center text-gray-600">Загрузка...</div>;

  const readings = device.readings.slice().reverse(); // chronological
  const tempReadings = readings.filter((r) => r.type === "temperature");

  const chartOptions = {
    chart: { toolbar: { show: false }, background: "transparent" },
    tooltip: { theme: "dark" },
    stroke: { curve: "smooth", width: 2, dashArray: [0, 6] },
    xaxis: {
      categories: [
        ...tempReadings.map((r) => new Date(r.recorded_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })),
        ...forecast.map((f) => new Date(f.time).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })),
      ],
      labels: { style: { colors: "#A3AED0", fontSize: "10px" } },
    },
    yaxis: { labels: { style: { colors: "#A3AED0" } } },
    grid: { borderColor: "rgba(163,174,208,0.15)" },
    colors: ["#6AD2FF", "#ffd700"],
    fill: { type: "gradient", gradient: { opacityFrom: 0.5, opacityTo: 0.05 } },
    legend: { labels: { colors: "#A3AED0" } },
    annotations: {
      xaxis: tempReadings.length > 0 ? [{
        x: tempReadings.length,
        borderColor: "#ffd700",
        label: { text: "Прогноз →", style: { color: "#ffd700", background: "transparent" } },
      }] : [],
    },
  };

  const series = [
    {
      name: "Факт",
      data: [
        ...tempReadings.map((r) => r.value),
        ...Array(forecast.length).fill(null),
      ],
    },
    {
      name: "Прогноз",
      data: [
        ...Array(tempReadings.length).fill(null),
        ...forecast.map((f) => f.value),
      ],
    },
  ];

  return (
    <div className="pt-4">
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-white">
        <MdArrowBack /> Назад
      </button>

      <div className="flex items-end justify-between">
        <div>
          <span className="pill">{device.type} · {device.room}</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">{device.name}</h2>
        </div>
        {!device.is_sensor && (
          <button onClick={toggle} className={device.status === "on" ? "btn-danger" : "btn-primary"}>
            {device.status === "on" ? "Выключить" : "Включить"}
          </button>
        )}
      </div>

      {tempReadings.length > 0 && (
        <Card extra="!p-5 mt-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-600">График температуры + прогноз ML</p>
              <h3 className="text-xl font-bold text-white">Динамика и предсказание</h3>
            </div>
            <button onClick={genForecast} disabled={generating} className="btn-primary disabled:opacity-50">
              <MdAutoFixHigh className="inline" /> {generating ? "Считаю..." : "Сгенерировать прогноз"}
            </button>
          </div>
          <div className="h-[300px]">
            <LineChart options={chartOptions} series={series} />
          </div>
        </Card>
      )}

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card extra="!p-5">
          <h3 className="mb-3 text-xl font-bold text-white">История состояний</h3>
          <div className="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto">
            {device.states.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div>
                  <p className="text-xs text-gray-600">{new Date(s.changed_at).toLocaleString("ru-RU")}</p>
                  <p className="text-sm font-medium text-white">{s.state_type} → {s.state_value}</p>
                </div>
                <span className="text-[11px] text-gray-600">от user #{s.changed_by || "—"}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card extra="!p-5">
          <h3 className="mb-3 text-xl font-bold text-white">Последние показания</h3>
          <div className="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto">
            {device.readings.slice(0, 30).map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <span className="text-xs text-gray-600">{new Date(r.recorded_at).toLocaleString("ru-RU")}</span>
                <span className="text-sm font-bold text-cyan-300">
                  {r.value}{" "}
                  <span className="text-gray-600 text-[11px]">{r.type}</span>
                </span>
              </div>
            ))}
            {device.readings.length === 0 && <p className="py-6 text-center text-gray-600 text-sm">Показаний нет</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DeviceDetail;
