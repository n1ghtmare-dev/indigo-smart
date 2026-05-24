-- IndigoSmart: Rich mock data for diploma analytics demo
-- Generates 30 days of realistic sensor readings and device events

-- Add more devices
INSERT IGNORE INTO device_types (id, name, is_sensor, created_at) VALUES
(5, 'Датчик влажности', 1, NOW()),
(6, 'Кондиционер', 0, NOW()),
(7, 'Умная розетка', 0, NOW());

INSERT INTO devices (name, room_id, device_type_id) VALUES
('Датчик влажности кухня', 2, 5),
('Кондиционер гостиная', 1, 6),
('Розетка спальня', 3, 7),
('Датчик температуры гостиная', 1, 3),
('Датчик температуры спальня', 3, 3);

-- Generate 30 days of temperature readings for device 3 (кухня)
-- Using a procedure-like approach with INSERT + date arithmetic

-- Kitchen temperature sensor (device 3) - readings every 2 hours for 30 days
INSERT INTO sensor_readings (device_id, reading_type, value, recorded_at)
SELECT 3, 'temperature',
  ROUND(21.0 + 3.0 * SIN((HOUR(ts) - 6) * PI() / 12) + (RAND() * 2 - 1), 1),
  ts
FROM (
  SELECT DATE_SUB(NOW(), INTERVAL seq * 2 HOUR) as ts
  FROM (
    SELECT a.N + b.N * 10 + c.N * 100 as seq
    FROM (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
         (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b,
         (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) c
    ORDER BY seq
  ) numbers
  WHERE seq < 360
) dates;

-- Living room temperature sensor (device 8) - readings every 2 hours
INSERT INTO sensor_readings (device_id, reading_type, value, recorded_at)
SELECT 8, 'temperature',
  ROUND(22.0 + 2.5 * SIN((HOUR(ts) - 6) * PI() / 12) + (RAND() * 1.5 - 0.75), 1),
  ts
FROM (
  SELECT DATE_SUB(NOW(), INTERVAL seq * 2 HOUR) as ts
  FROM (
    SELECT a.N + b.N * 10 + c.N * 100 as seq
    FROM (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
         (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b,
         (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) c
    ORDER BY seq
  ) numbers
  WHERE seq < 360
) dates;

-- Bedroom temperature sensor (device 9)
INSERT INTO sensor_readings (device_id, reading_type, value, recorded_at)
SELECT 9, 'temperature',
  ROUND(20.5 + 2.0 * SIN((HOUR(ts) - 6) * PI() / 12) + (RAND() * 1 - 0.5), 1),
  ts
FROM (
  SELECT DATE_SUB(NOW(), INTERVAL seq * 2 HOUR) as ts
  FROM (
    SELECT a.N + b.N * 10 + c.N * 100 as seq
    FROM (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
         (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b,
         (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) c
    ORDER BY seq
  ) numbers
  WHERE seq < 360
) dates;

-- Humidity sensor (device 5) - readings every 2 hours
INSERT INTO sensor_readings (device_id, reading_type, value, recorded_at)
SELECT 5, 'humidity',
  ROUND(45.0 + 15.0 * SIN((HOUR(ts) - 8) * PI() / 12) + (RAND() * 5 - 2.5), 1),
  ts
FROM (
  SELECT DATE_SUB(NOW(), INTERVAL seq * 2 HOUR) as ts
  FROM (
    SELECT a.N + b.N * 10 + c.N * 100 as seq
    FROM (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
         (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b,
         (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) c
    ORDER BY seq
  ) numbers
  WHERE seq < 360
) dates;

-- Motion sensor (device 4) - sporadic detections, more during day
INSERT INTO sensor_readings (device_id, reading_type, value, recorded_at)
SELECT 4, 'motion',
  CASE WHEN HOUR(ts) BETWEEN 7 AND 23 AND RAND() < 0.6 THEN 1 ELSE 0 END,
  ts
FROM (
  SELECT DATE_SUB(NOW(), INTERVAL seq HOUR) as ts
  FROM (
    SELECT a.N + b.N * 10 + c.N * 100 as seq
    FROM (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
         (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b,
         (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7) c
    ORDER BY seq
  ) numbers
  WHERE seq < 720
) dates;

-- Device state changes - simulate daily ON/OFF patterns for lamps
-- Lamp in living room (device 1)
INSERT INTO device_states (device_id, state_type, state_value, changed_at, changed_by)
SELECT 1, 'ON/OFF',
  CASE WHEN HOUR(ts) BETWEEN 8 AND 22 THEN '1' ELSE '0' END,
  ts,
  CASE WHEN RAND() < 0.5 THEN 1 ELSE 2 END
FROM (
  SELECT DATE_SUB(NOW(), INTERVAL seq * 4 HOUR) as ts
  FROM (
    SELECT a.N + b.N * 10 + c.N * 100 as seq
    FROM (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
         (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b,
         (SELECT 0 as N UNION SELECT 1) c
    ORDER BY seq
  ) numbers
  WHERE seq < 180
) dates;

-- Lamp in bedroom (device 2)
INSERT INTO device_states (device_id, state_type, state_value, changed_at, changed_by)
SELECT 2, 'ON/OFF',
  CASE WHEN HOUR(ts) BETWEEN 20 AND 23 OR HOUR(ts) BETWEEN 6 AND 8 THEN '1' ELSE '0' END,
  ts,
  CASE WHEN RAND() < 0.5 THEN 1 ELSE 2 END
FROM (
  SELECT DATE_SUB(NOW(), INTERVAL seq * 4 HOUR) as ts
  FROM (
    SELECT a.N + b.N * 10 + c.N * 100 as seq
    FROM (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
         (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b,
         (SELECT 0 as N UNION SELECT 1) c
    ORDER BY seq
  ) numbers
  WHERE seq < 180
) dates;

-- AC (device 6) - ON when temp > 24
INSERT INTO device_states (device_id, state_type, state_value, changed_at, changed_by)
SELECT 6, 'ON/OFF',
  CASE WHEN HOUR(ts) BETWEEN 12 AND 18 THEN '1' ELSE '0' END,
  ts,
  1
FROM (
  SELECT DATE_SUB(NOW(), INTERVAL seq * 6 HOUR) as ts
  FROM (
    SELECT a.N + b.N * 10 + c.N * 100 as seq
    FROM (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
         (SELECT 0 as N UNION SELECT 1 UNION SELECT 2) b,
         (SELECT 0 as N) c
    ORDER BY seq
  ) numbers
  WHERE seq < 120
) dates;

-- Smart outlet (device 7)
INSERT INTO device_states (device_id, state_type, state_value, changed_at, changed_by)
SELECT 7, 'ON/OFF',
  CASE WHEN HOUR(ts) BETWEEN 9 AND 21 THEN '1' ELSE '0' END,
  ts,
  2
FROM (
  SELECT DATE_SUB(NOW(), INTERVAL seq * 8 HOUR) as ts
  FROM (
    SELECT a.N + b.N * 10 as seq
    FROM (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
         (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
    ORDER BY seq
  ) numbers
  WHERE seq < 90
) dates;

-- Brightness changes for lamps
INSERT INTO device_states (device_id, state_type, state_value, changed_at, changed_by)
SELECT
  CASE WHEN RAND() < 0.5 THEN 1 ELSE 2 END,
  'brightness',
  CAST(ROUND(20 + RAND() * 80) AS CHAR),
  DATE_SUB(NOW(), INTERVAL seq * 12 HOUR),
  CASE WHEN RAND() < 0.5 THEN 1 ELSE 2 END
FROM (
  SELECT a.N + b.N * 10 as seq
  FROM (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
       (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6) b
  ORDER BY seq
) numbers
WHERE seq < 60;
