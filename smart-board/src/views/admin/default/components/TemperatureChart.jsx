import React, { useState, useEffect } from "react";
import { MdOutlineCalendarToday } from "react-icons/md";
import Card from "components/card";
import LineChart from "components/charts/LineChart";
import { API_BASE } from "config/api";

const TemperatureChart = () => {
  const [data, setData] = useState([]);
  const [avgTemp, setAvgTemp] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/analytics/temperature/daily`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        if (result.length > 0) {
          const avg = result.reduce((sum, r) => sum + r.avg, 0) / result.length;
          setAvgTemp(avg.toFixed(1));
        }
      })
      .catch(console.error);
  }, []);

  const chartOptions = {
    legend: { show: true, labels: { colors: "#A3AED0" } },
    chart: { type: "line", toolbar: { show: false }, background: "transparent" },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    tooltip: { theme: "dark" },
    grid: { show: true, borderColor: "rgba(163, 174, 208, 0.15)" },
    xaxis: {
      categories: data.map((d) => d.date.slice(5)),
      labels: { style: { colors: "#A3AED0", fontSize: "11px" }, rotate: -45, rotateAlways: data.length > 10 },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#A3AED0", fontSize: "12px" } },
      title: { text: "°C", style: { color: "#A3AED0" } },
    },
    colors: ["#ffd700", "#6AD2FF", "#ff6b00"],
  };

  const chartSeries = [
    { name: "Средняя", data: data.map((d) => d.avg) },
    { name: "Минимум", data: data.map((d) => d.min) },
    { name: "Максимум", data: data.map((d) => d.max) },
  ];

  return (
    <Card extra="!p-[22px]">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <span className="pill">
            <MdOutlineCalendarToday className="h-3 w-3" />
            30 дней
          </span>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
            Средняя температура
          </p>
          <h3 className="text-4xl font-extrabold text-grad">
            {avgTemp ? `${avgTemp}°C` : "—"}
          </h3>
        </div>
        <div className="ico-grad flex h-11 w-11 items-center justify-center rounded-2xl text-white">
          <MdOutlineCalendarToday className="h-5 w-5" />
        </div>
      </div>

      <div className="h-full w-full mt-4 overflow-x-auto">
        <div className="min-w-[400px]">
          {data.length > 0 ? (
            <LineChart options={chartOptions} series={chartSeries} />
          ) : (
            <p className="py-10 text-gray-400">Загрузка данных...</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TemperatureChart;
