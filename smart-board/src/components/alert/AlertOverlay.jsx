import React, { useEffect, useRef, useState } from "react";
import { MdAcUnit, MdCheck, MdClose } from "react-icons/md";
import { useLiveEvents } from "contexts/LiveEvents";
import "./AlertOverlay.css";

// Мягкий уведомительный тон (Web Audio, без ассетов).
function tone(ctx, freq, durationMs, type = "sine", gainVal = 0.05, when = 0) {
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

const TH = 30; // порог перегрева, °C
const Y_MIN = 20;
const Y_MAX = 38;
const SW = 392;
const SH = 66;

const yPos = (v) => SH - ((Math.max(Y_MIN, Math.min(Y_MAX, v)) - Y_MIN) / (Y_MAX - Y_MIN)) * SH;

// Сглаживание ломаной в плавную кривую (Catmull-Rom → кубические безье).
function smoothPath(pts) {
  if (pts.length < 2) return "";
  const d = [`M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d.push(`C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`);
  }
  return d.join(" ");
}

const AlertOverlay = () => {
  const { subscribe } = useLiveEvents();
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState(null);
  const [temp, setTemp] = useState(null);
  const [shown, setShown] = useState(null);
  const [history, setHistory] = useState([]);
  const [armed, setArmed] = useState(false);

  const audioCtx = useRef(null);
  const hideTimer = useRef(null);
  const rafRef = useRef(null);
  const shownRef = useRef(null);
  const histRef = useRef([]);

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

  // Плавный счётчик метрики.
  useEffect(() => {
    if (temp == null) return;
    cancelAnimationFrame(rafRef.current);
    const from = shownRef.current == null ? temp : shownRef.current;
    const to = temp;
    const dur = 600;
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

      if (p === "start") {
        histRef.current = [];
        setHistory([]);
        shownRef.current = null;
        setShown(null);
        setTemp(null);
      }
      setPhase(p);

      if (msg.value != null) {
        setTemp(msg.value);
        histRef.current = [...histRef.current, msg.value].slice(-16);
        setHistory(histRef.current);
      }

      if (p === "rising") {
        clearHideTimer();
        setActive(true);
        if (navigator.vibrate) navigator.vibrate(40);
        tone(audioCtx.current, 740, 130, "sine", 0.04);
        hideTimer.current = setTimeout(() => setActive(false), 30000);
      } else if (p === "rule_fired") {
        clearHideTimer();
        setActive(true);
        if (navigator.vibrate) navigator.vibrate([30, 60, 30]);
        tone(audioCtx.current, 880, 120, "sine", 0.045);
        tone(audioCtx.current, 1170, 150, "sine", 0.04, 0.13);
        hideTimer.current = setTimeout(() => setActive(false), 30000);
      } else if (p === "cooling") {
        clearHideTimer();
        setActive(true);
        hideTimer.current = setTimeout(() => setActive(false), 30000);
      } else if (p === "resolved") {
        if (navigator.vibrate) navigator.vibrate(50);
        tone(audioCtx.current, 660, 320, "sine", 0.05);
        tone(audioCtx.current, 990, 380, "sine", 0.04, 0.04);
        clearHideTimer();
        hideTimer.current = setTimeout(() => setActive(false), 4500);
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

  if (!armed) {
    return (
      <button className="ao-arm" onClick={arm}>
        🔔 Включить уведомления
      </button>
    );
  }

  if (!active) return null;

  const resolved = phase === "resolved";
  const cooling = phase === "cooling" || resolved;
  const acEngaged = phase === "rule_fired" || phase === "cooling" || resolved;

  const accent = resolved ? "#30a46c" : cooling ? "#4aa3d8" : "#e5484d";
  const tag = resolved ? "Инцидент закрыт" : cooling ? "Устранение" : "Активный инцидент";

  const value = shown == null ? temp || Y_MIN : shown;
  const baseline = history.length ? history[0] : 24;
  const delta = value - baseline;
  const deltaUp = delta >= 0;

  const pts = history.map((v, i) => {
    const x = history.length <= 1 ? SW : (i / (history.length - 1)) * SW;
    return [x, yPos(v)];
  });
  const linePath = smoothPath(pts);
  const areaPath = pts.length > 1 ? `${linePath} L ${SW},${SH} L 0,${SH} Z` : "";
  const thY = yPos(TH);
  const last = pts.length ? pts[pts.length - 1] : null;

  const Spark = ({ className }) => (
    <svg className={className} viewBox={`0 0 ${SW} ${SH}`} preserveAspectRatio="none">
      <line x1="0" y1={thY} x2={SW} y2={thY} stroke="rgba(229,72,77,0.45)" strokeWidth="1" strokeDasharray="4 4" />
      {areaPath && <path d={areaPath} fill={accent} opacity="0.12" />}
      {linePath && (
        <path d={linePath} fill="none" stroke={accent} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      )}
      {last && (
        <>
          <circle className="ao-ping" cx={last[0]} cy={last[1]} r="4" fill="none" stroke={accent} strokeWidth="2" />
          <circle cx={last[0]} cy={last[1]} r="3.5" fill={accent} />
        </>
      )}
    </svg>
  );

  const deltaChip = (
    <span className={`ao-delta ${deltaUp ? "up" : "down"}`}>
      {deltaUp ? "▲" : "▼"} {deltaUp ? "+" : ""}
      {delta.toFixed(1)}°
    </span>
  );

  return (
    <div className={`ao-root ${cooling ? "cool" : "hot"}`} style={{ "--accent": accent }}>
      <div className="ao-topbar" />
      <div className={`ao-dock ${cooling ? "top" : ""}`}>
        <div className="ao-aura" />
        <div className={`ao-card ${cooling ? "compact" : ""}`}>
          <div className="ao-sheen" />
          <div className="ao-accentbar" />
          <button
            className="ao-close"
            onClick={() => {
              clearHideTimer();
              setActive(false);
            }}
            aria-label="Закрыть"
          >
            <MdClose />
          </button>

          {cooling ? (
            /* компактная плашка: слева температура, справа график */
            <div className="ao-body ao-compact" key="compact">
              <div className="ao-c-info">
                <span className="ao-tag">
                  <span className="ao-dot" />
                  {tag}
                </span>
                <div className="ao-c-metric">
                  <span className="ao-temp ao-temp-sm">
                    {value.toFixed(1)}
                    <span className="ao-unit">°C</span>
                  </span>
                </div>
                <div className="ao-c-status">
                  <MdAcUnit size={14} /> Кондиционер · {resolved ? "норма" : "активен"}
                </div>
              </div>
              <Spark className="ao-spark-sm" />
            </div>
          ) : (
            /* полная карточка инцидента */
            <div className="ao-body ao-inner" key="full">
              <div className="ao-head">
                <span className="ao-tag">
                  <span className="ao-dot" />
                  {tag}
                </span>
                <span className="ao-loc">Гостиная · сейчас</span>
              </div>

              <div className="ao-type">Обнаружена температурная аномалия</div>
              <div className="ao-metric">
                <span className="ao-temp">
                  {value.toFixed(1)}
                  <span className="ao-unit">°C</span>
                </span>
                {deltaChip}
              </div>

              <Spark className="ao-spark" />

              <div className="ao-divider" />

              <div className="ao-action">
                <div className="ao-aicon">
                  <MdAcUnit size={18} />
                </div>
                <div className="ao-atext">
                  <div className="ao-atitle">Кондиционер · Гостиная</div>
                  <div className="ao-asub">{acEngaged ? "Включён автоматически по правилу" : "Оценка ситуации…"}</div>
                </div>
                <div className="ao-status">
                  {acEngaged ? (
                    <>
                      <MdCheck size={15} /> активен
                    </>
                  ) : (
                    <>
                      <span className="ao-spinner" /> отклик
                    </>
                  )}
                </div>
              </div>

              <div className="ao-foot">
                <span>
                  IndigoSmart · <b>авто-отклик</b>
                </span>
                <span>порог {TH}.0°C</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertOverlay;
