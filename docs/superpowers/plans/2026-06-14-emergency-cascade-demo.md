# Демо «Аварийный каскад» — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Одна кнопка на странице «Демо-сценарии» запускает детерминированный каскад «перегрев → дом сам включает кондиционер → температура падает», синхронно отражаемый на всех подключённых устройствах (полноэкранная тревога, вибрация, звук, живые цифры).

**Architecture:** Бэкенд-оркестратор (`scenario_engine.py`) фоновым потоком пишет реальные `SensorReading` (рост, затем падение t°), на пороге создаёт `DeviceState` ON для кондиционера + `AutomationLog`, и на каждом шаге шлёт событие через уже существующий `ws_manager.broadcast`. На фронте один общий `LiveEventsProvider` (сейчас WebSocket живёт только в навбаре) раздаёт события: `AlertOverlay` показывает тревогу + вибрацию + звук + живую температуру, страница «Демо-сценарии» запускает сценарий.

**Tech Stack:** FastAPI, SQLAlchemy, APScheduler (уже есть), threading; React 19, Tailwind, react-icons, существующий хук `useWebSocket`, Web Audio API, `navigator.vibrate`.

**Важно про пути:** все API-роуты регистрируются с префиксом `/api` (см. `main.py`). На фронте `apiFetch("/x")` и `API_BASE` уже учитывают это (в проде `API_BASE` указывает на `.../api`). Поэтому новые вызовы — `apiFetch("/scenario/...")`, тесты бэкенда — на `/api/scenario/...`. (Существующие тесты `test_auth.py`/`test_scenes.py` уже сломаны, т.к. написаны без `/api` — это НЕ часть данной работы, не трогаем.)

---

## Структура файлов

**Создать:**
- `smart-app/src/smart_app/scenario_engine.py` — оркестратор каскада (логика + состояние).
- `smart-app/src/smart_app/routes/scenario.py` — HTTP-роуты запуска и состояния.
- `smart-app/tests/test_scenario.py` — тесты бэкенда.
- `smart-board/src/contexts/LiveEvents.jsx` — общий провайдер WebSocket-событий.
- `smart-board/src/components/alert/AlertOverlay.jsx` — полноэкранная тревога + вибрация + звук + живая t°.
- `smart-board/src/views/admin/scenarios/index.jsx` — страница «Демо-сценарии».

**Изменить:**
- `smart-app/src/smart_app/main.py` — подключить `scenario_router`.
- `smart-board/src/layouts/admin/index.jsx` — обернуть в `LiveEventsProvider`, смонтировать `AlertOverlay`.
- `smart-board/src/components/navbar/index.jsx` — перевести Live-индикатор на `useLiveEvents` (убрать второй сокет).
- `smart-board/src/routes.js` — добавить пункт меню «Демо-сценарии».

---

## Task 1: Бэкенд — `scenario_engine.py` (оркестратор)

**Files:**
- Create: `smart-app/src/smart_app/scenario_engine.py`
- Test: `smart-app/tests/test_scenario.py`

- [ ] **Step 1: Написать падающий тест**

Создать `smart-app/tests/test_scenario.py`:

