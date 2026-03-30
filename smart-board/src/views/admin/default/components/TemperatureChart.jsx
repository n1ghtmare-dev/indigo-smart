import React from "react";
import {
  MdArrowDropUp,
  MdOutlineCalendarToday,
  MdBarChart,
} from "react-icons/md";
import Card from "components/card";
import {
  lineChartDataTemperatureChart,
  lineChartOptionsTemperatureChart,
} from "variables/charts";
import LineChart from "components/charts/LineChart";

const TemperatureChart = () => {
  return (
<Card extra="!p-[20px] text-center">
      <div className="flex justify-between">
        <button className="mt-1 flex items-center gap-2 rounded-lg bg-lightPrimary p-2">
          <MdOutlineCalendarToday />
          <span className="text-sm font-medium text-gray-600">
            Последние данные
          </span>
        </button>
      </div>

      <div className="flex flex-col">
        <p className="mt-[20px] text-3xl font-bold text-navy-700">
          24°C
        </p>

        <p className="mt-2 text-sm text-gray-600">
          Средняя температура
        </p>
      </div>

      <div className="h-full w-full mt-4">
        <LineChart
          options={lineChartOptionsTemperatureChart}
          series={[
            {
              name: "Temperature",
              data: [22, 23, 24, 23, 25, 24],
            },
          ]}
        />
      </div>
    </Card>
  );
};

export default TemperatureChart;
