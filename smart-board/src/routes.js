import React from "react";

import MainDashboard from "views/admin/default";
import DataTables from "views/admin/tables";
import Analytics from "views/admin/analytics";
import Scenes from "views/admin/scenes";
import Automation from "views/admin/automation";
import Schedules from "views/admin/schedules";
import Energy from "views/admin/energy";
import Audit from "views/admin/audit";
import FloorPlan from "views/admin/floorplan";
import DeviceDetail from "views/admin/device";
import Scenarios from "views/admin/scenarios";

import {
  MdHome, MdDevices, MdBarChart, MdAutoAwesome,
  MdAutoFixHigh, MdSchedule, MdBolt, MdSecurity, MdMap, MdLocalFireDepartment,
} from "react-icons/md";

const routes = [
  { name: "Главная", layout: "/admin", path: "default", icon: <MdHome className="h-6 w-6" />, component: <MainDashboard /> },
  { name: "Устройства", layout: "/admin", path: "devices", icon: <MdDevices className="h-6 w-6" />, component: <DataTables /> },
  { name: "План помещений", layout: "/admin", path: "floorplan", icon: <MdMap className="h-6 w-6" />, component: <FloorPlan /> },
  { name: "Сценарии", layout: "/admin", path: "scenes", icon: <MdAutoAwesome className="h-6 w-6" />, component: <Scenes /> },
  { name: "Автоматизация", layout: "/admin", path: "automation", icon: <MdAutoFixHigh className="h-6 w-6" />, component: <Automation /> },
  { name: "Демо-сценарии", layout: "/admin", path: "scenarios", icon: <MdLocalFireDepartment className="h-6 w-6" />, component: <Scenarios /> },
  { name: "Расписания", layout: "/admin", path: "schedules", icon: <MdSchedule className="h-6 w-6" />, component: <Schedules /> },
  { name: "Аналитика", layout: "/admin", path: "analytics", icon: <MdBarChart className="h-6 w-6" />, component: <Analytics /> },
  { name: "Энергия", layout: "/admin", path: "energy", icon: <MdBolt className="h-6 w-6" />, component: <Energy /> },
  { name: "Аудит", layout: "/admin", path: "audit", icon: <MdSecurity className="h-6 w-6" />, component: <Audit /> },
  // Hidden routes (not in sidebar)
  { name: "Устройство", layout: "/admin", path: "device/:id", icon: <MdDevices className="h-6 w-6" />, component: <DeviceDetail />, hidden: true },
];
export default routes;
