import React, { useState, useEffect } from "react";
import BarChart from "components/charts/BarChart";
import Card from "components/card";
import { MdArrowDropUp } from "react-icons/md";
import { API_BASE } from "config/api";

const MotionEvents = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/analytics/motion`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const last7 = data.slice(-7);
  const todayDetections = last7.length > 0 ? last7[last7.length - 1].detections : 0;

  const chartData = [{ name: "Обнаружения", data: last7.map((d) => d.detections) }];

  const chartOptions = {
    chart: { toolbar: { show: false }, background: "transparent" },
    tooltip: { theme: "dark" },
    xaxis: {
      categories: last7.map((d) => {
        const parts = d.date.split("-");
        return `${parts[2]}.${parts[1]}`;
      }),
      labels: { style: { colors: "#A3AED0", fontSize: "14px", fontWeight: "500" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        colorStops: [
          [{ offset: 0, color: "#ffd700", opacity: 1 }, { offset: 100, color: "rgba(255, 107, 0, 0.3)", opacity: 0.28 }],
        ],
      },
    },
    dataLabels: { enabled: false },
    plotOptions: { bar: { borderRadius: 8, columnWidth: "40px" } },
  };

  return (
    <Card extra="!p-[22px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
            Датчик движения
          </p>
          <p className="mt-1 text-[34px] font-extrabold leading-none text-grad">
            {todayDetections}
          </p>
          <p className="mt-1 text-xs text-gray-600">обнаружений сегодня</p>
        </div>
        <span className="pill pill-green">
          <MdArrowDropUp className="h-3 w-3" />
          за 7 дней
        </span>
      </div>

      <div className="h-[230px] w-full pt-6">
        {last7.length > 0 ? (
          <BarChart chartData={chartData} chartOptions={chartOptions} />
        ) : (
          <p className="py-20 text-center text-gray-400">Загрузка...</p>
        )}
      </div>
    </Card>
  );
};

export default MotionEvents;
