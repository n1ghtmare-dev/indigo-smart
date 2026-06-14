import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { apiFetch } from "config/auth";

// Канал доставки live-событий — HTTP-поллинг состояния сценария.
// WebSocket не используется: в проде nginx не апгрейдит /api/ws/updates
// (отдаёт статику), поэтому опрос /scenario/state по обычному HTTP надёжнее.
const POLL_MS = 1000;

const LiveEventsContext = createContext({
  connected: false,
  eventCount: 0,
  subscribe: () => () => {},
});

export const LiveEventsProvider = ({ children }) => {
  const subscribers = useRef(new Set());
  const lastSeq = useRef(null);
  const [connected, setConnected] = useState(false);
  const [eventCount, setEventCount] = useState(0);

  const emit = useCallback((msg) => {
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

  useEffect(() => {
    let cancelled = false;
    let timer = null;

    const poll = async () => {
      try {
        const r = await apiFetch("/scenario/state");
        if (!r.ok) throw new Error("bad status");
        const s = await r.json();
        if (cancelled) return;
        setConnected(true);

        if (typeof s.seq === "number" && s.seq !== lastSeq.current) {
          // Первый успешный опрос только запоминает seq — не проигрываем
          // «несвежий» шаг (например, resolved от прошлого запуска при загрузке).
          const first = lastSeq.current === null;
          lastSeq.current = s.seq;
          if (!first && s.seq > 0) {
            emit({
              type: "scenario_step",
              scenario: s.scenario,
              phase: s.phase,
              value: s.value,
              room_id: s.room_id,
            });
          }
        }
      } catch {
        if (!cancelled) setConnected(false);
      } finally {
        if (!cancelled) timer = setTimeout(poll, POLL_MS);
      }
    };

    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [emit]);

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
