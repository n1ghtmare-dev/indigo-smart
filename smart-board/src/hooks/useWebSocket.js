import { useEffect, useRef, useState } from "react";

export const useWebSocket = (url, onMessage) => {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const connect = () => {
      if (cancelled) return;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (onMessage) onMessage(data);
        } catch {}
      };
      ws.onclose = () => {
        setConnected(false);
        if (!cancelled) {
          reconnectTimer.current = setTimeout(connect, 3000);
        }
      };
      ws.onerror = () => {
        try { ws.close(); } catch {}
      };
    };

    connect();
    return () => {
      cancelled = true;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      try { wsRef.current?.close(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { connected };
};
