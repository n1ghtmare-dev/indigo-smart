import React, { useState, useEffect } from "react";
import PieChart from "components/charts/PieChart";
import Card from "components/card";
import { API_BASE } from "config/api";

const PieChartCard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/analytics/device-types`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const colors = ["#ffd700", "#6AD2FF", "#ff6b00", "#4ade80", "#a78bfa", "#f87171", "#38bdf8"];
  const total = data.reduce((sum, d) => sum + d.count, 0);

  const chartOptions = {
    labels: data.map((d) => d.type),
    colors: colors.slice(0, data.length),
    chart: { width: "50px" },
    states: { hover: { filter: { type: "none" } } },
    legend: { show: false },
    dataLabels: { enabled: false },
    hover: { mode: null },
    plotOptions: { donut: { expandOnClick: false } },
    fill: { colors: colors.slice(0, data.length) },
    tooltip: { enabled: true, theme: "dark" },
  };

  return (
    <Card extra="!p-[22px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
            Распределение
          </p>
          <h4 className="mt-1 text-xl font-bold text-white">Типы устройств</h4>
        </div>
        <span className="pill pill-gold">{total} шт</span>
      </div>

      <div className="mb-2 mt-2 flex h-[200px] w-full items-center justify-center">
        {data.length > 0 ? (
          <PieChart options={chartOptions} series={data.map((d) => d.count)} />
        ) : (
          <p className="text-sm text-gray-600">Загрузка...</p>
        )}
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3 py-3">
        {data.map((d, i) => (
          <div
            key={d.type}
            className="flex flex-col items-center justify-center"
          >
            <div className="flex items-center justify-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: colors[i],
                  boxShadow: `0 0 8px ${colors[i]}88`,
                }}
              />
              <p className="text-[11px] font-medium text-gray-600">{d.type}</p>
            </div>
            <p className="mt-0.5 text-base font-extrabold text-white">
              {total > 0 ? Math.round((d.count / total) * 100) : 0}%
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PieChartCard;
