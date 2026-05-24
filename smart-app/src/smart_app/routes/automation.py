"""Automation rules CRUD + log."""
from datetime import time
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import desc

from db import get_db
from models import AutomationRule, AutomationLog, User
from security import require_user_or_admin

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
