from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from typing import Optional

from db import get_db
from models import Device, DeviceState, SensorReading

router = APIRouter(prefix="/analytics")


@router.get("/temperature")
def get_temperature_history(
    limit: int = 100,
    device_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = (
        db.query(SensorReading)
        .filter(SensorReading.reading_type == "temperature")
    )
    if device_id:
        query = query.filter(SensorReading.device_id == device_id)

    readings = (
        query
        .order_by(SensorReading.recorded_at.asc())
        .limit(limit)
        .all()
    )

    return [
        {
            "value": r.value,
            "time": r.recorded_at,
            "device_id": r.device_id
        }
        for r in readings
    ]


@router.get("/temperature/daily")
def get_temperature_daily(db: Session = Depends(get_db)):
    results = (
        db.query(
            func.date(SensorReading.recorded_at).label("date"),
            func.avg(SensorReading.value).label("avg_temp"),
            func.min(SensorReading.value).label("min_temp"),
            func.max(SensorReading.value).label("max_temp"),
            func.count(SensorReading.id).label("count")
        )
        .filter(SensorReading.reading_type == "temperature")
        .group_by(func.date(SensorReading.recorded_at))
        .order_by(func.date(SensorReading.recorded_at))
        .all()
    )

    return [
        {
            "date": str(r.date),
            "avg": round(float(r.avg_temp), 1),
            "min": round(float(r.min_temp), 1),
            "max": round(float(r.max_temp), 1),
            "count": r.count
        }
        for r in results
    ]


@router.get("/motion")
def get_motion_events(db: Session = Depends(get_db)):
    results = (
        db.query(
            func.date(SensorReading.recorded_at).label("date"),
            func.sum(SensorReading.value).label("detections"),
            func.count(SensorReading.id).label("total")
        )
        .filter(SensorReading.reading_type == "motion")
        .group_by(func.date(SensorReading.recorded_at))
        .order_by(func.date(SensorReading.recorded_at))
        .all()
    )

    return [
        {
            "date": str(r.date),
            "detections": int(r.detections) if r.detections else 0,
            "total": r.total
        }
        for r in results
    ]


@router.get("/activity")
def get_device_activity(db: Session = Depends(get_db)):
    results = (
        db.query(
            func.date(DeviceState.changed_at).label("date"),
            func.count(DeviceState.id).label("events")
        )
        .group_by(func.date(DeviceState.changed_at))
        .order_by(func.date(DeviceState.changed_at))
        .all()
    )

    return [
        {
            "date": str(r.date),
            "events": r.events
        }
        for r in results
    ]


@router.get("/activity/hourly")
def get_hourly_activity(db: Session = Depends(get_db)):
    results = (
        db.query(
            func.hour(DeviceState.changed_at).label("hour"),
            func.count(DeviceState.id).label("events")
        )
        .group_by(func.hour(DeviceState.changed_at))
        .order_by(func.hour(DeviceState.changed_at))
        .all()
    )

    hourly = {r.hour: r.events for r in results}
    return [{"hour": h, "events": hourly.get(h, 0)} for h in range(24)]


@router.get("/summary")
def get_analytics_summary(db: Session = Depends(get_db)):
    total_readings = db.query(SensorReading).count()
    total_events = db.query(DeviceState).count()

    today_events = (
        db.query(DeviceState)
        .filter(func.date(DeviceState.changed_at) == func.current_date())
        .count()
    )

    avg_temp = (
        db.query(func.avg(SensorReading.value))
        .filter(SensorReading.reading_type == "temperature")
        .scalar()
    )

    motion_today = (
        db.query(func.sum(SensorReading.value))
        .filter(
            SensorReading.reading_type == "motion",
            func.date(SensorReading.recorded_at) == func.current_date()
        )
        .scalar()
    )

    return {
        "total_readings": total_readings,
        "total_events": total_events,
        "today_events": today_events,
        "avg_temperature": round(float(avg_temp), 1) if avg_temp else None,
        "motion_today": int(motion_today) if motion_today else 0
    }


@router.get("/device-types")
def get_device_type_distribution(db: Session = Depends(get_db)):
    from models import DeviceType
    results = (
        db.query(
            DeviceType.name,
            func.count(Device.id).label("count")
        )
        .join(Device, Device.device_type_id == DeviceType.id)
        .group_by(DeviceType.name)
        .all()
    )

    return [{"type": r.name, "count": r.count} for r in results]