```python
"""Тесты сценарного оркестратора (каскад «перегрев»)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src", "smart_app"))

from models import Room, DeviceType, Device, SensorReading, DeviceState, AutomationRule, AutomationLog


def _setup_home(db):
    """Комната с датчиком температуры и кондиционером + правило на кондиционер."""
    room = Room(name="Гостиная", description="t")
    db.add(room); db.commit()
    dt_sensor = DeviceType(name="Датчик температуры", is_sensor=True)
    dt_ac = DeviceType(name="Кондиционер", is_sensor=False)
    db.add_all([dt_sensor, dt_ac]); db.commit()
    sensor = Device(name="Темп. Гостиная", room_id=room.id, device_type_id=dt_sensor.id)
    ac = Device(name="Кондиционер Гостиная", room_id=room.id, device_type_id=dt_ac.id)
    db.add_all([sensor, ac]); db.commit()
    rule = AutomationRule(
        name="Охлаждение при жаре", enabled=True,
        sensor_device_id=sensor.id, reading_type="temperature",
        operator=">", threshold_value=30.0,
        target_device_id=ac.id, action_state_type="ON/OFF", action_state_value="1",
        cooldown_seconds=300,
    )
    db.add(rule); db.commit()
    return room, sensor, ac, rule


def test_overheat_writes_rising_then_cooling_readings(db_session):
    import scenario_engine as se
    room, sensor, ac, rule = _setup_home(db_session)

    se._run_overheat(actor_user_id=None,
                     db_factory=lambda: db_session,
                     sleep=lambda s: None)

    readings = (db_session.query(SensorReading)
                .filter(SensorReading.device_id == sensor.id,
                        SensorReading.reading_type == "temperature")
                .order_by(SensorReading.id).all())
    values = [r.value for r in readings]
    # сначала рост до пика, затем падение к норме
    assert values == se.RISING_VALUES + se.COOLING_VALUES
    assert max(values) >= se.THRESHOLD


def test_overheat_turns_ac_on_and_logs(db_session):
    import scenario_engine as se
    room, sensor, ac, rule = _setup_home(db_session)

    se._run_overheat(actor_user_id=None,
                     db_factory=lambda: db_session,
                     sleep=lambda s: None)

    ac_states = (db_session.query(DeviceState)
                 .filter(DeviceState.device_id == ac.id,
                         DeviceState.state_type == "ON/OFF").all())
    assert any(s.state_value == "1" for s in ac_states)

    logs = db_session.query(AutomationLog).filter(AutomationLog.rule_id == rule.id).all()
    assert len(logs) == 1
    assert logs[0].result == "success"


def test_get_state_idle_by_default():
    import scenario_engine as se
    se._reset_state()  # тестовый помощник
    st = se.get_state()
    assert st == {"running": False, "scenario": None, "phase": None}
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `cd smart-app && python -m pytest tests/test_scenario.py -q`
Expected: FAIL — `ModuleNotFoundError: No module named 'scenario_engine'` (ещё не создан).

- [ ] **Step 3: Реализовать `scenario_engine.py`**

Создать `smart-app/src/smart_app/scenario_engine.py`:

```python
"""Сценарный оркестратор для демонстрации.

Детерминированно разыгрывает каскад «перегрев»: пишет реальные показания
температуры (рост → падение), на пороге включает кондиционер и логирует
срабатывание, на каждом шаге транслирует событие через WebSocket.
Не зависит от 20-сек поллинга automation_engine и рандома симулятора.
"""
import logging
import threading
import time as _time
from datetime import datetime
from typing import Optional, Callable

from models import (
    Device, DeviceType, SensorReading, DeviceState,
    AutomationRule, AutomationLog,
)
from ws_manager import manager

log = logging.getLogger("scenario")

# --- Таймлайн (константы — легко подправить длительность) ---
RISING_VALUES = [24.0, 27.0, 30.0, 32.0]   # рост до пика
COOLING_VALUES = [32.0, 28.0, 24.0]        # возврат к норме
STEP_DELAY = 3.0                            # сек между шагами
THRESHOLD = 30.0                            # порог «жары»

_lock = threading.Lock()
_state = {"running": False, "scenario": None, "phase": None}


def get_state() -> dict:
    with _lock:
        return dict(_state)


def _reset_state():
    with _lock:
        _state.update(running=False, scenario=None, phase=None)


def _set_phase(phase: str):
    with _lock:
        _state["phase"] = phase


def _find_target(db):
    """Найти (комнату, датчик температуры, кондиционер).

    Предпочтительно — в одной комнате; иначе берём любые подходящие.
    Возвращает (sensor, ac) или (None, None).
    """
    sensor_type = db.query(DeviceType).filter(DeviceType.name == "Датчик температуры").first()
    ac_type = db.query(DeviceType).filter(DeviceType.name == "Кондиционер").first()
    if not sensor_type or not ac_type:
        return None, None
    sensors = db.query(Device).filter(Device.device_type_id == sensor_type.id).all()
    acs = db.query(Device).filter(Device.device_type_id == ac_type.id).all()
    if not sensors or not acs:
        return None, None
    for s in sensors:
        for a in acs:
            if s.room_id == a.room_id:
                return s, a
    return sensors[0], acs[0]


