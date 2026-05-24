"""Simulator control endpoints."""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db import get_db
from models import SimulatorState, User
from security import require_user_or_admin

router = APIRouter(prefix="/simulator", tags=["simulator"])


@router.get("/state")
def get_state(db: Session = Depends(get_db)):
    state = db.query(SimulatorState).first()
    return {
        "is_running": state.is_running if state else False,
        "speed_multiplier": state.speed_multiplier if state else 1.0,
        "total_events_generated": state.total_events_generated if state else 0,
        "started_at": state.started_at if state else None,
    }


@router.post("/start")
def start(db: Session = Depends(get_db), user: User = Depends(require_user_or_admin)):
    state = db.query(SimulatorState).first()
    if state:
        state.is_running = True
        state.started_at = datetime.utcnow()
        db.commit()
    return {"ok": True}


@router.post("/stop")
def stop(db: Session = Depends(get_db), user: User = Depends(require_user_or_admin)):
    state = db.query(SimulatorState).first()
    if state:
        state.is_running = False
        db.commit()
    return {"ok": True}
