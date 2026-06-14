"""Сценарный оркестратор для демонстрации.

Детерминированно разыгрывает каскад «перегрев»: пишет реальные показания
температуры (рост → падение), на пороге включает кондиционер и логирует
срабатывание. На каждом шаге обновляет публичное состояние (его опрашивает
фронт через /scenario/state) И транслирует событие по WebSocket.

Почему и поллинг, и WebSocket: в проде nginx не апгрейдит WebSocket для
/api/ws/updates (отдаёт статику), поэтому надёжный канал доставки на фронт —
HTTP-поллинг состояния. WebSocket оставлен как бонус для сред, где он работает.
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
RISING_VALUES = [24.0, 30.0, 36.0]               # резкий скачок вверх (так и ловится перегрев)
COOLING_VALUES = [36.0, 33.0, 30.0, 27.0, 24.0]  # медленный возврат к норме
RISE_DELAY = 0.8                                  # быстро между шагами роста
COOL_DELAY = 3.0                                  # медленно между шагами охлаждения
THRESHOLD = 30.0                                  # порог «жары»

_lock = threading.Lock()
# seq — монотонный счётчик шагов: фронт по его изменению понимает, что пришёл
# новый шаг (даже если значение температуры повторилось).
_state = {
    "running": False, "scenario": None, "phase": None,
    "value": None, "room_id": None, "seq": 0,
}


def get_state() -> dict:
    with _lock:
        return dict(_state)


def _reset_state():
    with _lock:
        _state.update(running=False, scenario=None, phase=None,
                      value=None, room_id=None, seq=0)


def _find_target(db):
    """Найти (датчик температуры, кондиционер).

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


def _step(phase, sensor, ac, value, running=None):
    """Опубликовать шаг сценария: обновить состояние (для поллинга) + WS-broadcast."""
    room_id = sensor.room_id if sensor else None
    with _lock:
        _state["phase"] = phase
        _state["value"] = value
        _state["room_id"] = room_id
        if running is not None:
            _state["running"] = running
        _state["seq"] += 1
    manager.broadcast_sync({
        "type": "scenario_step",
        "scenario": "overheat",
        "phase": phase,
        "room_id": room_id,
        "sensor_device_id": sensor.id if sensor else None,
        "ac_device_id": ac.id if ac else None,
        "value": value,
        "threshold": THRESHOLD,
        "ts": datetime.utcnow().isoformat(),
    })


def _finish(phase):
    """Терминальное состояние (resolved/error): фронт по нему завершает анимацию."""
    with _lock:
        _state["phase"] = phase
        _state["running"] = False
        _state["seq"] += 1


def _run_overheat(actor_user_id: Optional[int],
                  db_factory: Optional[Callable] = None,
                  sleep: Callable[[float], None] = _time.sleep):
    """Тело сценария. db_factory/sleep инъектируются в тестах."""
    _own_session = db_factory is None
    if _own_session:
        import db as _db
        db_factory = _db.SessionLocal
    db = db_factory()
    try:
        sensor, ac = _find_target(db)
        if not sensor or not ac:
            log.warning("Сценарий: нет датчика температуры или кондиционера")
            _finish("error")
            return

        # Фаза 1 — резкий рост температуры
        for v in RISING_VALUES:
            db.add(SensorReading(device_id=sensor.id, reading_type="temperature",
                                 value=v, recorded_at=datetime.utcnow()))
            db.commit()
            _step("rising", sensor, ac, v)
            sleep(RISE_DELAY)

        # Фаза 2 — дом реагирует: включить кондиционер + журнал
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
        _step("rule_fired", sensor, ac, max(RISING_VALUES))
        sleep(COOL_DELAY)

        # Фаза 3 — медленное охлаждение
        for v in COOLING_VALUES:
            db.add(SensorReading(device_id=sensor.id, reading_type="temperature",
                                 value=v, recorded_at=datetime.utcnow()))
            db.commit()
            _step("cooling", sensor, ac, v)
            sleep(COOL_DELAY)

        _step("resolved", sensor, ac, COOLING_VALUES[-1], running=False)
    except Exception:
        log.exception("Сценарий «Перегрев» упал")
        db.rollback()
        _finish("error")
    finally:
        if _own_session:
            db.close()


def start_overheat(actor_user_id: Optional[int], runner: Optional[Callable] = None) -> bool:
    """Запустить сценарий в фоне. False, если уже идёт."""
    with _lock:
        if _state["running"]:
            return False
        _state.update(running=True, scenario="overheat", phase="start",
                      value=None, room_id=None)
        _state["seq"] += 1
    target = runner or _run_overheat
    threading.Thread(target=target, args=(actor_user_id,), daemon=True).start()
    return True
