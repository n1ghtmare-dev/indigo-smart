import React, { useState, useEffect } from "react";
import Card from "components/card";
import BarChart from "components/charts/BarChart";
import { MdBarChart } from "react-icons/md";
import { API_BASE } from "config/api";

const WeeklyActivity = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/analytics/activity`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const last14 = data.slice(-14);

  const chartData = [
    {
      name: "События",
      data: last14.map((d) => d.events),
    },
  ];

  const chartOptions = {
    chart: { toolbar: { show: false }, background: "transparent" },
    tooltip: { theme: "dark" },
    xaxis: {
      categories: last14.map((d) => d.date.slice(5)),
      labels: { style: { colors: "#A3AED0", fontSize: "12px" }, rotate: -45 },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#A3AED0", fontSize: "12px" } },
    },
    grid: { show: true, borderColor: "rgba(163, 174, 208, 0.15)" },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        opacityFrom: 0.9,
        opacityTo: 0.5,
        colorStops: [
          [{ offset: 0, color: "#ffd700", opacity: 1 }, { offset: 100, color: "#ff6b00", opacity: 0.4 }],
        ],
      },
    },
    dataLabels: { enabled: false },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "50%" } },
  };

  return (
    <Card extra="flex flex-col w-full !p-[22px]">
      <div className="mb-auto flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
            Последние 14 дней
          </p>
          <h2 className="mt-1 text-xl font-bold text-white">
            Активность устройств
          </h2>
        </div>
        <div className="ico-grad flex h-11 w-11 items-center justify-center rounded-2xl text-white">
          <MdBarChart className="h-5 w-5" />
        </div>
      </div>

      <div className="md:mt-4 lg:mt-0">
        <div className="h-[250px] w-full xl:h-[350px] overflow-x-auto">
          <div className="min-w-[350px] h-full">
            {last14.length > 0 ? (
              <BarChart chartData={chartData} chartOptions={chartOptions} />
            ) : (
              <p className="py-20 text-gray-400">Загрузка...</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeeklyActivity;
