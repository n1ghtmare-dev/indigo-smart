from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from db import get_db
from models import Device, Room, DeviceState, SensorReading, DeviceType, User
from security import require_user_or_admin

router = APIRouter()


class StateUpdate(BaseModel):
    state_type: str
    state_value: str
    changed_by: Optional[int] = None


class DevicePatch(BaseModel):
    name: Optional[str] = None
    room_id: Optional[int] = None
    pos_x: Optional[float] = None
    pos_y: Optional[float] = None
    device_type_id: Optional[int] = None
    power_watts: Optional[int] = None


class RoomIn(BaseModel):
    name: str
    description: Optional[str] = None
    layout_x: Optional[float] = None
    layout_y: Optional[float] = None
    layout_w: Optional[float] = None
    layout_h: Optional[float] = None


class RoomPatch(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    layout_x: Optional[float] = None
    layout_y: Optional[float] = None
    layout_w: Optional[float] = None
    layout_h: Optional[float] = None


def _serialize_device(d: Device, last_state: Optional[DeviceState]):
    return {
        "id": d.id,
        "name": d.name,
        "room": d.room.name,
        "room_id": d.room_id,
        "type": d.device_type.name,
        "device_type_id": d.device_type_id,
        "is_sensor": d.device_type.is_sensor,
        "pos_x": float(d.pos_x) if d.pos_x is not None else 50.0,
        "pos_y": float(d.pos_y) if d.pos_y is not None else 50.0,
        "power_watts": d.power_watts,
        "status": "on" if last_state and last_state.state_value == "1" else "off",
        "created_at": d.created_at,
    }


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
        result.append(_serialize_device(d, last_state))
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
    base = _serialize_device(device, last_state)
    base["states"] = [
        {"id": s.id, "state_type": s.state_type, "state_value": s.state_value,
         "changed_at": s.changed_at, "changed_by": s.changed_by}
        for s in states
    ]
    base["readings"] = [
        {"id": r.id, "type": r.reading_type, "value": r.value, "recorded_at": r.recorded_at}
        for r in readings
    ]
    return base


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
        "changed_at": new_state.changed_at,
    }


@router.patch("/devices/{device_id}")
def patch_device(
    device_id: int,
    data: DevicePatch,
    db: Session = Depends(get_db),
    user: User = Depends(require_user_or_admin),
):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    if data.room_id is not None:
        if not db.query(Room).filter(Room.id == data.room_id).first():
            raise HTTPException(400, "Target room not found")
        device.room_id = data.room_id
    if data.name is not None:
        device.name = data.name
    if data.pos_x is not None:
        device.pos_x = max(0.0, min(100.0, data.pos_x))
    if data.pos_y is not None:
        device.pos_y = max(0.0, min(100.0, data.pos_y))
    if data.device_type_id is not None:
        if not db.query(DeviceType).filter(DeviceType.id == data.device_type_id).first():
            raise HTTPException(400, "Device type not found")
        device.device_type_id = data.device_type_id
    if data.power_watts is not None:
        device.power_watts = data.power_watts
    db.commit()
    db.refresh(device)
    return {"ok": True, "id": device.id}


# ===== Rooms =====

def _serialize_room(r: Room):
    return {
        "id": r.id,
        "name": r.name,
        "description": r.description,
        "layout_x": float(r.layout_x) if r.layout_x is not None else None,
        "layout_y": float(r.layout_y) if r.layout_y is not None else None,
        "layout_w": float(r.layout_w) if r.layout_w is not None else None,
        "layout_h": float(r.layout_h) if r.layout_h is not None else None,
        "device_count": len(r.devices),
        "created_at": r.created_at,
    }


@router.get("/rooms")
def get_rooms(db: Session = Depends(get_db)):
    return [_serialize_room(r) for r in db.query(Room).all()]


@router.post("/rooms")
def create_room(
    data: RoomIn,
    db: Session = Depends(get_db),
    user: User = Depends(require_user_or_admin),
):
    room = Room(
        name=data.name,
        description=data.description,
        layout_x=data.layout_x if data.layout_x is not None else 5.0,
        layout_y=data.layout_y if data.layout_y is not None else 5.0,
        layout_w=data.layout_w if data.layout_w is not None else 30.0,
        layout_h=data.layout_h if data.layout_h is not None else 30.0,
    )
    db.add(room)
    db.commit()
    db.refresh(room)
    return _serialize_room(room)


@router.patch("/rooms/{room_id}")
def patch_room(
    room_id: int,
    data: RoomPatch,
    db: Session = Depends(get_db),
    user: User = Depends(require_user_or_admin),
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(404, "Room not found")
    for field in ("name", "description", "layout_x", "layout_y", "layout_w", "layout_h"):
        val = getattr(data, field)
        if val is not None:
            if field in ("layout_x", "layout_y"):
                val = max(0.0, min(100.0, val))
            if field in ("layout_w", "layout_h"):
                val = max(5.0, min(100.0, val))
            setattr(room, field, val)
    db.commit()
    db.refresh(room)
    return _serialize_room(room)


@router.delete("/rooms/{room_id}")
def delete_room(
    room_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_user_or_admin),
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(404, "Room not found")
    if room.devices:
        raise HTTPException(400, f"В комнате '{room.name}' ещё {len(room.devices)} устройств. Перенесите их или удалите.")
    db.delete(room)
    db.commit()
    return {"ok": True}
