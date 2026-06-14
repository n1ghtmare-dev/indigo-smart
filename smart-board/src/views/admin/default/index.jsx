import WeeklyActivity from "views/admin/default/components/WeeklyActivity";
import TemperatureChart from "views/admin/default/components/TemperatureChart";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard, MdThermostat, MdSensors } from "react-icons/md";
import { useState, useEffect } from "react";
import { API_BASE } from "config/api";

import Widget from "components/widget/Widget";
import MotionEvents from "views/admin/default/components/MotionEvents";
import DeviceStatusCard from "views/admin/default/components/DeviceStatusCard";
import MiniCalendar from "components/calendar/MiniCalendar";
import ScenarioLaunchButton from "components/scenario/ScenarioLaunchButton";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      fetch(`${API_BASE}/dashboard`)
        .then((res) => res.json())
        .then((data) => {
          setDashboard(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="pt-4">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="pill">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.9)]" />
            Обновляется каждые 10 сек
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
            Обзор <span className="text-grad">умного дома</span>
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Состояние датчиков, устройств и последние события — всё на одном экране.
          </p>
        </div>
        <ScenarioLaunchButton className="w-full sm:w-auto" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Комнаты"}
          subtitle={dashboard?.rooms_count ?? "—"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Устройства"}
          subtitle={dashboard?.devices_count ?? "—"}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Активные"}
          subtitle={dashboard?.active_devices ?? "—"}
        />
        <Widget
          icon={<MdSensors className="h-7 w-7" />}
          title={"Сенсоров"}
          subtitle={dashboard?.sensor_count ?? "—"}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Событий сегодня"}
          subtitle={dashboard?.activity_today ?? "—"}
        />
        <Widget
          icon={<MdThermostat className="h-7 w-7" />}
          title={"Ср. температура"}
          subtitle={dashboard?.avg_temperature ? `${dashboard.avg_temperature}°C` : "—"}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TemperatureChart />
        <WeeklyActivity />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <DeviceStatusCard />

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <MotionEvents />
          <PieChartCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
