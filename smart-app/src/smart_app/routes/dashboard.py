from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct

from db import get_db
from models import Room, Device, DeviceState, SensorReading

router = APIRouter()

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):

    rooms_count = db.query(Room).count()
    devices_count = db.query(Device).count()

    from sqlalchemy import and_
    subq = (
        db.query(
            DeviceState.device_id,
            func.max(DeviceState.id).label("max_id")
        )
        .filter(DeviceState.state_type == "ON/OFF")
        .group_by(DeviceState.device_id)
        .subquery()
    )
    active_devices = (
        db.query(DeviceState)
        .join(subq, and_(
            DeviceState.id == subq.c.max_id
        ))
        .filter(DeviceState.state_value == "1")
        .count()
    )

    activity_today = (
        db.query(DeviceState)
        .filter(func.date(DeviceState.changed_at) == func.current_date())
        .count()
    )

    total_events = db.query(DeviceState).count()

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

    sensor_count = (
        db.query(Device)
        .filter(Device.device_type.has(is_sensor=True))
        .count()
    )

    return {
        "rooms_count": rooms_count,
        "devices_count": devices_count,
        "active_devices": active_devices,
        "activity_today": activity_today,
        "total_events": total_events,
        "last_action": f"{last_state.state_type}: {last_state.state_value}" if last_state else None,
        "avg_temperature": round(avg_temp, 1) if avg_temp else None,
        "sensor_count": sensor_count
    }
