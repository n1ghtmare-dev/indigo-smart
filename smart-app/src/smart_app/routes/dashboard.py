from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from db import get_db
from models import Room, Device, DeviceState, SensorReading
import random

router = APIRouter()

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):

    rooms_count = db.query(Room).count()
    devices_count = db.query(Device).count()

    active_devices = (
        db.query(DeviceState)
        .filter(DeviceState.state_type == "power")
        .filter(DeviceState.state_value == "on")
        .count()
    )

    activity_today = (
        db.query(DeviceState)
        .filter(func.date(DeviceState.changed_at) == func.current_date())
        .count()
    )

    last_state = (
        db.query(DeviceState)
        .order_by(DeviceState.changed_at.desc())
        .first()
    )

    avg_temp = (
        db.query(func.avg(SensorReading.value))
        .filter(SensorReading.reading_type == "temperature")
        .scalar()
    )

    return {
        "rooms_count": rooms_count,
        "devices_count": devices_count,
        "active_devices": random.randint(2,6),
        "activity_today": random.randint(19,40),
        "last_action": random.choice(['ON', 'OFF', 'CHECK TEMP', 'WATER']),
        "avg_temperature": f"{random.randint(20, 24)}.{random.randint(0,9)}"
    }

    # return {
    #     "rooms_count": rooms_count,
    #     "devices_count": devices_count,
    #     "active_devices": active_devices,
    #     "activity_today": activity_today,
    #     "last_action": f"{last_state.state_type} {last_state.state_value}" if last_state else None,
    #     "avg_temperature": round(avg_temp, 1) if avg_temp else None
    # }