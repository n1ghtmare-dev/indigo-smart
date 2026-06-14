"""Запуск демонстрационных сценариев + их состояние."""
from fastapi import APIRouter, Depends, HTTPException

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
