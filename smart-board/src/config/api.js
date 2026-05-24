// API_BASE resolution:
// 1. Explicit window.__API_BASE__ override (set via /config.js at runtime)
// 2. REACT_APP_API_URL env var (build-time)
// 3. If frontend is hosted on devtunnels (hostname like xyz-3000.{region}.devtunnels.ms),
//    derive backend URL by swapping port "3000" → "8000".
// 4. Fallback: http://127.0.0.1:8000

function resolveApiBase() {
  if (typeof window !== "undefined" && window.__API_BASE__) {
    return window.__API_BASE__;
  }
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    // devtunnels host pattern: <name>-3000.<region>.devtunnels.ms
    const m = host.match(/^(.+)-(\d+)\.([\w-]+)\.devtunnels\.ms$/i);
    if (m) {
      const [, name, , region] = m;
      return `https://${name}-8000.${region}.devtunnels.ms`;
    }
  }
  return "http://127.0.0.1:8000";
}

export const API_BASE = resolveApiBase();