def _broadcast(phase, sensor, ac, value):
    manager.broadcast_sync({
        "type": "scenario_step",
        "scenario": "overheat",
        "phase": phase,
        "room_id": sensor.room_id,
        "sensor_device_id": sensor.id,
        "ac_device_id": ac.id,
        "value": value,
        "threshold": THRESHOLD,
        "ts": datetime.utcnow().isoformat(),
    })


def _run_overheat(actor_user_id: Optional[int],
                  db_factory: Optional[Callable] = None,
                  sleep: Callable[[float], None] = _time.sleep):
    """Тело сценария. db_factory/sleep инъектируются в тестах."""
    if db_factory is None:
        import db as _db
        db_factory = _db.SessionLocal
    db = db_factory()
    try:
        sensor, ac = _find_target(db)
        if not sensor or not ac:
            log.warning("Сценарий: нет датчика температуры или кондиционера")
            _set_phase("error")
            return

        # Фаза 1 — рост температуры
        _set_phase("rising")
        for v in RISING_VALUES:
            db.add(SensorReading(device_id=sensor.id, reading_type="temperature",
                                 value=v, recorded_at=datetime.utcnow()))
            db.commit()
            _broadcast("rising", sensor, ac, v)
            sleep(STEP_DELAY)

        # Фаза 2 — дом реагирует: включить кондиционер + журнал
        _set_phase("rule_fired")
        db.add(DeviceState(device_id=ac.id, state_type="ON/OFF",
                           state_value="1", changed_by=actor_user_id))
        rule = (db.query(AutomationRule)
                .filter(AutomationRule.target_device_id == ac.id)
                .order_by(AutomationRule.id).first())
        if rule:
            rule.last_triggered_at = datetime.utcnow()
            db.add(AutomationLog(
                rule_id=rule.id, trigger_value=max(RISING_VALUES),
                result="success",
                message="Кондиционер включён автоматически (сценарий «Перегрев»)",
            ))
        db.commit()
        _broadcast("rule_fired", sensor, ac, max(RISING_VALUES))
        sleep(STEP_DELAY)

        # Фаза 3 — охлаждение
        _set_phase("cooling")
        for v in COOLING_VALUES:
            db.add(SensorReading(device_id=sensor.id, reading_type="temperature",
                                 value=v, recorded_at=datetime.utcnow()))
            db.commit()
            _broadcast("cooling", sensor, ac, v)
            sleep(STEP_DELAY)

        _set_phase("resolved")
        _broadcast("resolved", sensor, ac, COOLING_VALUES[-1])
    except Exception:
        log.exception("Сценарий «Перегрев» упал")
        db.rollback()
    finally:
        db.close()
        _reset_state()


def start_overheat(actor_user_id: Optional[int], runner: Optional[Callable] = None) -> bool:
    """Запустить сценарий в фоне. False, если уже идёт."""
    with _lock:
        if _state["running"]:
            return False
        _state.update(running=True, scenario="overheat", phase="start")
    target = runner or _run_overheat
    threading.Thread(target=target, args=(actor_user_id,), daemon=True).start()
    return True
```

Примечание: `_run_overheat` в тестах вызывается с `db_factory=lambda: db_session`, поэтому `db.close()` закроет тестовую сессию — это ок, ассерты идут после возврата на том же объекте (SQLite StaticPool держит соединение). Если в каком-то тесте сессия нужна после — повторно запросить через фикстуру не требуется, объект остаётся читаемым до конца теста.

- [ ] **Step 4: Запустить тесты — убедиться, что проходят**

Run: `cd smart-app && python -m pytest tests/test_scenario.py -q`
Expected: PASS (3 passed).

- [ ] **Step 5: Commit**

```bash
git add smart-app/src/smart_app/scenario_engine.py smart-app/tests/test_scenario.py
git commit -m "feat(scenario): оркестратор каскада «перегрев» с тестами"
```

---

## Task 2: Бэкенд — роуты `routes/scenario.py` + регистрация

**Files:**
- Create: `smart-app/src/smart_app/routes/scenario.py`
- Modify: `smart-app/src/smart_app/main.py`
- Test: `smart-app/tests/test_scenario.py` (дописать)

- [ ] **Step 1: Дописать падающий тест эндпоинта**

Добавить в конец `smart-app/tests/test_scenario.py`:

```python
def _auth_header(client):
    r = client.post("/api/auth/register", json={
        "full_name": "Demo", "email": "demo@e.com", "password": "p",
    })
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_start_overheat_endpoint(client, monkeypatch):
    import scenario_engine as se
    se._reset_state()
    # не запускать настоящий поток в тесте: runner-заглушка не сбрасывает состояние
    monkeypatch.setattr(se, "_run_overheat", lambda *a, **k: None)

    headers = _auth_header(client)
    r1 = client.post("/api/scenario/overheat/start", headers=headers)
    assert r1.status_code == 200
    assert r1.json()["ok"] is True

    # второй запуск, пока «идёт» → 409
    r2 = client.post("/api/scenario/overheat/start", headers=headers)
    assert r2.status_code == 409

    se._reset_state()


