import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "config/auth";

const Login = () => {
  const [email, setEmail] = useState("ivan@example.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await auth.login(email, password);
      navigate("/admin/default");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card w-full max-w-md !p-8">
        <div className="mb-6 flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #6366f1, #6ad2ff)",
              boxShadow: "0 10px 30px rgba(99,102,241,0.5)",
            }}
          />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
              IndigoSmart
            </p>
            <h1 className="text-2xl font-extrabold text-white">
              Вход в <span className="text-grad">систему</span>
            </h1>
          </div>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white outline-none transition focus:border-indigo-400 focus:bg-white/[0.06]"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
              Пароль
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white outline-none transition focus:border-indigo-400 focus:bg-white/[0.06]"
            />
          </label>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 w-full disabled:opacity-50"
          >
            {loading ? "Вход..." : "Войти"}
          </button>

          <div className="mt-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
              Демо-аккаунты
            </p>
            <p className="mt-1 text-xs text-gray-600">
              <code className="text-cyan-300">ivan@example.com</code> · admin
              <br />
              <code className="text-cyan-300">anna@example.com</code> · user
              <br />
              Пароль обоих: <code className="text-gold">demo123</code>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
