import React, { useEffect, useMemo, useRef, useState } from "react";
import { MdWarningAmber, MdCheckCircle, MdAcUnit } from "react-icons/md";
import { useLiveEvents } from "contexts/LiveEvents";
import "./AlertOverlay.css";

// Короткий тон через Web Audio (без бинарных ассетов).
function tone(ctx, freq, durationMs, type = "square", gainVal = 0.05, when = 0) {
  if (!ctx) return;
  try {
    const t = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(gainVal, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + durationMs / 1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + durationMs / 1000);
  } catch {}
}

// Диапазон термометра для кольца-датчика.
const T_MIN = 20;
const T_MAX = 38;

const AlertOverlay = () => {
  const { subscribe } = useLiveEvents();
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState(null); // rising | rule_fired | cooling | resolved | error
  const [temp, setTemp] = useState(null); // целевое значение
  const [shown, setShown] = useState(null); // плавно анимируемое значение
  const [armed, setArmed] = useState(false);
  const audioCtx = useRef(null);
  const hideTimer = useRef(null);
  const rafRef = useRef(null);
  const shownRef = useRef(null);

  const clearHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const arm = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx.current = new Ctx();
      if (audioCtx.current.state === "suspended") audioCtx.current.resume();
    } catch {}
    if (navigator.vibrate) navigator.vibrate(1);
    setArmed(true);
  };

  // Плавный «счётчик»: анимируем shown → temp.
  useEffect(() => {
    if (temp == null) return;
    cancelAnimationFrame(rafRef.current);
    const from = shownRef.current == null ? temp : shownRef.current;
    const to = temp;
    const dur = 550;
    let start = null;
    const tick = (ts) => {
      if (start == null) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = from + (to - from) * eased;
      shownRef.current = v;
      setShown(v);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temp]);

  useEffect(() => {
    const unsub = subscribe((msg) => {
      if (msg.type !== "scenario_step") return;
      const p = msg.phase;
      setPhase(p);
      if (msg.value != null) setTemp(msg.value);

      if (p === "rising") {
        clearHideTimer();
        setActive(true);
        if (navigator.vibrate) navigator.vibrate([90, 50, 90]);
        // нарастающий тревожный тон
        const f = 660 + (msg.value || 24) * 12;
        tone(audioCtx.current, f, 220, "sawtooth", 0.05);
        hideTimer.current = setTimeout(() => setActive(false), 25000);
      } else if (p === "rule_fired") {
        clearHideTimer();
        setActive(true);
        if (navigator.vibrate) navigator.vibrate([300, 80, 300]);
        tone(audioCtx.current, 1200, 140, "square", 0.05);
        tone(audioCtx.current, 1500, 160, "square", 0.05, 0.16);
        hideTimer.current = setTimeout(() => setActive(false), 25000);
      } else if (p === "cooling") {
        clearHideTimer();
        setActive(true);
        hideTimer.current = setTimeout(() => setActive(false), 25000);
      } else if (p === "resolved") {
        if (navigator.vibrate) navigator.vibrate(60);
        // мягкий «разрешающий» аккорд
        tone(audioCtx.current, 523, 380, "sine", 0.06);
        tone(audioCtx.current, 784, 460, "sine", 0.05, 0.05);
        clearHideTimer();
        hideTimer.current = setTimeout(() => setActive(false), 3200);
      } else if (p === "error") {
        clearHideTimer();
        setActive(false);
      }
    });
    return () => {
      unsub();
      clearHideTimer();
      cancelAnimationFrame(rafRef.current);
    };
  }, [subscribe]);

  // Частицы (угли/снег) — позиции фиксируем один раз.
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: Math.round(Math.random() * 100),
        size: 5 + Math.round(Math.random() * 16),
        delay: (Math.random() * 3.2).toFixed(2),
        dur: (2.4 + Math.random() * 2.8).toFixed(2),
        drift: Math.round(Math.random() * 80 - 40),
      })),
    []
  );

  if (!armed) {
    return (
      <button
        onClick={arm}
        className="fixed bottom-4 right-4 z-[60] rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
      >
        🔔 Включить уведомления
      </button>
    );
  }

  if (!active) return null;

  const cooling = phase === "cooling" || phase === "resolved";
  const mode = cooling ? "cool" : "hot";

  // Кольцо-датчик: доля заполнения по температуре.
  const value = shown == null ? temp || T_MIN : shown;
  const frac = Math.max(0, Math.min(1, (value - T_MIN) / (T_MAX - T_MIN)));
  const R = 88;
  const C = 2 * Math.PI * R;
  const ringColor = cooling ? "#28e0d2" : frac > 0.7 ? "#ff2d00" : "#ff8a00";

  const title = cooling
    ? phase === "resolved"
      ? "Угроза устранена"
      : "Климат-контроль активирован"
    : "Критический перегрев";
  const sub = cooling ? "Система охлаждает помещение" : "Автоматика реагирует…";

  return (
    <div className="ao-root">
      <div className={`ao-base ${mode}`} />
      <div className={`ao-bloom ${mode}`} />
      {!cooling && <div className="ao-siren" />}
      <div className={`ao-vignette ${mode}`} />

      <div className="ao-particles" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className={`ao-p ${cooling ? "frost" : "ember"}`}
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
              "--drift": `${p.drift}px`,
            }}
          />
        ))}
      </div>

      <button
        className="ao-close"
        onClick={() => {
          clearHideTimer();
          setActive(false);
        }}
        aria-label="Закрыть"
      >
        ✕
      </button>

      <div className="ao-center">
        <div className="ao-gaugewrap">
          <svg className="ao-ring" viewBox="0 0 200 200">
            <circle className="ao-ring-track" cx="100" cy="100" r={R} strokeWidth="9" />
            <circle
              className="ao-ring-bar"
              cx="100"
              cy="100"
              r={R}
              strokeWidth="9"
              stroke={ringColor}
              strokeDasharray={C}
              strokeDashoffset={C * (1 - frac)}
              style={{ filter: `drop-shadow(0 0 10px ${ringColor})` }}
            />
          </svg>
          <div className="ao-gaugeinner">
            {cooling ? (
              <MdAcUnit className={`ao-icon ${mode}`} />
            ) : (
              <MdWarningAmber className={`ao-icon ${mode}`} />
            )}
            <div className={`ao-num ${mode}`}>
              {Math.round(value)}
              <span className="ao-deg">°C</span>
            </div>
            <div className="ao-chip">
              {cooling ? "температура падает" : "температура растёт"}
            </div>
          </div>
        </div>

        <h1 className={`ao-title ${mode} ${phase === "resolved" ? "ao-pop" : ""}`}>
          {phase === "resolved" && (
            <MdCheckCircle style={{ display: "inline", marginRight: 10, verticalAlign: "-4px" }} />
          )}
          {title}
        </h1>
        <p className="ao-sub">{sub}</p>
      </div>
    </div>
  );
};

export default AlertOverlay;
