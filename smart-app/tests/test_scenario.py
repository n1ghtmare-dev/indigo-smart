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
    assert st == {"running": False, "scenario": None, "phase": None}
