import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";
import { LiveEventsProvider } from "contexts/LiveEvents";
import AlertOverlay from "components/alert/AlertOverlay";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(window.innerWidth >= 1200);
  const [currentRoute, setCurrentRoute] = React.useState("Главная");

  React.useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    if (saved === "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    getActiveRoute(routes);
    if (window.innerWidth < 1200) {
      setOpen(false);
    }
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      }
      return null;
    });
  };

  document.documentElement.dir = "ltr";
  return (
    <LiveEventsProvider>
      <AlertOverlay />
      <div className="flex h-full w-full">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        {/* Overlay for mobile sidebar */}
        {open && window.innerWidth < 1200 && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
            onClick={() => setOpen(false)}
          />
        )}
        <div className="h-full w-full">
          <main
            className="mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[300px]"
          >
            <div className="h-full">
              <Navbar
                onOpenSidenav={() => setOpen(!open)}
                brandText={currentRoute}
                {...rest}
              />
              <div className="mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
                <Routes>
                  {getRoutes(routes)}
                  <Route
                    path="/"
                    element={<Navigate to="/admin/default" replace />}
                  />
                </Routes>
              </div>
              <div className="p-3">
                <Footer />
              </div>
            </div>
          </main>
        </div>
      </div>
    </LiveEventsProvider>
  );
}
