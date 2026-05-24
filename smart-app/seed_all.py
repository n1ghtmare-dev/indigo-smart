"""Seed database with Russian data and 30 days of sensor readings."""
import pymysql
import random
import math
from datetime import datetime, timedelta

conn = pymysql.connect(
    host='localhost', user='root', password='',
    database='smart_home_db', charset='utf8mb4'
)
cur = conn.cursor()

# Users
cur.execute("INSERT INTO users (full_name, email, password_hash) VALUES (%s, %s, %s)",
            ("Иван Иванов", "ivan@example.com", "hash1"))
cur.execute("INSERT INTO users (full_name, email, password_hash) VALUES (%s, %s, %s)",
            ("Анна Петрова", "anna@example.com", "hash2"))

# Rooms
rooms = [
    ("Гостиная", "Основная комната отдыха"),
    ("Кухня", "Помещение для приготовления пищи"),
    ("Спальня", "Комната для сна"),
]
for name, desc in rooms:
    cur.execute("INSERT INTO rooms (name, description) VALUES (%s, %s)", (name, desc))

# Device types
types = [
    ("Лампа", False),
    ("Розетка", False),
    ("Датчик температуры", True),
    ("Датчик движения", True),
    ("Датчик влажности", True),
    ("Кондиционер", False),
    ("Умная розетка", False),
]
for name, is_sensor in types:
    cur.execute("INSERT INTO device_types (name, is_sensor) VALUES (%s, %s)", (name, int(is_sensor)))

# Devices (room_id, type_id, name)
devices = [
    (1, 1, "Лампа в гостиной"),
    (3, 1, "Лампа в спальне"),
    (2, 3, "Температура кухня"),
    (1, 4, "Датчик движения гостиная"),
    (2, 5, "Датчик влажности кухня"),
    (1, 6, "Кондиционер гостиная"),
    (3, 7, "Розетка спальня"),
    (1, 3, "Датчик температуры гостиная"),
    (3, 3, "Датчик температуры спальня"),
]
for room_id, type_id, name in devices:
    cur.execute("INSERT INTO devices (name, room_id, device_type_id) VALUES (%s, %s, %s)",
                (name, room_id, type_id))

conn.commit()

# Generate 30 days of sensor data
now = datetime.now()

# Temperature sensors (devices 3, 8, 9) - every 2 hours
print("Generating temperature readings...")
temp_devices = {3: (21.0, 3.0), 8: (22.0, 2.5), 9: (20.5, 2.0)}
for dev_id, (base, amplitude) in temp_devices.items():
    for i in range(360):
        ts = now - timedelta(hours=i * 2)
        hour = ts.hour
        val = round(base + amplitude * math.sin((hour - 6) * math.pi / 12) + random.uniform(-1, 1), 1)
        cur.execute(
            "INSERT INTO sensor_readings (device_id, reading_type, value, recorded_at) VALUES (%s, %s, %s, %s)",
            (dev_id, "temperature", val, ts)
        )

# Humidity sensor (device 5) - every 2 hours
print("Generating humidity readings...")
for i in range(360):
    ts = now - timedelta(hours=i * 2)
    hour = ts.hour
    val = round(45.0 + 15.0 * math.sin((hour - 8) * math.pi / 12) + random.uniform(-2.5, 2.5), 1)
    cur.execute(
        "INSERT INTO sensor_readings (device_id, reading_type, value, recorded_at) VALUES (%s, %s, %s, %s)",
        (5, "humidity", val, ts)
    )

# Motion sensor (device 4) - every hour
print("Generating motion readings...")
for i in range(720):
    ts = now - timedelta(hours=i)
    hour = ts.hour
    val = 1 if (7 <= hour <= 23 and random.random() < 0.6) else 0
    cur.execute(
        "INSERT INTO sensor_readings (device_id, reading_type, value, recorded_at) VALUES (%s, %s, %s, %s)",
        (4, "motion", val, ts)
    )

conn.commit()

# Device states - ON/OFF patterns
print("Generating device states...")
# Lamp living room (1) - ON 8-22h
for i in range(180):
    ts = now - timedelta(hours=i * 4)
    val = "1" if 8 <= ts.hour <= 22 else "0"
    user = random.choice([1, 2])
    cur.execute(
        "INSERT INTO device_states (device_id, state_type, state_value, changed_at, changed_by) VALUES (%s, %s, %s, %s, %s)",
        (1, "ON/OFF", val, ts, user)
    )

# Lamp bedroom (2) - ON 20-23h and 6-8h
for i in range(180):
    ts = now - timedelta(hours=i * 4)
    val = "1" if (20 <= ts.hour <= 23 or 6 <= ts.hour <= 8) else "0"
    user = random.choice([1, 2])
    cur.execute(
        "INSERT INTO device_states (device_id, state_type, state_value, changed_at, changed_by) VALUES (%s, %s, %s, %s, %s)",
        (2, "ON/OFF", val, ts, user)
    )

# AC (6) - ON 12-18h
for i in range(120):
    ts = now - timedelta(hours=i * 6)
    val = "1" if 12 <= ts.hour <= 18 else "0"
    cur.execute(
        "INSERT INTO device_states (device_id, state_type, state_value, changed_at, changed_by) VALUES (%s, %s, %s, %s, %s)",
        (6, "ON/OFF", val, ts, 1)
    )

# Smart outlet (7) - ON 9-21h
for i in range(90):
    ts = now - timedelta(hours=i * 8)
    val = "1" if 9 <= ts.hour <= 21 else "0"
    cur.execute(
        "INSERT INTO device_states (device_id, state_type, state_value, changed_at, changed_by) VALUES (%s, %s, %s, %s, %s)",
        (7, "ON/OFF", val, ts, 2)
    )

# Brightness changes
for i in range(60):
    ts = now - timedelta(hours=i * 12)
    dev = random.choice([1, 2])
    val = str(random.randint(20, 100))
    user = random.choice([1, 2])
    cur.execute(
        "INSERT INTO device_states (device_id, state_type, state_value, changed_at, changed_by) VALUES (%s, %s, %s, %s, %s)",
        (dev, "brightness", val, ts, user)
    )

conn.commit()
conn.close()

print("Done! Database seeded successfully.")
