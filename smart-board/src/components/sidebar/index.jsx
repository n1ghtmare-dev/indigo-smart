/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import routes from "routes.js";

const Sidebar = ({ open, onClose }) => {
  return (
    <div
      className={`sm:none duration-200 linear fixed !z-50 flex min-h-full w-[280px] flex-col pb-10 transition-all md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
      style={{
        background:
          "linear-gradient(180deg, rgba(17, 23, 46, 0.92), rgba(11, 15, 31, 0.85))",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(163, 174, 208, 0.12)",
        boxShadow: "0 0 60px rgba(0, 0, 0, 0.3)",
      }}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer text-white/60 hover:text-white xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className="mx-7 mt-9 flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #6366f1, #6ad2ff)",
            boxShadow: "0 8px 24px rgba(99, 102, 241, 0.45)",
          }}
        />
        <div className="flex flex-col leading-none">
          <span className="text-[20px] font-extrabold tracking-tight text-white">
            Indigo<span className="text-grad">Smart</span>
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
            Smart Home · 2026
          </span>
        </div>
      </div>

      <div className="mx-7 mt-7 mb-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <p className="mx-7 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
        Навигация
      </p>

      <ul className="mb-auto px-3">
        <Links routes={routes} />
      </ul>

      <div className="mx-5 mt-4 rounded-2xl border border-white/10 p-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(106, 210, 255, 0.08))",
        }}
      >
        <p className="text-xs font-bold text-white">IndigoSmart v1.0</p>
        <p className="mt-1 text-[11px] text-gray-600">
          Дипломный проект · FastAPI + React
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
