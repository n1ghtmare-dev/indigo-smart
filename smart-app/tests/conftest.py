"""Pytest fixtures with isolated in-memory SQLite database."""
import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src", "smart_app"))

import db as db_module  # noqa: E402
from models import Base, User, Room, DeviceType, Device  # noqa: E402
from security import hash_password  # noqa: E402

TEST_DB_URL = "sqlite:///:memory:"


@pytest.fixture(scope="function")
def engine():
    eng = create_engine(
        TEST_DB_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=eng)
    return eng


@pytest.fixture(scope="function")
def db_session(engine):
    Session = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    return Session()


@pytest.fixture(scope="function")
def client(engine, monkeypatch):
    # Patch the engine used by the app
    Session = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    monkeypatch.setattr(db_module, "engine", engine)
    monkeypatch.setattr(db_module, "SessionLocal", Session)
    # Avoid starting simulator/automation in tests
    monkeypatch.setenv("SIMULATOR_AUTOSTART", "false")
    import importlib
    import main as main_mod
    importlib.reload(main_mod)
    return TestClient(main_mod.app)


@pytest.fixture
def admin_user(db_session):
    u = User(
        full_name="Admin",
        email="admin@test.com",
        password_hash=hash_password("test123"),
        role="admin",
    )
    db_session.add(u)
    db_session.commit()
    db_session.refresh(u)
    return u


@pytest.fixture
def sample_room(db_session):
    r = Room(name="Гостиная", description="test room")
    db_session.add(r)
    db_session.commit()
    return r


@pytest.fixture
def sample_device(db_session, sample_room):
    dt = DeviceType(name="Лампа", is_sensor=False)
    db_session.add(dt)
    db_session.commit()
    d = Device(name="Лампа 1", room_id=sample_room.id, device_type_id=dt.id, power_watts=12)
    db_session.add(d)
    db_session.commit()
    return d
