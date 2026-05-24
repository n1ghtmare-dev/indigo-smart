import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from models import Base
from db import engine
from config import settings

from routes.dashboard import router as dashboard_router
from routes.sensors import router as sensors_router
from routes.devices import router as devices_router
from routes.analytics import router as analytics_router
from routes.auth import router as auth_router
from routes.scenes import router as scenes_router
from routes.automation import router as automation_router
from routes.schedules import router as schedules_router
from routes.energy import router as energy_router
from routes.forecast import router as forecast_router
from routes.audit import router as audit_router
from routes.simulator import router as simulator_router
from routes.export import router as export_router
from routes.websocket import router as ws_router

from simulator_engine import start_simulator, stop_simulator
from automation_engine import start_automation, stop_automation


Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.SIMULATOR_AUTOSTART:
        start_simulator()
    start_automation()
    yield
    stop_automation()
    stop_simulator()


app = FastAPI(
    title="IndigoSmart API",
    description="Smart Home IoT Analytics Platform · полная версия с auth, simulator, automation, ML",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_origin_regex=r"^https://.+\.devtunnels\.ms$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api"
app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(dashboard_router, prefix=API_PREFIX)
app.include_router(sensors_router, prefix=API_PREFIX)
app.include_router(devices_router, prefix=API_PREFIX)
app.include_router(analytics_router, prefix=API_PREFIX)
app.include_router(scenes_router, prefix=API_PREFIX)
app.include_router(automation_router, prefix=API_PREFIX)
app.include_router(schedules_router, prefix=API_PREFIX)
app.include_router(energy_router, prefix=API_PREFIX)
app.include_router(forecast_router, prefix=API_PREFIX)
app.include_router(audit_router, prefix=API_PREFIX)
app.include_router(simulator_router, prefix=API_PREFIX)
app.include_router(export_router, prefix=API_PREFIX)
app.include_router(ws_router, prefix=API_PREFIX)


@app.get("/api")
def api_root():
    return {"message": "IndigoSmart API", "version": "2.0.0"}


FRONTEND_DIR = Path(os.getenv("FRONTEND_DIR", "/var/www/indigosmart/data/www/indigosmart.ru"))


if FRONTEND_DIR.is_dir() and (FRONTEND_DIR / "index.html").is_file():
    static_subdir = FRONTEND_DIR / "static"
    if static_subdir.is_dir():
        app.mount("/static", StaticFiles(directory=static_subdir), name="static")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def spa_fallback(full_path: str):
        candidate = FRONTEND_DIR / full_path
        if full_path and candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(FRONTEND_DIR / "index.html")
