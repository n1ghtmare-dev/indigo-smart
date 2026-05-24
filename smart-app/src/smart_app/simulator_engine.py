"""IoT device simulator — generates realistic sensor readings and state changes in the background.

Replaces the need for real hardware. Demonstrates a complete IoT pipeline:
sensor → DB → analytics → UI, all live.
"""
import logging
import math
import random
import threading
from datetime import datetime
from typing import Optional

from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from db import SessionLocal
from models import Device, SensorReading, DeviceState, SimulatorState
from ws_manager import manager

log = logging.getLogger("simulator")

_scheduler: Optional[BackgroundScheduler] = None


def _hour_factor():
    """Realistic factor for hour-of-day (sin wave with min at 04:00, max at 16:00)."""
    h = datetime.now().hour + datetime.now().minute / 60
    return math.sin((h - 4) / 24 * 2 * math.pi)


def _generate_for_room(room_id: int, devices: list[Device], db: Session):
    """Generate a tick of data for one room's devices."""
    now = datetime.utcnow()
    events_added = 0

    for d in devices:
        type_name = d.device_type.name

        # Sensors → write a reading
        if type_name == "Датчик температуры":
            base = 22.0 + (3.0 if d.room.name == "Кухня" else 0)
            val = base + 2.5 * _hour_factor() + random.gauss(0, 0.4)
            db.add(SensorReading(device_id=d.id, reading_type="temperature",
                                  value=round(val, 1), recorded_at=now))
            events_added += 1

        elif type_name == "Датчик влажности":
            val = 45 + 10 * (-_hour_factor()) + random.gauss(0, 2)
            db.add(SensorReading(device_id=d.id, reading_type="humidity",
                                  value=round(max(20, min(80, val)), 1), recorded_at=now))
            events_added += 1

        elif type_name == "Датчик движения":
            # Probability of motion depends on hour
            prob = 0.05 + 0.25 * max(0, _hour_factor())
            detected = 1 if random.random() < prob else 0
            db.add(SensorReading(device_id=d.id, reading_type="motion",
                                  value=float(detected), recorded_at=now))
            events_added += 1

        # Actuators → occasional state changes
        elif type_name in ("Лампа", "Розетка", "Умная розетка", "Кондиционер"):
            # ~5% chance to toggle per tick
            if random.random() < 0.05:
                # Get current state
                last = (
                    db.query(DeviceState)
                    .filter(DeviceState.device_id == d.id, DeviceState.state_type == "ON/OFF")
                    .order_by(DeviceState.changed_at.desc())
                    .first()
                )
                current = last.state_value if last else "0"
                new_val = "1" if current == "0" else "0"
                db.add(DeviceState(device_id=d.id, state_type="ON/OFF",
                                    state_value=new_val, changed_at=now))
                events_added += 1

    return events_added


def _tick():
    """One scheduler tick."""
    db = SessionLocal()
    try:
        state = db.query(SimulatorState).first()
        if not state or not state.is_running:
            return

        devices = db.query(Device).all()
        # Group by room
        rooms_map: dict[int, list[Device]] = {}
        for d in devices:
            rooms_map.setdefault(d.room_id, []).append(d)

        total = 0
        for room_id, room_devices in rooms_map.items():
            total += _generate_for_room(room_id, room_devices, db)

        state.total_events_generated += total
        db.commit()

        log.info(f"Simulator tick: {total} events generated")
        manager.broadcast_sync({
            "type": "simulator_tick",
            "events": total,
            "total": state.total_events_generated,
            "ts": datetime.utcnow().isoformat(),
        })
    except Exception as e:
        log.exception(f"Simulator tick failed: {e}")
        db.rollback()
    finally:
        db.close()


def start_simulator():
    global _scheduler
    if _scheduler:
        return
    _scheduler = BackgroundScheduler(daemon=True)
    _scheduler.add_job(_tick, "interval", seconds=30, id="simulator_tick")
    _scheduler.start()
    log.info("Simulator scheduler started (interval=30s)")

    # Auto-enable
    db = SessionLocal()
    try:
        state = db.query(SimulatorState).first()
        if state and not state.is_running:
            state.is_running = True
            state.started_at = datetime.utcnow()
            db.commit()
    finally:
        db.close()


def stop_simulator():
    global _scheduler
    if _scheduler:
        _scheduler.shutdown(wait=False)
        _scheduler = None
        log.info("Simulator scheduler stopped")
