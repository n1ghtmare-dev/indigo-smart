"""ML forecast for sensor readings.

Simple linear trend + seasonality (day-of-hour average) instead of pulling Prophet.
Demonstrates: training a model from DB data, caching predictions in DB, statistical metrics.
"""
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from db import get_db
from models import Forecast, Device, SensorReading

router = APIRouter(prefix="/forecast", tags=["forecast"])


def _simple_forecast(values: list[tuple[datetime, float]], horizon_hours: int = 24):
    """Simple linear regression + hourly seasonality."""
    if len(values) < 24:
        return [], None

    # Linear trend via least squares
    n = len(values)
    t0 = values[0][0]
    xs = [(v[0] - t0).total_seconds() / 3600 for v in values]  # hours
    ys = [v[1] for v in values]
    mean_x = sum(xs) / n
    mean_y = sum(ys) / n
    num = sum((xs[i] - mean_x) * (ys[i] - mean_y) for i in range(n))
    den = sum((xs[i] - mean_x) ** 2 for i in range(n))
    slope = num / den if den > 0 else 0
    intercept = mean_y - slope * mean_x

    # Hourly seasonality: average residual per hour
    hour_resid = {h: [] for h in range(24)}
    for i, (t, v) in enumerate(values):
        pred = intercept + slope * xs[i]
        hour_resid[t.hour].append(v - pred)
    hour_offset = {h: (sum(r) / len(r) if r else 0) for h, r in hour_resid.items()}

    # MAE on training set
    mae = sum(abs(ys[i] - (intercept + slope * xs[i] + hour_offset[values[i][0].hour]))
              for i in range(n)) / n

    # Generate forecast
    last_t = values[-1][0]
    last_x = xs[-1]
    out = []
    for h in range(1, horizon_hours + 1):
        future_t = last_t + timedelta(hours=h)
        x = last_x + h
        pred = intercept + slope * x + hour_offset[future_t.hour]
        out.append((future_t, round(pred, 2)))
    return out, round(mae, 3)


@router.post("/generate/{device_id}")
def generate(device_id: int, reading_type: str = "temperature",
              horizon_hours: int = 24, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(404, "Device not found")

    # Get last 7 days of readings
    cutoff = datetime.utcnow() - timedelta(days=7)
    rows = (
        db.query(SensorReading)
        .filter(
            SensorReading.device_id == device_id,
            SensorReading.reading_type == reading_type,
            SensorReading.recorded_at >= cutoff,
        )
        .order_by(SensorReading.recorded_at)
        .all()
    )
    values = [(r.recorded_at, r.value) for r in rows]
    if len(values) < 24:
        raise HTTPException(400, f"Need at least 24 readings, got {len(values)}")

    forecast, mae = _simple_forecast(values, horizon_hours)

    # Replace cached forecasts for this device+type
    db.query(Forecast).filter(
        Forecast.device_id == device_id,
        Forecast.reading_type == reading_type,
    ).delete()
    for t, v in forecast:
        db.add(Forecast(
            device_id=device_id, reading_type=reading_type,
            forecast_at=t, predicted_value=v,
            model_name="linear+hourly-seasonality",
        ))
    db.commit()
    return {
        "device_id": device_id,
        "reading_type": reading_type,
        "horizon_hours": horizon_hours,
        "points": len(forecast),
        "mae": mae,
        "training_samples": len(values),
    }


@router.get("/{device_id}")
def get_forecast(device_id: int, reading_type: str = "temperature",
                  db: Session = Depends(get_db)):
    rows = (
        db.query(Forecast)
        .filter(Forecast.device_id == device_id,
                Forecast.reading_type == reading_type)
        .order_by(Forecast.forecast_at)
        .all()
    )
    return [
        {"time": r.forecast_at, "value": r.predicted_value, "model": r.model_name}
        for r in rows
    ]
