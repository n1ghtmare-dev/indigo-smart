"""Scenes — batch device operations.

Each scene has a list of (device, state) tuples that get applied atomically.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from db import get_db
from models import Scene, SceneAction, DeviceState, User
from security import require_user_or_admin, get_optional_user
from ws_manager import manager

router = APIRouter(prefix="/scenes", tags=["scenes"])


class ActionIn(BaseModel):
    device_id: int
    state_type: str = "ON/OFF"
    state_value: str


class SceneIn(BaseModel):
    name: str
    icon: Optional[str] = "home"
    actions: List[ActionIn]


@router.get("")
def list_scenes(db: Session = Depends(get_db)):
    scenes = db.query(Scene).order_by(Scene.id).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "icon": s.icon,
            "actions_count": len(s.actions),
            "created_by": s.created_by,
            "actions": [
                {
                    "id": a.id, "device_id": a.device_id,
                    "state_type": a.state_type, "state_value": a.state_value,
                    "order_num": a.order_num,
                }
                for a in s.actions
            ],
        }
        for s in scenes
    ]


@router.post("")
def create_scene(data: SceneIn, db: Session = Depends(get_db), user: User = Depends(require_user_or_admin)):
    scene = Scene(name=data.name, icon=data.icon, created_by=user.id)
    db.add(scene)
    db.flush()
    for i, act in enumerate(data.actions):
        db.add(SceneAction(
            scene_id=scene.id, device_id=act.device_id,
            state_type=act.state_type, state_value=act.state_value,
            order_num=i,
        ))
    db.commit()
    db.refresh(scene)
    return {"id": scene.id, "name": scene.name}


@router.delete("/{scene_id}")
def delete_scene(scene_id: int, db: Session = Depends(get_db),
                  user: User = Depends(require_user_or_admin)):
    scene = db.query(Scene).filter(Scene.id == scene_id).first()
    if not scene:
        raise HTTPException(404, "Scene not found")
    db.delete(scene)
    db.commit()
    return {"ok": True}


@router.post("/{scene_id}/run")
def run_scene(scene_id: int, db: Session = Depends(get_db),
               user: User = Depends(require_user_or_admin)):
    scene = db.query(Scene).filter(Scene.id == scene_id).first()
    if not scene:
        raise HTTPException(404, "Scene not found")
    applied = 0
    for action in scene.actions:
        db.add(DeviceState(
            device_id=action.device_id,
            state_type=action.state_type,
            state_value=action.state_value,
            changed_by=user.id,
        ))
        applied += 1
    db.commit()
    manager.broadcast_sync({
        "type": "scene_executed", "scene_id": scene_id, "actions": applied
    })
    return {"ok": True, "actions_applied": applied}
