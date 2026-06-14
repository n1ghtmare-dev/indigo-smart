import React, { useEffect, useRef, useState } from "react";
import { MdWarningAmber, MdCheckCircle, MdAcUnit } from "react-icons/md";
import { useLiveEvents } from "contexts/LiveEvents";

// Короткий бип через Web Audio (без бинарных ассетов).
function beep(ctx, freq, durationMs) {
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.value = 0.05;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {}
}

const AlertOverlay = () => {
  const { subscribe } = useLiveEvents();
  const [active, setActive] = useState(false); // показывать оверлей
  const [phase, setPhase] = useState(null); // rising | rule_fired | cooling | resolved
  const [temp, setTemp] = useState(null);
  const [armed, setArmed] = useState(false); // пользователь разрешил звук/вибро
  const audioCtx = useRef(null);
  const hideTimer = useRef(null);

  const clearHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  // «Армирование» по первому касанию: создаёт AudioContext (autoplay-политика).
  const arm = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx.current = new Ctx();
      if (audioCtx.current.state === "suspended") audioCtx.current.resume();
    } catch {}
    if (navigator.vibrate) navigator.vibrate(1);
    setArmed(true);
  };

  useEffect(() => {
    const unsub = subscribe((msg) => {
      if (msg.type !== "scenario_step") return;
      const p = msg.phase;
      setPhase(p);
      if (msg.value != null) setTemp(msg.value);

      if (p === "rising" || p === "rule_fired") {
        clearHideTimer();
        setActive(true);
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        if (p === "rising") beep(audioCtx.current, 880, 250);
      } else if (p === "cooling") {
        setActive(true);
      } else if (p === "resolved") {
        if (navigator.vibrate) navigator.vibrate(80);
        beep(audioCtx.current, 523, 200);
        clearHideTimer();
        hideTimer.current = setTimeout(() => setActive(false), 2500);
      } else if (p === "error") {
        setActive(false);
      }
    });
    return () => {
      unsub();
      clearHideTimer();
    };
  }, [subscribe]);

  // Кнопка «армирования» — пока пользователь не нажал.
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
  const bg = cooling
    ? "from-emerald-600/90 to-emerald-900/95"
    : "from-red-600/90 to-red-900/95";

  return (
    <div
      className={`fixed inset-0 z-[70] flex flex-col items-center justify-center bg-gradient-to-b ${bg} backdrop-blur-sm`}
      style={{ animation: "pulse 1.2s ease-in-out infinite" }}
    >
      {cooling ? (
        <MdCheckCircle className="mb-4 h-24 w-24 text-white" />
      ) : (
        <MdWarningAmber className="mb-4 h-24 w-24 animate-bounce text-white" />
      )}
      <h1 className="px-6 text-center text-3xl font-extrabold text-white md:text-5xl">
        {cooling ? "Кондиционер включён автоматически" : "Перегрев в помещении!"}
      </h1>
      {temp != null && (
        <div className="mt-6 flex items-center gap-3 text-white">
          {cooling && <MdAcUnit className="h-10 w-10" />}
          <span className="text-6xl font-black tabular-nums md:text-7xl">
            {Number(temp).toFixed(0)}°
          </span>
        </div>
      )}
      <p className="mt-4 text-sm font-medium text-white/80">
        {cooling ? "Система устранила проблему" : "Система реагирует…"}
      </p>
    </div>
  );
};

export default AlertOverlay;