def test_scenario_state_endpoint(client):
    import scenario_engine as se
    se._reset_state()
    r = client.get("/api/scenario/state")
    assert r.status_code == 200
    assert r.json()["running"] is False


def test_start_requires_auth(client):
    import scenario_engine as se
    se._reset_state()
    r = client.post("/api/scenario/overheat/start")
    assert r.status_code == 401
```

- [ ] **Step 2: Запустить — убедиться, что падает**

Run: `cd smart-app && python -m pytest tests/test_scenario.py -k endpoint -q`
Expected: FAIL — 404 (роут не зарегистрирован).

- [ ] **Step 3: Создать `routes/scenario.py`**

```python
"""Запуск демонстрационных сценариев + их состояние."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db import get_db  # noqa: F401  (единый стиль импортов роутов)
from models import User
from security import require_user_or_admin
import scenario_engine

router = APIRouter(prefix="/scenario", tags=["scenario"])


@router.get("/state")
def scenario_state():
    return scenario_engine.get_state()


@router.post("/overheat/start")
def start_overheat(user: User = Depends(require_user_or_admin)):
    started = scenario_engine.start_overheat(user.id)
    if not started:
        raise HTTPException(409, "Сценарий уже выполняется")
    return {"ok": True, "scenario": "overheat"}
```

- [ ] **Step 4: Подключить роутер в `main.py`**

В `smart-app/src/smart_app/main.py` добавить импорт рядом с остальными `from routes... import`:

```python
from routes.scenario import router as scenario_router
```

И строку регистрации рядом с другими `app.include_router(...)`:

```python
app.include_router(scenario_router, prefix=API_PREFIX)
```

- [ ] **Step 5: Запустить все тесты сценария**

Run: `cd smart-app && python -m pytest tests/test_scenario.py -q`
Expected: PASS (6 passed).

- [ ] **Step 6: Commit**

```bash
git add smart-app/src/smart_app/routes/scenario.py smart-app/src/smart_app/main.py smart-app/tests/test_scenario.py
git commit -m "feat(scenario): эндпоинты запуска/состояния сценария"
```

---

## Task 3: Фронт — общий провайдер событий `LiveEvents.jsx`

**Files:**
- Create: `smart-board/src/contexts/LiveEvents.jsx`
- Modify: `smart-board/src/layouts/admin/index.jsx`, `smart-board/src/components/navbar/index.jsx`

- [ ] **Step 1: Создать контекст-провайдер**

Создать `smart-board/src/contexts/LiveEvents.jsx`:

```jsx
import React, { createContext, useContext, useRef, useState, useCallback } from "react";
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
      try { cb(msg); } catch {}
    });
  }, []);

  const { connected } = useWebSocket(WS_URL, handle);

  const subscribe = useCallback((cb) => {
    subscribers.current.add(cb);
    return () => subscribers.current.delete(cb);
  }, []);

  return (
    <LiveEventsContext.Provider value={{ connected, eventCount, subscribe }}>
      {children}
    </LiveEventsContext.Provider>
  );
};

export const useLiveEvents = () => useContext(LiveEventsContext);
```

- [ ] **Step 2: Обернуть админ-лейаут провайдером**

В `smart-board/src/layouts/admin/index.jsx`:

Добавить импорт вверху:
```jsx
import { LiveEventsProvider } from "contexts/LiveEvents";
```

Обернуть корневой `<div className="flex h-full w-full">...</div>` в `<LiveEventsProvider>`:
```jsx
  return (
    <LiveEventsProvider>
      <div className="flex h-full w-full">
        {/* ...существующее содержимое без изменений... */}
      </div>
    </LiveEventsProvider>
  );
```

- [ ] **Step 3: Перевести навбар на общий контекст (убрать второй сокет)**

В `smart-board/src/components/navbar/index.jsx`:

Удалить строки:
```jsx
import { API_BASE } from "config/api";
import { useWebSocket } from "hooks/useWebSocket";

const WS_URL = API_BASE.replace(/^http/, "ws") + "/ws/updates";
```
и
```jsx
  const { connected } = useWebSocket(WS_URL, (msg) => {
    setEventCount((n) => n + 1);
  });
```
а также локальный `const [eventCount, setEventCount] = useState(0);`

Добавить импорт:
```jsx
import { useLiveEvents } from "contexts/LiveEvents";
```
И внутри компонента:
```jsx
  const { connected, eventCount } = useLiveEvents();
```
(Остальная разметка с `connected`/`eventCount` остаётся прежней.)

- [ ] **Step 4: Проверка сборки**

Run: `cd smart-board && npx eslint src/contexts/LiveEvents.jsx src/components/navbar/index.jsx`
Expected: без ошибок (предупреждения react-hooks/exhaustive-deps допустимы, как в существующем `useWebSocket`).

Ручная проверка: `npm start`, открыть приложение — индикатор «Live» в навбаре по-прежнему загорается зелёным при подключении. (Один WebSocket вместо двух — видно в DevTools → Network → WS.)

- [ ] **Step 5: Commit**

```bash
git add smart-board/src/contexts/LiveEvents.jsx smart-board/src/layouts/admin/index.jsx smart-board/src/components/navbar/index.jsx
git commit -m "feat(live): общий провайдер WebSocket-событий, навбар на один сокет"
```

---

## Task 4: Фронт — `AlertOverlay` (тревога + вибрация + звук + живая t°)

**Files:**
- Create: `smart-board/src/components/alert/AlertOverlay.jsx`
- Modify: `smart-board/src/layouts/admin/index.jsx`

- [ ] **Step 1: Создать компонент тревоги**

Создать `smart-board/src/components/alert/AlertOverlay.jsx`:

```jsx
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
  const [active, setActive] = useState(false);   // показывать оверлей
  const [phase, setPhase] = useState(null);      // rising | rule_fired | cooling | resolved
  const [temp, setTemp] = useState(null);
  const [armed, setArmed] = useState(false);     // пользователь разрешил звук/вибро
  const audioCtx = useRef(null);
  const hideTimer = useRef(null);

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
        setActive(true);
        if (clearTimeoutSafe(hideTimer)) {}
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        if (p === "rising") beep(audioCtx.current, 880, 250);
      } else if (p === "cooling") {
        setActive(true);
      } else if (p === "resolved") {
        if (navigator.vibrate) navigator.vibrate(80);
        beep(audioCtx.current, 523, 200);
        hideTimer.current = setTimeout(() => setActive(false), 2500);
      } else if (p === "error") {
        setActive(false);
      }
    });
    return () => {
      unsub();
      if (hideTimer.current) clearTimeout(hideTimer.current);
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

// маленький помощник, чтобы не плодить переменные
function clearTimeoutSafe(ref) {
  if (ref.current) { clearTimeout(ref.current); ref.current = null; return true; }
  return false;
}

export default AlertOverlay;
```

- [ ] **Step 2: Смонтировать оверлей в лейауте**

В `smart-board/src/layouts/admin/index.jsx` добавить импорт:
```jsx
import AlertOverlay from "components/alert/AlertOverlay";
```
И поместить `<AlertOverlay />` прямо внутри `<LiveEventsProvider>` (рядом с корневым `<div>`), чтобы он перекрывал всё приложение:
```jsx
    <LiveEventsProvider>
      <AlertOverlay />
      <div className="flex h-full w-full">
        ...
      </div>
    </LiveEventsProvider>
```

- [ ] **Step 3: Проверка линтера**

Run: `cd smart-board && npx eslint src/components/alert/AlertOverlay.jsx`
Expected: без ошибок.

- [ ] **Step 4: Commit**

```bash
git add smart-board/src/components/alert/AlertOverlay.jsx smart-board/src/layouts/admin/index.jsx
git commit -m "feat(alert): полноэкранная тревога с вибрацией, звуком и живой температурой"
```

---

## Task 5: Фронт — страница «Демо-сценарии» + пункт меню

**Files:**
- Create: `smart-board/src/views/admin/scenarios/index.jsx`
- Modify: `smart-board/src/routes.js`

- [ ] **Step 1: Создать страницу**

Создать `smart-board/src/views/admin/scenarios/index.jsx`:

```jsx
import React, { useEffect, useState } from "react";
import Card from "components/card";
import { apiFetch } from "config/auth";
import { useLiveEvents } from "contexts/LiveEvents";
import { MdLocalFireDepartment, MdPlayArrow } from "react-icons/md";

const PHASE_LABEL = {
  start: "Запуск…",
  rising: "🌡️ Температура растёт…",
  rule_fired: "❄️ Дом включает кондиционер…",
  cooling: "📉 Температура снижается…",
  resolved: "✅ Проблема устранена",
  error: "⚠️ Нет подходящих устройств",
};

const Scenarios = () => {
  const { subscribe } = useLiveEvents();
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(null);

  useEffect(() => {
    apiFetch("/scenario/state")
      .then((r) => r.json())
      .then((s) => { setRunning(!!s.running); setPhase(s.phase); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const unsub = subscribe((msg) => {
      if (msg.type !== "scenario_step") return;
      setPhase(msg.phase);
      setRunning(msg.phase !== "resolved" && msg.phase !== "error");
    });
    return unsub;
  }, [subscribe]);

  const launch = async () => {
    setRunning(true);
    setPhase("start");
    const r = await apiFetch("/scenario/overheat/start", { method: "POST" });
    if (!r.ok) {
      setRunning(false);
      if (r.status === 409) alert("Сценарий уже выполняется");
    }
  };

  return (
    <div className="pt-4">
      <div className="mb-6">
        <span className="pill pill-cyan">демонстрация</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
          Демо-<span className="text-grad">сценарии</span>
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Запускайте аварийные ситуации — система отреагирует на всех устройствах разом.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card extra="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
              <MdLocalFireDepartment className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Перегрев помещения</h3>
              <p className="text-sm text-gray-600">
                Температура поднимается выше нормы — дом автоматически включает кондиционер.
              </p>
            </div>
          </div>

          <button
            onClick={launch}
            disabled={running}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MdPlayArrow className="h-5 w-5" />
            {running ? "Сценарий идёт…" : "Запустить сценарий"}
          </button>

          {phase && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/80">
              {PHASE_LABEL[phase] || phase}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Scenarios;
```

- [ ] **Step 2: Добавить пункт меню в `routes.js`**

В `smart-board/src/routes.js`:

Добавить импорт страницы рядом с остальными:
```jsx
import Scenarios from "views/admin/scenarios";
```
Добавить иконку в импорт из `react-icons/md` (в существующий список): `MdLocalFireDepartment`.

Добавить запись в массив `routes` (например, сразу после «Автоматизация»):
```jsx
  { name: "Демо-сценарии", layout: "/admin", path: "scenarios", icon: <MdLocalFireDepartment className="h-6 w-6" />, component: <Scenarios /> },
```

- [ ] **Step 3: Проверка линтера + ручная проверка**

Run: `cd smart-board && npx eslint src/views/admin/scenarios/index.jsx src/routes.js`
Expected: без ошибок.

Ручная: `npm start` → в меню появился пункт «Демо-сценарии» → страница открывается, видна карточка с кнопкой.

- [ ] **Step 4: Commit**

```bash
git add smart-board/src/views/admin/scenarios/index.jsx smart-board/src/routes.js
git commit -m "feat(scenarios): страница демо-сценариев с запуском «перегрева»"
```

---

## Task 6: Фронт — пульсация комнаты на плане дома (доп. эффект)

**Files:**
- Modify: `smart-board/src/views/admin/floorplan/index.jsx`

> Цель: комната с `room_id` из события пульсирует красным на `rising`/`rule_fired`,
> остывает на `cooling`/`resolved`. Это украшение; основной «вау» уже даёт `AlertOverlay`.
> Если структура floorplan окажется сложной для быстрой правки — задачу можно отложить
> без ущерба для демо.

- [ ] **Step 1: Прочитать текущую реализацию плана**

Открыть `smart-board/src/views/admin/floorplan/index.jsx`, найти, где рендерятся комнаты
(контейнер с координатами/именем комнаты) и каким образом к ним применяется стиль/класс.

- [ ] **Step 2: Подписаться на события и хранить «горячую» комнату**

Внутри компонента floorplan добавить:
```jsx
import { useLiveEvents } from "contexts/LiveEvents";
// ...
const { subscribe } = useLiveEvents();
const [alertRoom, setAlertRoom] = useState(null); // { roomId, cooling }
useEffect(() => {
  const unsub = subscribe((msg) => {
    if (msg.type !== "scenario_step") return;
    if (msg.phase === "resolved" || msg.phase === "error") { setAlertRoom(null); return; }
    setAlertRoom({ roomId: msg.room_id, cooling: msg.phase === "cooling" });
  });
  return unsub;
}, [subscribe]);
```

- [ ] **Step 3: Подсветить нужную комнату**

В месте рендера комнаты добавить условный стиль (подставить реальное имя переменной комнаты, например `room.id`):
```jsx
style={{
  ...existingStyle,
  ...(alertRoom && alertRoom.roomId === room.id
    ? {
        boxShadow: alertRoom.cooling
          ? "0 0 0 3px rgba(16,185,129,0.9), 0 0 30px rgba(16,185,129,0.6)"
          : "0 0 0 3px rgba(239,68,68,0.9), 0 0 30px rgba(239,68,68,0.7)",
        transition: "box-shadow 0.4s ease",
      }
    : {}),
}}
```

- [ ] **Step 4: Проверка линтера + ручная проверка**

Run: `cd smart-board && npx eslint src/views/admin/floorplan/index.jsx`
Expected: без ошибок.

Ручная: открыть план дома, запустить сценарий со второй вкладки → нужная комната
краснеет, затем зеленеет/гаснет.

- [ ] **Step 5: Commit**

```bash
git add smart-board/src/views/admin/floorplan/index.jsx
git commit -m "feat(floorplan): подсветка комнаты во время сценария"
```

---

## Task 7: Интеграционная проверка (по критерию успеха спеки)

**Files:** нет (ручная проверка).

- [ ] **Step 1: Поднять стек**

Run: `docker compose up --build` (или локально: бэкенд `uvicorn`, фронт `npm start`).
Убедиться, что в БД есть датчик температуры и кондиционер (через `seed_all.py`).

- [ ] **Step 2: Открыть два клиента**

Открыть приложение в двух браузерах/вкладках (имитация телефонов комиссии), войти под
одним аккаунтом, на каждом нажать «🔔 Включить уведомления».

- [ ] **Step 3: Запустить сценарий**

На одной вкладке (страница «Демо-сценарии») нажать «Запустить сценарий».

- [ ] **Step 4: Проверить критерий успеха**

Ожидается на ОБОИХ клиентах в пределах ~1 сек:
- полноэкранная красная тревога, число температуры растёт 24→32;
- затем зелёный экран «Кондиционер включён автоматически», число падает 32→24, оверлей гаснет;
- (если телефон поддерживает) вибрация и звук.

Проверить данные:
- на странице «Автоматизация» в журнале появилась запись «Кондиственно… (сценарий «Перегрев»)»;
- на графике температуры виден всплеск выше порога и возврат к норме.

- [ ] **Step 5: Финальный прогон бэкенд-тестов**

Run: `cd smart-app && python -m pytest tests/test_scenario.py -q`
Expected: PASS (6 passed).

---

## Заметки

- **Вибрация/звук — best-effort.** iOS Safari не поддерживает `navigator.vibrate`; звук без
  жеста пользователя блокируется autoplay-политикой — поэтому есть кнопка «🔔 Включить
  уведомления», которую комиссия нажимает один раз (создаёт AudioContext, «разблокирует»
  медиа). Визуальная часть (оверлей, цифры, подсветка) работает всегда.
- **Длительность** ~ `(len(RISING)+1+len(COOLING)) * STEP_DELAY` ≈ 24 сек. Меняется
  правкой констант в `scenario_engine.py` (Task 1).
- **Web Push** (уведомления на заблокированном телефоне) — отдельная следующая итерация,
  в этот план не входит.
