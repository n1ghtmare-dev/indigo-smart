"""Energy / uptime analytics.

Heavy use of MySQL features:
- VIEWs (v_daily_uptime, v_energy_leaders)
- Stored procedure (calc_energy_for_period)
- Window functions (LEAD/LAG) inside v_device_on_intervals
- CTE for time-range filtering
- Aggregation with GROUP BY DATE(...)
"""
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text

from db import get_db

router = APIRouter(prefix="/energy", tags=["energy"])


@router.get("/daily")
def daily_uptime(
    device_id: Optional[int] = None,
    days: int = Query(14, ge=1, le=365),
    db: Session = Depends(get_db),
):
    """Daily uptime and kWh — uses VIEW v_daily_uptime backed by LEAD() window function."""
    sql = """
        SELECT device_id, device_name, power_watts, day, on_hours, kwh
        FROM v_daily_uptime
        WHERE day >= CURRENT_DATE - INTERVAL :days DAY
          AND (:dev IS NULL OR device_id = :dev)
        ORDER BY day, device_id
    """
    rows = db.execute(text(sql), {"days": days, "dev": device_id}).mappings().all()
    return [dict(r) for r in rows]


@router.get("/by-device")
def by_device(db: Session = Depends(get_db)):
    """Total uptime per device — from v_energy_leaders."""
    sql = """
        SELECT device_id, device_name, total_hours, total_kwh, days_with_activity
        FROM v_energy_leaders
        ORDER BY total_kwh DESC
    """
    rows = db.execute(text(sql)).mappings().all()
    return [dict(r) for r in rows]


@router.get("/period")
def for_period(
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    device_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    """Energy in a precise time window via stored procedure."""
    to_dt = to_date or datetime.utcnow()
    from_dt = from_date or (to_dt - timedelta(days=7))
    rows = db.execute(
        text("CALL calc_energy_for_period(:dev, :from_dt, :to_dt)"),
        {"dev": device_id, "from_dt": from_dt, "to_dt": to_dt},
    ).mappings().all()
    return {
        "from": from_dt,
        "to": to_dt,
        "results": [dict(r) for r in rows],
    }


@router.get("/summary")
def summary(db: Session = Depends(get_db)):
    """High-level aggregate using window functions for moving comparison."""
    sql = """
        WITH last_30 AS (
          SELECT SUM(kwh) AS kwh, SUM(on_hours) AS hours
          FROM v_daily_uptime
          WHERE day >= CURRENT_DATE - INTERVAL 30 DAY
        ),
        prev_30 AS (
          SELECT SUM(kwh) AS kwh, SUM(on_hours) AS hours
          FROM v_daily_uptime
          WHERE day >= CURRENT_DATE - INTERVAL 60 DAY
            AND day <  CURRENT_DATE - INTERVAL 30 DAY
        )
        SELECT
          COALESCE(l.kwh, 0)   AS kwh_30,
          COALESCE(l.hours, 0) AS hours_30,
          COALESCE(p.kwh, 0)   AS kwh_prev,
          COALESCE(p.hours, 0) AS hours_prev,
          CASE WHEN p.kwh > 0 THEN ROUND((l.kwh - p.kwh) / p.kwh * 100, 1) ELSE 0 END AS delta_pct
        FROM last_30 l, prev_30 p
    """
    row = db.execute(text(sql)).mappings().first()
    return dict(row) if row else {}
