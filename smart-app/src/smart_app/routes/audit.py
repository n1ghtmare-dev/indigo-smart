"""Audit log read endpoint."""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text

from db import get_db

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("")
def list_audit(
    limit: int = Query(100, ge=1, le=500),
    action: Optional[str] = None,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    """Audit log with user join."""
    sql = """
        SELECT a.id, a.occurred_at, a.user_id, COALESCE(u.full_name, '—') AS user_name,
               a.action, a.entity_type, a.entity_id, a.details
        FROM audit_log a
        LEFT JOIN users u ON u.id = a.user_id
        WHERE 1=1
          AND (:action IS NULL OR a.action = :action)
          AND (:uid IS NULL OR a.user_id = :uid)
        ORDER BY a.occurred_at DESC
        LIMIT :limit
    """
    rows = db.execute(text(sql), {
        "limit": limit, "action": action, "uid": user_id
    }).mappings().all()
    return [dict(r) for r in rows]


@router.get("/stats")
def audit_stats(db: Session = Depends(get_db)):
    """Statistics on audit actions — window functions for percent."""
    sql = """
        SELECT
          action,
          COUNT(*) AS cnt,
          ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS pct
        FROM audit_log
        GROUP BY action
        ORDER BY cnt DESC
    """
    rows = db.execute(text(sql)).mappings().all()
    return [dict(r) for r in rows]
