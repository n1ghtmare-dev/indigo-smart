/* eslint-disable */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";

export function SidebarLinks(props) {
  let location = useLocation();
  const { routes } = props;

  const activeRoute = (routeName) => location.pathname.includes(routeName);

  const createLinks = (routes) =>
    routes.map((route, index) => {
      if (route.hidden) return null;
      if (
        route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/rtl"
      ) {
        const isActive = activeRoute(route.path);
        return (
          <Link key={index} to={route.layout + "/" + route.path}>
            <div
              className={`group relative mb-1.5 flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all hover:bg-white/[0.05] ${
                isActive ? "bg-white/[0.06]" : ""
              }`}
            >
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full"
                  style={{
                    background: "linear-gradient(180deg, #818cf8, #6ad2ff)",
                    boxShadow: "0 0 10px rgba(129, 140, 248, 0.7)",
                  }}
                />
              )}
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                  isActive
                    ? "text-white"
                    : "text-gray-600 group-hover:text-white"
                }`}
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(99,102,241,0.35), rgba(106,210,255,0.18))",
                        border: "1px solid rgba(129, 140, 248, 0.35)",
                      }
                    : {}
                }
              >
                {route.icon ? route.icon : <DashIcon />}
              </span>
              <p
                className={`text-sm transition-all ${
                  isActive
                    ? "font-bold text-white"
                    : "font-medium text-gray-600 group-hover:text-white"
                }`}
              >
                {route.name}
              </p>
            </div>
          </Link>
        );
      }
    });

  return createLinks(routes);
}

export default SidebarLinks;
