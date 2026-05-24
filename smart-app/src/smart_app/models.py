from sqlalchemy import (
    Column, Integer, String, ForeignKey, Float, Boolean, TIMESTAMP, DECIMAL,
    Enum, Time, BigInteger, JSON, SmallInteger
)
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()


class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255))
    layout_x = Column(DECIMAL(5, 2), nullable=True)
    layout_y = Column(DECIMAL(5, 2), nullable=True)
    layout_w = Column(DECIMAL(5, 2), nullable=True)
    layout_h = Column(DECIMAL(5, 2), nullable=True)
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
    power_watts = Column(Integer, default=0, nullable=False)
    pos_x = Column(DECIMAL(5, 2), nullable=True)
    pos_y = Column(DECIMAL(5, 2), nullable=True)
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
    role = Column(Enum("admin", "user", "guest"), default="user", nullable=False)
    last_login = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    states = relationship("DeviceState", back_populates="user")


# === NEW ENTITIES ===

class Scene(Base):
    __tablename__ = "scenes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    icon = Column(String(50), default="home")
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    actions = relationship("SceneAction", back_populates="scene", cascade="all, delete", order_by="SceneAction.order_num")


class SceneAction(Base):
    __tablename__ = "scene_actions"
    id = Column(Integer, primary_key=True, index=True)
    scene_id = Column(Integer, ForeignKey("scenes.id", ondelete="CASCADE"), nullable=False)
    device_id = Column(Integer, ForeignKey("devices.id", ondelete="CASCADE"), nullable=False)
    state_type = Column(String(50), nullable=False)
    state_value = Column(String(50), nullable=False)
    order_num = Column(Integer, default=0, nullable=False)
    scene = relationship("Scene", back_populates="actions")
    device = relationship("Device")


class AutomationRule(Base):
    __tablename__ = "automation_rules"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    enabled = Column(Boolean, default=True, nullable=False)
    sensor_device_id = Column(Integer, ForeignKey("devices.id"), nullable=True)
    reading_type = Column(String(50), nullable=True)
    operator = Column(Enum(">", "<", ">=", "<=", "=", "motion"), nullable=False)
    threshold_value = Column(Float, nullable=True)
    time_from = Column(Time, nullable=True)
    time_to = Column(Time, nullable=True)
    target_device_id = Column(Integer, ForeignKey("devices.id"), nullable=False)
    action_state_type = Column(String(50), nullable=False)
    action_state_value = Column(String(50), nullable=False)
    cooldown_seconds = Column(Integer, default=300, nullable=False)
    last_triggered_at = Column(TIMESTAMP, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)


class AutomationLog(Base):
    __tablename__ = "automation_log"
    id = Column(Integer, primary_key=True, index=True)
    rule_id = Column(Integer, ForeignKey("automation_rules.id", ondelete="CASCADE"), nullable=False)
    triggered_at = Column(TIMESTAMP, default=datetime.utcnow)
    trigger_value = Column(Float, nullable=True)
    result = Column(Enum("success", "skipped_cooldown", "error"), nullable=False)
    message = Column(String(255), nullable=True)


class Schedule(Base):
    __tablename__ = "schedules"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    enabled = Column(Boolean, default=True, nullable=False)
    device_id = Column(Integer, ForeignKey("devices.id", ondelete="CASCADE"), nullable=False)
    state_type = Column(String(50), nullable=False)
    state_value = Column(String(50), nullable=False)
    fire_time = Column(Time, nullable=False)
    days_mask = Column(SmallInteger, default=127, nullable=False)
    last_fired_at = Column(TIMESTAMP, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_log"
    id = Column(BigInteger, primary_key=True, index=True)
    occurred_at = Column(TIMESTAMP, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(50), nullable=False)
    entity_type = Column(String(50), nullable=True)
    entity_id = Column(Integer, nullable=True)
    details = Column(JSON, nullable=True)


class Forecast(Base):
    __tablename__ = "forecasts"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id", ondelete="CASCADE"), nullable=False)
    reading_type = Column(String(50), nullable=False)
    forecast_at = Column(TIMESTAMP, nullable=False)
    predicted_value = Column(Float, nullable=False)
    generated_at = Column(TIMESTAMP, default=datetime.utcnow)
    model_name = Column(String(50), default="simple-trend")


class SimulatorState(Base):
    __tablename__ = "simulator_state"
    id = Column(Integer, primary_key=True, default=1)
    is_running = Column(Boolean, default=False, nullable=False)
    speed_multiplier = Column(Float, default=1.0, nullable=False)
    total_events_generated = Column(BigInteger, default=0, nullable=False)
    started_at = Column(TIMESTAMP, nullable=True)
