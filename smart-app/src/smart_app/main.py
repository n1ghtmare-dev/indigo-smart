from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from db import engine, Base, get_db
from models import Device, Room, DeviceType, DeviceState, SensorReading, User
from fastapi.middleware.cors import CORSMiddleware
from routes.dashboard import router as dashboard_router
from routes.sensors import router as sensors_router


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Home API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)
app.include_router(sensors_router)



@app.get("/")
def read_root():
    return {"message": "Smart Home API"}


# All devices
@app.get("/devices")
def get_devices(db: Session = Depends(get_db)):
    devices = db.query(Device).all()
    return [
        {
            "id": d.id,
            "name": d.name,
            "room": d.room.name,
            "type": d.device_type.name,
            "created_at": d.created_at
        }
        for d in devices
    ]

