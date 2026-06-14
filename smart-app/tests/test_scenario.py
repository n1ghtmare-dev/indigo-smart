"""Тесты сценарного оркестратора (каскад «перегрев»)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src", "smart_app"))

from models import Room, DeviceType, Device, SensorReading, DeviceState, AutomationRule, AutomationLog


def _setup_home(db):
    """Комната с датчиком температуры и кондиционером + правило на кондиционер."""
    room = Room(name="Гостиная", description="t")
    db.add(room); db.commit()
    dt_sensor = DeviceType(name="Датчик температуры", is_sensor=True)
    dt_ac = DeviceType(name="Кондиционер", is_sensor=False)
    db.add_all([dt_sensor, dt_ac]); db.commit()
    sensor = Device(name="Темп. Гостиная", room_id=room.id, device_type_id=dt_sensor.id)
    ac = Device(name="Кондиционер Гостиная", room_id=room.id, device_type_id=dt_ac.id)
    db.add_all([sensor, ac]); db.commit()
    rule = AutomationRule(
        name="Охлаждение при жаре", enabled=True,
        sensor_device_id=sensor.id, reading_type="temperature",
        operator=">", threshold_value=30.0,
        target_device_id=ac.id, action_state_type="ON/OFF", action_state_value="1",
        cooldown_seconds=300,
    )
    db.add(rule); db.commit()
    return room, sensor, ac, rule


def test_overheat_writes_rising_then_cooling_readings(db_session):
    import scenario_engine as se
    room, sensor, ac, rule = _setup_home(db_session)

    se._run_overheat(actor_user_id=None,
                     db_factory=lambda: db_session,
                     sleep=lambda s: None)

    readings = (db_session.query(SensorReading)
                .filter(SensorReading.device_id == sensor.id,
                        SensorReading.reading_type == "temperature")
                .order_by(SensorReading.id).all())
    values = [r.value for r in readings]
    # сначала рост до пика, затем падение к норме
    assert values == se.RISING_VALUES + se.COOLING_VALUES
    assert max(values) >= se.THRESHOLD


def test_overheat_turns_ac_on_and_logs(db_session):
    import scenario_engine as se
    room, sensor, ac, rule = _setup_home(db_session)

    se._run_overheat(actor_user_id=None,
                     db_factory=lambda: db_session,
                     sleep=lambda s: None)

    ac_states = (db_session.query(DeviceState)
                 .filter(DeviceState.device_id == ac.id,
                         DeviceState.state_type == "ON/OFF").all())
    assert any(s.state_value == "1" for s in ac_states)

    logs = db_session.query(AutomationLog).filter(AutomationLog.rule_id == rule.id).all()
    assert len(logs) == 1
    assert logs[0].result == "success"


def test_get_state_idle_by_default():
    import scenario_engine as se
    se._reset_state()  # тестовый помощник
    st = se.get_state()
    assert st["running"] is False
    assert st["scenario"] is None
    assert st["phase"] is None
    assert st["seq"] == 0


def test_state_carries_value_and_seq_during_run(db_session):
    """Поллинг-канал: состояние несёт текущую температуру, room_id и растущий seq."""
    import scenario_engine as se
    from models import Room, DeviceType, Device
    room = Room(name="Гостиная", description="t"); db_session.add(room); db_session.commit()
    dts = DeviceType(name="Датчик температуры", is_sensor=True)
    dta = DeviceType(name="Кондиционер", is_sensor=False)
    db_session.add_all([dts, dta]); db_session.commit()
    s = Device(name="t", room_id=room.id, device_type_id=dts.id)
    a = Device(name="ac", room_id=room.id, device_type_id=dta.id)
    db_session.add_all([s, a]); db_session.commit()

    se._reset_state()
    se._run_overheat(actor_user_id=None, db_factory=lambda: db_session, sleep=lambda x: None)

    st = se.get_state()
    assert st["phase"] == "resolved"
    assert st["running"] is False
    assert st["seq"] > 0
    assert st["room_id"] == room.id
    assert st["value"] == se.COOLING_VALUES[-1]


def _auth_header(client):
    r = client.post("/api/auth/register", json={
        "full_name": "Demo", "email": "demo@e.com", "password": "p",
    })
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_start_overheat_endpoint(client, monkeypatch):
    import scenario_engine as se
    se._reset_state()
    # не запускать настоящий поток в тесте: runner-заглушка не сбрасывает состояние
    monkeypatch.setattr(se, "_run_overheat", lambda *a, **k: None)

    headers = _auth_header(client)
    r1 = client.post("/api/scenario/overheat/start", headers=headers)
    assert r1.status_code == 200
    assert r1.json()["ok"] is True

    # второй запуск, пока «идёт» → 409
    r2 = client.post("/api/scenario/overheat/start", headers=headers)
    assert r2.status_code == 409

    se._reset_state()


def test_scenario_state_endpoint(client):
    import scenario_engine as se
    se._reset_state()
    r = client.get("/api/scenario/state")
    assert r.status_code == 200
    assert r.json()["running"] is False


def test_start_allowed_without_auth(client, monkeypatch):
    """Демо можно запускать без входа (чтобы стартовать прямо с телефона)."""
    import scenario_engine as se
    se._reset_state()
    monkeypatch.setattr(se, "_run_overheat", lambda *a, **k: None)
    r = client.post("/api/scenario/overheat/start")
    assert r.status_code == 200
    assert r.json()["ok"] is True
    se._reset_state()
