import React, { createContext, useContext, useRef, useState, useCallback, useMemo } from "react";
import { API_BASE } from "config/api";
import { useWebSocket } from "hooks/useWebSocket";

const WS_URL = API_BASE.replace(/^http/, "ws") + "/ws/updates";

const LiveEventsContext = createContext({
  connected: false,
  eventCount: 0,
  subscribe: () => () => {},
});

export const LiveEventsProvider = ({ children }) => {
  const subscribers = useRef(new Set());
  const [eventCount, setEventCount] = useState(0);

  const handle = useCallback((msg) => {
    setEventCount((n) => n + 1);
    subscribers.current.forEach((cb) => {
      try {
        cb(msg);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("[LiveEvents] subscriber threw:", err);
        }
      }
    });
  }, []);

  const { connected } = useWebSocket(WS_URL, handle);

  const subscribe = useCallback((cb) => {
    subscribers.current.add(cb);
    return () => subscribers.current.delete(cb);
  }, []);

  const value = useMemo(
    () => ({ connected, eventCount, subscribe }),
    [connected, eventCount, subscribe]
  );

  return (
    <LiveEventsContext.Provider value={value}>
      {children}
    </LiveEventsContext.Provider>
  );
};

export const useLiveEvents = () => useContext(LiveEventsContext);
