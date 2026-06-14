import React, { useState, useEffect } from "react";
import { FiAlignJustify } from "react-icons/fi";
import { MdLogout, MdLightMode, MdDarkMode } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { auth } from "config/auth";
import { useLiveEvents } from "contexts/LiveEvents";

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const navigate = useNavigate();
  const [user] = useState(() => auth.getUser());
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  const { connected, eventCount } = useLiveEvents();

  useEffect(() => {
    if (theme === "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const now = new Date();
  const dateStr = now.toLocaleDateString("ru-RU", {
    day: "numeric", month: "long", year: "numeric",
  });

  const initial = (user?.full_name || "?").charAt(0);

  const logout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <nav
      className="sticky top-2 z-40 mt-2 flex flex-row items-center justify-between rounded-2xl border border-white/[0.08] px-5 py-3"
      style={{
        background: "linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
        backdropFilter: "blur(18px)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-white/70 transition hover:bg-white/[0.08] hover:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
            IndigoSmart · {user?.role}
          </span>
          <h1 className="text-[24px] font-extrabold tracking-tight text-white">
            {brandText}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 md:flex">
          <span
            className={`h-2 w-2 rounded-full ${connected ? "animate-pulse bg-green-400" : "bg-gray-500"}`}
            style={connected ? { boxShadow: "0 0 8px rgba(74,222,128,0.8)" } : {}}
          />
          <span className="text-xs font-semibold text-white/80">
            {connected ? `Live · ${eventCount}` : "Offline"}
          </span>
        </div>
        <div className="hidden rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-medium text-gray-600 md:block">
          {dateStr}
        </div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.08]"
          title="Сменить тему"
        >
          {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
        </button>
        <button
          onClick={logout}
          className="flex h-9 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-semibold text-white hover:bg-white/[0.08]"
          title="Выйти"
        >
          <MdLogout /> Выход
        </button>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #6366f1, #6ad2ff)",
            boxShadow: "0 6px 18px rgba(99,102,241,0.4)",
          }}
          title={user?.full_name}
        >
          {initial}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
