import React, { useState, useEffect } from "react";
import Card from "components/card";
import LineChart from "components/charts/LineChart";
import BarChart from "components/charts/BarChart";
import Widget from "components/widget/Widget";
import { MdThermostat, MdSensors, MdTimeline, MdDirectionsRun } from "react-icons/md";
import { API_BASE } from "config/api";

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [tempDaily, setTempDaily] = useState([]);
  const [motion, setMotion] = useState([]);
  const [hourly, setHourly] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/analytics/summary`).then((r) => r.json()),
      fetch(`${API_BASE}/analytics/temperature/daily`).then((r) => r.json()),
      fetch(`${API_BASE}/analytics/motion`).then((r) => r.json()),
      fetch(`${API_BASE}/analytics/activity/hourly`).then((r) => r.json()),
    ])
      .then(([s, t, m, h]) => {
        setSummary(s);
        setTempDaily(t);
        setMotion(m);
        setHourly(h);
      })
      .catch(console.error);
  }, []);

  const tempChartOptions = {
    chart: { type: "line", toolbar: { show: true }, background: "transparent" },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: [3.5, 2.5, 2.5], dashArray: [0, 4, 4] },
    tooltip: { theme: "dark", shared: true, intersect: false },
    grid: { show: true, borderColor: "rgba(163, 174, 208, 0.18)", strokeDashArray: 3 },
    xaxis: {
      categories: tempDaily.map((d) => d.date.slice(5)),
      labels: { style: { colors: "#A3AED0", fontSize: "11px" }, rotate: -45, rotateAlways: tempDaily.length > 10 },
      axisBorder: { show: false },
    },
    yaxis: { labels: { style: { colors: "#A3AED0" } }, title: { text: "°C", style: { color: "#A3AED0" } } },
    colors: ["#818cf8", "#6AD2FF", "#ff6b00"],
    markers: {
      size: [5, 0, 0],
      colors: ["#818cf8"],
      strokeColors: "#11172e",
      strokeWidth: 2,
      hover: { size: 7 },
    },
    legend: { labels: { colors: "#A3AED0" }, markers: { width: 12, height: 12, radius: 6 } },
  };

  const motionChartOptions = {
    chart: { toolbar: { show: false }, background: "transparent" },
    tooltip: { theme: "dark" },
    xaxis: {
      categories: motion.slice(-14).map((d) => { const p = d.date.split("-"); return `${p[2]}.${p[1]}`; }),
      labels: { style: { colors: "#A3AED0", fontSize: "11px" }, rotate: -45 },
      axisBorder: { show: false },
    },
    yaxis: { labels: { style: { colors: "#A3AED0" } } },
    grid: { show: true, borderColor: "rgba(163, 174, 208, 0.15)" },
    fill: { type: "gradient", gradient: { type: "vertical", opacityFrom: 0.8, opacityTo: 0.3, colorStops: [[{ offset: 0, color: "#ffd700", opacity: 1 }, { offset: 100, color: "#ff6b00", opacity: 0.3 }]] } },
    dataLabels: { enabled: false },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "50%" } },
  };

  const hourlyChartOptions = {
    chart: { toolbar: { show: false }, background: "transparent" },
    tooltip: { theme: "dark" },
    xaxis: {
      categories: hourly.map((h) => `${String(h.hour).padStart(2, "0")}:00`),
      labels: { style: { colors: "#A3AED0", fontSize: "10px" }, rotate: -45, rotateAlways: true },
      axisBorder: { show: false },
    },
    yaxis: { labels: { style: { colors: "#A3AED0" } } },
    grid: { show: true, borderColor: "rgba(163, 174, 208, 0.15)" },
    colors: ["#6AD2FF"],
    fill: { type: "gradient", gradient: { type: "vertical", opacityFrom: 0.8, opacityTo: 0.2, colorStops: [[{ offset: 0, color: "#6AD2FF", opacity: 1 }, { offset: 100, color: "#6AD2FF", opacity: 0.15 }]] } },
    dataLabels: { enabled: false },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "60%" } },
  };

  if (!summary) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">Загрузка аналитики...</p>
      </div>
    );
  }

  return (
    <div className="pt-4">
      <div className="mb-6">
        <span className="pill pill-gold">
          <MdTimeline className="h-3 w-3" />
          Исторические данные
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
          Аналитика <span className="text-grad">умного дома</span>
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Агрегированные показания, температура, движение и часовая активность.
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Widget icon={<MdSensors className="h-6 w-6" />} title="Всего показаний" subtitle={summary.total_readings} />
        <Widget icon={<MdTimeline className="h-6 w-6" />} title="Всего событий" subtitle={summary.total_events} />
        <Widget icon={<MdThermostat className="h-6 w-6" />} title="Ср. температура" subtitle={summary.avg_temperature ? `${summary.avg_temperature}°C` : "—"} />
        <Widget icon={<MdDirectionsRun className="h-6 w-6" />} title="Движений сегодня" subtitle={summary.motion_today} />
      </div>

      <div className="mt-5">
        <Card extra="!p-[22px]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                Динамика
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">
                Температура по дням <span className="text-gray-600">(мин / ср / макс)</span>
              </h2>
            </div>
            <span className="pill">{tempDaily.length} дней</span>
          </div>
          <div className="h-[350px] w-full overflow-x-auto">
            <div className="min-w-[500px] h-full">
              {tempDaily.length > 0 ? (
                <LineChart
                  options={tempChartOptions}
                  series={[
                    { name: "Средняя", data: tempDaily.map((d) => d.avg) },
                    { name: "Минимум", data: tempDaily.map((d) => d.min) },
                    { name: "Максимум", data: tempDaily.map((d) => d.max) },
                  ]}
                />
              ) : (
                <p className="py-20 text-center text-gray-400">Нет данных</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card extra="!p-[22px]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                За 14 дней
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">
                Обнаружения движения
              </h2>
            </div>
            <span className="pill pill-gold">PIR</span>
          </div>
          <div className="h-[300px] w-full overflow-x-auto">
            <div className="min-w-[350px] h-full">
              {motion.length > 0 ? (
                <BarChart
                  chartData={[{ name: "Обнаружения", data: motion.slice(-14).map((d) => d.detections) }]}
                  chartOptions={motionChartOptions}
                />
              ) : (
                <p className="py-20 text-center text-gray-400">Нет данных</p>
              )}
            </div>
          </div>
        </Card>

        <Card extra="!p-[22px]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                Все время
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">
                Активность по часам
              </h2>
            </div>
            <span className="pill pill-cyan">24h</span>
          </div>
          <div className="h-[300px] w-full overflow-x-auto">
            <div className="min-w-[350px] h-full">
              {hourly.length > 0 ? (
                <BarChart
                  chartData={[{ name: "События", data: hourly.map((h) => h.events) }]}
                  chartOptions={hourlyChartOptions}
                />
              ) : (
                <p className="py-20 text-center text-gray-400">Нет данных</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
