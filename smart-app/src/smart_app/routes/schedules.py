"""Schedules CRUD."""
from datetime import time
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from db import get_db
from models import Schedule, User
from security import get_optional_user

router = APIRouter(prefix="/schedules", tags=["schedules"])


class ScheduleIn(BaseModel):
    name: str
    enabled: bool = True
    device_id: int
    state_type: str = "ON/OFF"
    state_value: str
    fire_time: time
    days_mask: int = Field(127, ge=1, le=127)


@router.get("")
def list_schedules(db: Session = Depends(get_db)):
    schedules = db.query(Schedule).order_by(Schedule.fire_time).all()
    return [
        {
            "id": s.id, "name": s.name, "enabled": s.enabled,
            "device_id": s.device_id, "state_type": s.state_type,
            "state_value": s.state_value,
            "fire_time": s.fire_time.isoformat(),
            "days_mask": s.days_mask,
            "last_fired_at": s.last_fired_at,
        }
        for s in schedules
    ]


@router.post("")
def create_schedule(data: ScheduleIn, db: Session = Depends(get_db),
                     user: Optional[User] = Depends(get_optional_user)):
    s = Schedule(**data.model_dump(), created_by=user.id if user else None)
    db.add(s)
    db.commit()
    db.refresh(s)
    return {"id": s.id}


@router.delete("/{schedule_id}")
def delete_schedule(schedule_id: int, db: Session = Depends(get_db),
                     user: Optional[User] = Depends(get_optional_user)):
    s = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not s:
        raise HTTPException(404, "Schedule not found")
    db.delete(s)
    db.commit()
    return {"ok": True}
