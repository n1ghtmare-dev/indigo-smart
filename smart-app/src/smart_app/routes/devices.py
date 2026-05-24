from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from db import get_db
from models import Device, Room, DeviceState, SensorReading, User
from security import require_user_or_admin

router = APIRouter()


class StateUpdate(BaseModel):
    state_type: str
    state_value: str
    changed_by: Optional[int] = None


@router.get("/devices")
def get_devices(room_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Device)
    if room_id:
        query = query.filter(Device.room_id == room_id)

    devices = query.all()
    result = []
    for d in devices:
        last_state = (
            db.query(DeviceState)
            .filter(DeviceState.device_id == d.id, DeviceState.state_type == "ON/OFF")
            .order_by(DeviceState.changed_at.desc())
            .first()
        )
        result.append({
            "id": d.id,
            "name": d.name,
            "room": d.room.name,
            "room_id": d.room_id,
            "type": d.device_type.name,
            "is_sensor": d.device_type.is_sensor,
            "status": "on" if last_state and last_state.state_value == "1" else "off",
            "created_at": d.created_at
        })
    return result


@router.get("/devices/{device_id}")
def get_device(device_id: int, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    states = (
        db.query(DeviceState)
        .filter(DeviceState.device_id == device_id)
        .order_by(DeviceState.changed_at.desc())
        .limit(20)
        .all()
    )

    readings = (
        db.query(SensorReading)
        .filter(SensorReading.device_id == device_id)
        .order_by(SensorReading.recorded_at.desc())
        .limit(50)
        .all()
    )

    last_state = states[0] if states else None

    return {
        "id": device.id,
        "name": device.name,
        "room": device.room.name,
        "room_id": device.room_id,
        "type": device.device_type.name,
        "is_sensor": device.device_type.is_sensor,
        "status": "on" if last_state and last_state.state_type == "ON/OFF" and last_state.state_value == "1" else "off",
        "created_at": device.created_at,
        "states": [
            {
                "id": s.id,
                "state_type": s.state_type,
                "state_value": s.state_value,
                "changed_at": s.changed_at,
                "changed_by": s.changed_by
            }
            for s in states
        ],
        "readings": [
            {
                "id": r.id,
                "type": r.reading_type,
                "value": r.value,
                "recorded_at": r.recorded_at
            }
            for r in readings
        ]
    }


@router.put("/devices/{device_id}/state")
def update_device_state(
    device_id: int,
    state: StateUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_user_or_admin),
):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    new_state = DeviceState(
        device_id=device_id,
        state_type=state.state_type,
        state_value=state.state_value,
        changed_by=user.id,
    )
    db.add(new_state)
    db.commit()
    db.refresh(new_state)

    return {
        "id": new_state.id,
        "device_id": device_id,
        "state_type": new_state.state_type,
        "state_value": new_state.state_value,
        "changed_at": new_state.changed_at
    }


@router.get("/rooms")
def get_rooms(db: Session = Depends(get_db)):
    rooms = db.query(Room).all()
    return [
        {
            "id": r.id,
            "name": r.name,
            "description": r.description,
            "device_count": len(r.devices),
            "created_at": r.created_at
        }
        for r in rooms
    ]
