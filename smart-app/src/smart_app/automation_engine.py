"""Automation rules engine + schedule worker.

Demonstrates: scheduled jobs, conditional logic on sensor readings, cooldown handling,
audit log via SQL trigger, broadcasting state changes through WebSocket.
"""
import logging
from datetime import datetime, time, timedelta
from typing import Optional

from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from sqlalchemy import desc

from db import SessionLocal
from models import (
    AutomationRule, AutomationLog, DeviceState, SensorReading,
    Schedule, Device
)
from ws_manager import manager

log = logging.getLogger("automation")
_scheduler: Optional[BackgroundScheduler] = None


def _in_time_range(t_from: Optional[time], t_to: Optional[time]) -> bool:
    if not t_from or not t_to:
        return True
    now = datetime.now().time()
    if t_from <= t_to:
        return t_from <= now <= t_to
    return now >= t_from or now <= t_to


def _check_rules():
    """Evaluate all enabled automation rules."""
    db = SessionLocal()
    try:
        rules = db.query(AutomationRule).filter(AutomationRule.enabled == True).all()
        for rule in rules:
            # Cooldown check
            if rule.last_triggered_at:
                elapsed = (datetime.utcnow() - rule.last_triggered_at).total_seconds()
                if elapsed < rule.cooldown_seconds:
                    continue

            # Time-of-day check
            if not _in_time_range(rule.time_from, rule.time_to):
                continue

            # Get latest sensor reading
            if not rule.sensor_device_id or not rule.reading_type:
                continue
            latest = (
                db.query(SensorReading)
                .filter(
                    SensorReading.device_id == rule.sensor_device_id,
                    SensorReading.reading_type == rule.reading_type,
                )
                .order_by(desc(SensorReading.recorded_at))
                .first()
            )
            if not latest:
                continue

            triggered = False
            op = rule.operator
            val = latest.value
            thr = rule.threshold_value
            if op == ">" and thr is not None: triggered = val > thr
            elif op == "<" and thr is not None: triggered = val < thr
            elif op == ">=" and thr is not None: triggered = val >= thr
            elif op == "<=" and thr is not None: triggered = val <= thr
            elif op == "=" and thr is not None: triggered = abs(val - thr) < 0.01
            elif op == "motion": triggered = val >= 1.0

            if triggered:
                # Apply action
                new_state = DeviceState(
                    device_id=rule.target_device_id,
                    state_type=rule.action_state_type,
                    state_value=rule.action_state_value,
                    changed_by=rule.created_by,
                )
                db.add(new_state)
                rule.last_triggered_at = datetime.utcnow()
                sensor = db.query(Device).filter(Device.id == rule.sensor_device_id).first()
                sensor_name = sensor.name if sensor else f"датчик #{rule.sensor_device_id}"
                reading_ru = {
                    "temperature": "температура",
                    "humidity": "влажность",
                    "motion": "движение",
                }.get(rule.reading_type, rule.reading_type)
                db.add(AutomationLog(
                    rule_id=rule.id, trigger_value=val,
                    result="success",
                    message=f"{sensor_name}: {reading_ru} {val} {op} {thr}",
                ))
                db.commit()
                log.info(f"Rule '{rule.name}' triggered: {val} {op} {thr}")
                manager.broadcast_sync({
                    "type": "rule_triggered",
                    "rule_id": rule.id,
                    "rule_name": rule.name,
                    "device_id": rule.target_device_id,
                    "state": rule.action_state_value,
                })
    except Exception as e:
        log.exception(f"Automation check failed: {e}")
        db.rollback()
    finally:
        db.close()


def _check_schedules():
    """Fire schedules whose time has come and the day matches."""
    db = SessionLocal()
    try:
        now = datetime.now()
        weekday_bit = 1 << now.weekday()  # mon=0..sun=6
        cur_time = now.time().replace(microsecond=0, second=0)
        # Check schedules that haven't fired in the last 90 seconds at this fire_time
        candidates = (
            db.query(Schedule)
            .filter(Schedule.enabled == True)
            .all()
        )
        for sch in candidates:
            if not (sch.days_mask & weekday_bit):
                continue
            # Within +/- 60s window of fire_time
            fire_dt = datetime.combine(now.date(), sch.fire_time)
            delta = abs((now - fire_dt).total_seconds())
            if delta > 60:
                continue
            if sch.last_fired_at and (now - sch.last_fired_at).total_seconds() < 120:
                continue
            db.add(DeviceState(
                device_id=sch.device_id,
                state_type=sch.state_type,
                state_value=sch.state_value,
                changed_by=sch.created_by,
            ))
            sch.last_fired_at = now
            db.commit()
            log.info(f"Schedule '{sch.name}' fired")
            manager.broadcast_sync({
                "type": "schedule_fired",
                "schedule_id": sch.id,
                "device_id": sch.device_id,
            })
    except Exception as e:
        log.exception(f"Schedule check failed: {e}")
        db.rollback()
    finally:
        db.close()


def start_automation():
    global _scheduler
    if _scheduler:
        return
    _scheduler = BackgroundScheduler(daemon=True)
    _scheduler.add_job(_check_rules, "interval", seconds=20, id="automation_rules")
    _scheduler.add_job(_check_schedules, "interval", seconds=30, id="schedules")
    _scheduler.start()
    log.info("Automation engine started")


def stop_automation():
    global _scheduler
    if _scheduler:
        _scheduler.shutdown(wait=False)
        _scheduler = None
        log.info("Automation engine stopped")
