from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db import get_db
from models import SensorReading, Device

router = APIRouter()

@router.get("/sensor-readings")
def get_sensor_readings(db: Session = Depends(get_db)):

    readings = (
        db.query(SensorReading)
        .order_by(SensorReading.recorded_at.desc())
        .limit(50)
        .all()
    )

    return [
        {
            "id": r.id,
            "device_id": r.device_id,
            "type": r.reading_type,
            "value": r.value,
            "time": r.recorded_at
        }
        for r in readings
    ]