"""Data export — CSV download for sensor readings or device events."""
import csv
import io
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import text

from db import get_db

router = APIRouter(prefix="/export", tags=["export"])


def _stream_csv(rows, headers):
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(headers)
    yield buf.getvalue()
    buf.seek(0); buf.truncate(0)
    for r in rows:
        writer.writerow(r)
        yield buf.getvalue()
        buf.seek(0); buf.truncate(0)


@router.get("/readings.csv")
def export_readings(
    days: int = Query(7, ge=1, le=365),
    reading_type: Optional[str] = None,
    db: Session = Depends(get_db),
):
    sql = """
        SELECT sr.id, d.name AS device, r.name AS room, sr.reading_type,
               sr.value, sr.recorded_at
        FROM sensor_readings sr
        JOIN devices d ON d.id = sr.device_id
        JOIN rooms r ON r.id = d.room_id
        WHERE sr.recorded_at >= NOW() - INTERVAL :days DAY
          AND (:rt IS NULL OR sr.reading_type = :rt)
        ORDER BY sr.recorded_at DESC
    """
    rs = db.execute(text(sql), {"days": days, "rt": reading_type}).fetchall()
    headers = ["id", "device", "room", "reading_type", "value", "recorded_at"]
    rows = [tuple(r) for r in rs]
    filename = f"readings_{datetime.now():%Y%m%d_%H%M}.csv"
    return StreamingResponse(
        _stream_csv(rows, headers),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/events.csv")
def export_events(
    days: int = Query(7, ge=1, le=365),
    db: Session = Depends(get_db),
):
    sql = """
        SELECT ds.id, d.name AS device, r.name AS room, ds.state_type,
               ds.state_value, ds.changed_at, COALESCE(u.full_name, '') AS changed_by
        FROM device_states ds
        JOIN devices d ON d.id = ds.device_id
        JOIN rooms r ON r.id = d.room_id
        LEFT JOIN users u ON u.id = ds.changed_by
        WHERE ds.changed_at >= NOW() - INTERVAL :days DAY
        ORDER BY ds.changed_at DESC
    """
    rs = db.execute(text(sql), {"days": days}).fetchall()
    headers = ["id", "device", "room", "state_type", "state_value", "changed_at", "changed_by"]
    rows = [tuple(r) for r in rs]
    filename = f"events_{datetime.now():%Y%m%d_%H%M}.csv"
    return StreamingResponse(
        _stream_csv(rows, headers),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
