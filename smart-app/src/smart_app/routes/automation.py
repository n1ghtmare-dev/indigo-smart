"""Automation rules CRUD + log."""
from datetime import time, datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import desc

from db import get_db
from models import AutomationRule, AutomationLog, DeviceState, SensorReading, User
from security import require_user_or_admin
from ws_manager import manager

router = APIRouter(prefix="/rules", tags=["automation"])


class RuleIn(BaseModel):
    name: str
    enabled: bool = True
    sensor_device_id: Optional[int] = None
    reading_type: Optional[str] = None
    operator: str = Field(..., pattern=r"^(>|<|>=|<=|=|motion)$")
    threshold_value: Optional[float] = None
    time_from: Optional[time] = None
    time_to: Optional[time] = None
    target_device_id: int
    action_state_type: str = "ON/OFF"
    action_state_value: str
    cooldown_seconds: int = 300


@router.get("")
def list_rules(db: Session = Depends(get_db)):
    rules = db.query(AutomationRule).order_by(AutomationRule.id).all()
    return [
        {
            "id": r.id, "name": r.name, "enabled": r.enabled,
            "sensor_device_id": r.sensor_device_id, "reading_type": r.reading_type,
            "operator": r.operator, "threshold_value": r.threshold_value,
            "time_from": r.time_from.isoformat() if r.time_from else None,
            "time_to": r.time_to.isoformat() if r.time_to else None,
            "target_device_id": r.target_device_id,
            "action_state_type": r.action_state_type,
            "action_state_value": r.action_state_value,
            "cooldown_seconds": r.cooldown_seconds,
            "last_triggered_at": r.last_triggered_at,
        }
        for r in rules
    ]


@router.post("")
def create_rule(data: RuleIn, db: Session = Depends(get_db),
                 user: User = Depends(require_user_or_admin)):
    rule = AutomationRule(**data.model_dump(), created_by=user.id)
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return {"id": rule.id}


@router.patch("/{rule_id}")
def toggle_rule(rule_id: int, enabled: bool, db: Session = Depends(get_db),
                 user: User = Depends(require_user_or_admin)):
    rule = db.query(AutomationRule).filter(AutomationRule.id == rule_id).first()
    if not rule:
        raise HTTPException(404, "Rule not found")
    rule.enabled = enabled
    db.commit()
    return {"ok": True}


@router.delete("/{rule_id}")
def delete_rule(rule_id: int, db: Session = Depends(get_db),
                 user: User = Depends(require_user_or_admin)):
    rule = db.query(AutomationRule).filter(AutomationRule.id == rule_id).first()
    if not rule:
        raise HTTPException(404, "Rule not found")
    db.delete(rule)
    db.commit()
    return {"ok": True}


@router.post("/{rule_id}/run")
def run_now(rule_id: int, db: Session = Depends(get_db),
            user: User = Depends(require_user_or_admin)):
    """Force-execute a rule: applies its action immediately, bypassing cooldown.
    Used for demo / manual override."""
    rule = db.query(AutomationRule).filter(AutomationRule.id == rule_id).first()
    if not rule:
        raise HTTPException(404, "Rule not found")

    trigger_value = None
    if rule.sensor_device_id and rule.reading_type:
        latest = (
            db.query(SensorReading)
            .filter(
                SensorReading.device_id == rule.sensor_device_id,
                SensorReading.reading_type == rule.reading_type,
            )
            .order_by(desc(SensorReading.recorded_at))
            .first()
        )
        trigger_value = latest.value if latest else None

    db.add(DeviceState(
        device_id=rule.target_device_id,
        state_type=rule.action_state_type,
        state_value=rule.action_state_value,
        changed_by=user.id,
    ))
    rule.last_triggered_at = datetime.utcnow()
    msg = f"Запуск вручную ({user.email})"
    if trigger_value is not None:
        msg += f" — текущее показание: {trigger_value}"
    db.add(AutomationLog(
        rule_id=rule.id, trigger_value=trigger_value,
        result="success",
        message=msg,
    ))
    db.commit()

    manager.broadcast_sync({
        "type": "rule_triggered",
        "rule_id": rule.id,
        "rule_name": rule.name,
        "device_id": rule.target_device_id,
        "state": rule.action_state_value,
        "manual": True,
    })
    return {"ok": True, "trigger_value": trigger_value}


@router.get("/log")
def get_log(limit: int = 50, db: Session = Depends(get_db)):
    logs = (
        db.query(AutomationLog)
        .order_by(desc(AutomationLog.triggered_at))
        .limit(limit)
        .all()
    )
    return [
        {
            "id": l.id, "rule_id": l.rule_id, "triggered_at": l.triggered_at,
            "trigger_value": l.trigger_value, "result": l.result,
            "message": l.message,
        }
        for l in logs
    ]
