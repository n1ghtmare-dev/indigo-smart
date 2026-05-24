import { API_BASE } from "./api";

const TOKEN_KEY = "indigo_token";
const USER_KEY = "indigo_user";

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: () => {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  },
  isAuthed: () => !!localStorage.getItem(TOKEN_KEY),
  login: async (email, password) => {
    const r = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) throw new Error("Неверный email или пароль");
    const data = await r.json();
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify({
      id: data.user_id, full_name: data.full_name,
      email: data.email, role: data.role,
    }));
    return data;
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export const apiFetch = (url, opts = {}) => {
  const token = auth.getToken();
  const headers = { ...(opts.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (opts.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  return fetch(url.startsWith("http") ? url : `${API_BASE}${url}`, { ...opts, headers });
};
