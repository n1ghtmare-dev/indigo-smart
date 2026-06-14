"""Запуск демонстрационных сценариев + их состояние."""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException

from models import User
from security import get_optional_user
import scenario_engine

router = APIRouter(prefix="/scenario", tags=["scenario"])


@router.get("/state")
def scenario_state():
    return scenario_engine.get_state()


@router.post("/overheat/start")
def start_overheat(user: Optional[User] = Depends(get_optional_user)):
    # Демо-сценарий можно запускать без входа — чтобы стартовать прямо с телефона
    # комиссии. Пишет только демо-данные. actor_user_id берём, если вошли.
    started = scenario_engine.start_overheat(user.id if user else None)
    if not started:
        raise HTTPException(409, "Сценарий уже выполняется")
    return {"ok": True, "scenario": "overheat"}
