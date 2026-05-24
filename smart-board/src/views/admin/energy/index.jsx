import React, { useState, useEffect } from "react";
import Card from "components/card";
import Widget from "components/widget/Widget";
import BarChart from "components/charts/BarChart";
import LineChart from "components/charts/LineChart";
import { apiFetch } from "config/auth";
import { MdBolt, MdTimer, MdTrendingUp, MdTrendingDown, MdDownload } from "react-icons/md";

const Energy = () => {
  const [summary, setSummary] = useState(null);
  const [byDevice, setByDevice] = useState([]);
  const [daily, setDaily] = useState([]);

  useEffect(() => {
    apiFetch("/energy/summary").then((r) => r.json()).then(setSummary);
    apiFetch("/energy/by-device").then((r) => r.json()).then(setByDevice);
    apiFetch("/energy/daily?days=14").then((r) => r.json()).then(setDaily);
  }, []);

  // Group daily by date and sum across devices
  const dailyAgg = {};
  daily.forEach((d) => {
    if (!dailyAgg[d.day]) dailyAgg[d.day] = 0;
    dailyAgg[d.day] += +d.kwh || 0;
  });
  const days = Object.keys(dailyAgg).sort();

  const lineOptions = {
    chart: { toolbar: { show: false }, background: "transparent" },
    tooltip: { theme: "dark" },
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories: days.map((d) => d.slice(5)),
      labels: { style: { colors: "#A3AED0", fontSize: "11px" } },
    },
    yaxis: {
      labels: { style: { colors: "#A3AED0" } },
      title: { text: "кВт·ч", style: { color: "#A3AED0" } },
    },
    grid: { borderColor: "rgba(163,174,208,0.15)" },
    colors: ["#6AD2FF"],
    fill: { type: "gradient", gradient: { opacityFrom: 0.5, opacityTo: 0.05 } },
  };

  const barOptions = {
    chart: { toolbar: { show: false }, background: "transparent" },
    tooltip: { theme: "dark" },
    xaxis: {
      categories: byDevice.map((d) => d.device_name),
      labels: { style: { colors: "#A3AED0", fontSize: "10px" }, rotate: -30 },
    },
    yaxis: { labels: { style: { colors: "#A3AED0" } } },
    grid: { borderColor: "rgba(163,174,208,0.15)" },
    colors: ["#ffd700"],
    plotOptions: { bar: { borderRadius: 6, columnWidth: "55%" } },
    dataLabels: { enabled: false },
  };

  const downloadCSV = (url) => {
    const token = localStorage.getItem("indigo_token");
    fetch(`http://127.0.0.1:8000${url}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.blob())
      .then((b) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = url.split("/").pop();
        a.click();
      });
  };

  return (
    <div className="pt-4">
      <div className="mb-6">
        <span className="pill pill-gold">Учёт энергии · SQL window functions</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
          Энергопотребление <span className="text-grad">умного дома</span>
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Расчёт через VIEW v_daily_uptime с использованием функции LEAD() и хранимой процедуры.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Widget icon={<MdBolt className="h-6 w-6" />} title="кВт·ч за 30 дней" subtitle={summary?.kwh_30?.toFixed(2) || "—"} />
        <Widget icon={<MdTimer className="h-6 w-6" />} title="Часов работы" subtitle={summary?.hours_30?.toFixed(0) || "—"} />
        <Widget icon={<MdBolt className="h-6 w-6" />} title="Пред. период" subtitle={summary?.kwh_prev?.toFixed(2) || "—"} />
        <Widget
          icon={summary?.delta_pct >= 0 ? <MdTrendingUp className="h-6 w-6" /> : <MdTrendingDown className="h-6 w-6" />}
          title="Изменение"
          subtitle={summary ? `${summary.delta_pct >= 0 ? '+' : ''}${summary.delta_pct}%` : "—"}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card extra="!p-[22px]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-600">14 дней</p>
              <h3 className="text-xl font-bold text-white">Динамика по дням</h3>
            </div>
            <button
              onClick={() => downloadCSV("/export/readings.csv?days=14")}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white hover:bg-white/[0.06]"
            >
              <MdDownload className="inline" /> CSV
            </button>
          </div>
          <div className="h-[280px]">
            {days.length > 0 ? (
              <LineChart options={lineOptions} series={[{ name: "кВт·ч", data: days.map((d) => +dailyAgg[d].toFixed(3)) }]} />
            ) : (
              <p className="py-20 text-center text-gray-600">Нет данных</p>
            )}
          </div>
        </Card>

        <Card extra="!p-[22px]">
          <div className="mb-3">
            <p className="text-[11px] uppercase tracking-wider text-gray-600">Все время</p>
            <h3 className="text-xl font-bold text-white">Топ устройств</h3>
          </div>
          <div className="h-[280px]">
            {byDevice.length > 0 ? (
              <BarChart
                chartData={[{ name: "Часы работы", data: byDevice.map((d) => +d.total_hours.toFixed(1)) }]}
                chartOptions={barOptions}
              />
            ) : (
              <p className="py-20 text-center text-gray-600">Нет данных</p>
            )}
          </div>
        </Card>
      </div>

      <Card extra="!p-5 mt-5">
        <h3 className="mb-3 text-xl font-bold text-white">Таблица устройств</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="pb-2 text-[11px] uppercase tracking-wider text-gray-600">Устройство</th>
              <th className="pb-2 text-[11px] uppercase tracking-wider text-gray-600">Часов</th>
              <th className="pb-2 text-[11px] uppercase tracking-wider text-gray-600">кВт·ч</th>
              <th className="pb-2 text-[11px] uppercase tracking-wider text-gray-600">Активных дней</th>
            </tr>
          </thead>
          <tbody>
            {byDevice.map((d) => (
              <tr key={d.device_id} className="border-b border-white/[0.03]">
                <td className="py-2.5 text-white">{d.device_name}</td>
                <td className="py-2.5 text-gray-300">{(+d.total_hours).toFixed(1)}</td>
                <td className="py-2.5 text-cyan-300">{(+d.total_kwh).toFixed(3)}</td>
                <td className="py-2.5 text-gray-300">{d.days_with_activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Energy;
