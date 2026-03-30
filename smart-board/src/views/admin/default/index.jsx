import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TemperatureChart from "views/admin/default/components/TemperatureChart";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";
import { useState, useEffect } from "react";

import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    const fetchData = () => {
      fetch("http://127.0.0.1:8000/dashboard")
      .then(res => res.json())
      .then(data => setDashboard(data))
      .catch(err => console.error(err));
    }

    fetchData();

    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
    
  }, []);

  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Количество комнат"}
          subtitle={dashboard.rooms_count}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Устройства"}
          subtitle={dashboard.devices_count}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Активные устройства"}
          subtitle={dashboard.active_devices}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Активность сегодня"}
          subtitle={dashboard.activity_today}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Последнее действие"}
          subtitle={dashboard.last_action}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Средняя температура"}
          subtitle={`${dashboard.avg_temperature}°C`}
        />
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TemperatureChart />
        <WeeklyRevenue />
      </div>

      {/* Tables & Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Check Table */}
        <div>
          <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          />
        </div>

        {/* Traffic chart & Pie Chart */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div>

        {/* Complex Table , Task & Calendar */}

        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />

        {/* Task chart & Calendar */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <TaskCard />
          <div className="grid grid-cols-1 rounded-[20px]">
            <MiniCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
