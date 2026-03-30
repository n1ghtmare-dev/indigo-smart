from sqlalchemy import (
    Column, Integer, String, ForeignKey, Float, Boolean, TIMESTAMP
)
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    devices = relationship("Device", back_populates="room")


class DeviceType(Base):
    __tablename__ = "device_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    is_sensor = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    devices = relationship("Device", back_populates="device_type")


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)

    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    device_type_id = Column(Integer, ForeignKey("device_types.id"), nullable=False)

    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    room = relationship("Room", back_populates="devices")
    device_type = relationship("DeviceType", back_populates="devices")

    states = relationship("DeviceState", back_populates="device", cascade="all, delete")
    readings = relationship("SensorReading", back_populates="device", cascade="all, delete")


class DeviceState(Base):
    __tablename__ = "device_states"

    id = Column(Integer, primary_key=True, index=True)

    device_id = Column(Integer, ForeignKey("devices.id"), nullable=False)
    state_type = Column(String(50), nullable=False)
    state_value = Column(String(50), nullable=False)

    changed_at = Column(TIMESTAMP, default=datetime.utcnow)

    changed_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    device = relationship("Device", back_populates="states")
    user = relationship("User", back_populates="states")

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)

    device_id = Column(Integer, ForeignKey("devices.id"), nullable=False)
    reading_type = Column(String(50), nullable=False)
    value = Column(Float, nullable=False)

    recorded_at = Column(TIMESTAMP, default=datetime.utcnow)

    device = relationship("Device", back_populates="readings")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    states = relationship("DeviceState", back_populates="user")

