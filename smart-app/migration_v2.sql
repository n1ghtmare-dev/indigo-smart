-- ============================================================
-- IndigoSmart · Database Migration v2
-- Расширение схемы под полный функционал дипломной симуляции
-- ============================================================

USE smart_home_db;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. РАСШИРЕНИЕ СУЩЕСТВУЮЩИХ ТАБЛИЦ
-- ============================================================

-- Процедура для добавления столбца если его нет
DROP PROCEDURE IF EXISTS add_col_if_missing;
DELIMITER $$
CREATE PROCEDURE add_col_if_missing(IN tbl VARCHAR(64), IN col VARCHAR(64), IN definition VARCHAR(255))
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = tbl AND column_name = col
  ) THEN
    SET @sql = CONCAT('ALTER TABLE ', tbl, ' ADD COLUMN ', col, ' ', definition);
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END$$
DELIMITER ;

CALL add_col_if_missing('users', 'role', "ENUM('admin','user','guest') NOT NULL DEFAULT 'user' AFTER password_hash");
CALL add_col_if_missing('users', 'last_login', 'TIMESTAMP NULL AFTER role');
CALL add_col_if_missing('devices', 'power_watts', 'INT NOT NULL DEFAULT 0 AFTER device_type_id');
CALL add_col_if_missing('devices', 'pos_x', 'DECIMAL(5,2) NULL AFTER power_watts');
CALL add_col_if_missing('devices', 'pos_y', 'DECIMAL(5,2) NULL AFTER pos_x');

DROP PROCEDURE add_col_if_missing;

-- ============================================================
-- 2. НОВЫЕ ТАБЛИЦЫ
-- ============================================================

-- 2.1 Сценарии
CREATE TABLE IF NOT EXISTS scenes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) DEFAULT 'home',
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_scene_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_scene_user (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS scene_actions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  scene_id INT NOT NULL,
  device_id INT NOT NULL,
  state_type VARCHAR(50) NOT NULL,
  state_value VARCHAR(50) NOT NULL,
  order_num INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_action_scene FOREIGN KEY (scene_id) REFERENCES scenes(id) ON DELETE CASCADE,
  CONSTRAINT fk_action_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  INDEX idx_action_scene (scene_id, order_num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2.2 Правила автоматизации
CREATE TABLE IF NOT EXISTS automation_rules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  -- условие: на каком сенсоре, какой оператор (>, <, =, motion_detected)
  sensor_device_id INT NULL,
  reading_type VARCHAR(50) NULL,
  operator ENUM('>','<','>=','<=','=','motion') NOT NULL,
  threshold_value FLOAT NULL,
  -- ограничение по времени (опционально)
  time_from TIME NULL,
  time_to TIME NULL,
  -- действие: какое устройство и в какое состояние
  target_device_id INT NOT NULL,
  action_state_type VARCHAR(50) NOT NULL,
  action_state_value VARCHAR(50) NOT NULL,
  -- защита от частых срабатываний (cooldown)
  cooldown_seconds INT NOT NULL DEFAULT 300,
  last_triggered_at TIMESTAMP NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rule_sensor FOREIGN KEY (sensor_device_id) REFERENCES devices(id) ON DELETE CASCADE,
  CONSTRAINT fk_rule_target FOREIGN KEY (target_device_id) REFERENCES devices(id) ON DELETE CASCADE,
  CONSTRAINT fk_rule_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_rule_enabled (enabled),
  INDEX idx_rule_sensor (sensor_device_id, reading_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS automation_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  rule_id INT NOT NULL,
  triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  trigger_value FLOAT NULL,
  result ENUM('success','skipped_cooldown','error') NOT NULL,
  message VARCHAR(255) NULL,
  CONSTRAINT fk_log_rule FOREIGN KEY (rule_id) REFERENCES automation_rules(id) ON DELETE CASCADE,
  INDEX idx_log_rule_time (rule_id, triggered_at DESC),
  INDEX idx_log_time (triggered_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2.3 Расписания
CREATE TABLE IF NOT EXISTS schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  device_id INT NOT NULL,
  state_type VARCHAR(50) NOT NULL,
  state_value VARCHAR(50) NOT NULL,
  -- cron-like: время и дни недели (битовая маска 1=пн ... 64=вс, 127=каждый день)
  fire_time TIME NOT NULL,
  days_mask TINYINT UNSIGNED NOT NULL DEFAULT 127,
  last_fired_at TIMESTAMP NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sched_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  CONSTRAINT fk_sched_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_sched_enabled (enabled, fire_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2.4 Audit log (заполняется триггерами)
CREATE TABLE IF NOT EXISTS audit_log (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT NULL,
  action ENUM('login','logout','device_state','rule_create','rule_update','rule_delete',
              'scene_create','scene_run','schedule_create','simulator_event') NOT NULL,
  entity_type VARCHAR(50) NULL,
  entity_id INT NULL,
  details JSON NULL,
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_audit_user_time (user_id, occurred_at DESC),
  INDEX idx_audit_action (action, occurred_at DESC),
  INDEX idx_audit_time (occurred_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2.5 Прогнозы ML (кешированные)
CREATE TABLE IF NOT EXISTS forecasts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  device_id INT NOT NULL,
  reading_type VARCHAR(50) NOT NULL,
  forecast_at TIMESTAMP NOT NULL,
  predicted_value FLOAT NOT NULL,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  model_name VARCHAR(50) DEFAULT 'simple-trend',
  CONSTRAINT fk_forecast_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  INDEX idx_forecast_device_time (device_id, reading_type, forecast_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2.6 Состояние симулятора (singleton-таблица)
CREATE TABLE IF NOT EXISTS simulator_state (
  id INT PRIMARY KEY DEFAULT 1,
  is_running BOOLEAN NOT NULL DEFAULT FALSE,
  speed_multiplier FLOAT NOT NULL DEFAULT 1.0,
  total_events_generated BIGINT NOT NULL DEFAULT 0,
  started_at TIMESTAMP NULL,
  CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO simulator_state (id, is_running) VALUES (1, FALSE)
  ON DUPLICATE KEY UPDATE id = id;

-- ============================================================
-- 3. ДОБАВЛЕНИЕ ИНДЕКСОВ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
-- ============================================================

-- Делаем CREATE INDEX через процедуру, чтобы пропускать существующие
DROP PROCEDURE IF EXISTS add_index_if_missing;
DELIMITER $$
CREATE PROCEDURE add_index_if_missing(IN tbl VARCHAR(64), IN idx VARCHAR(64), IN cols VARCHAR(255))
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.statistics
    WHERE table_schema = DATABASE() AND table_name = tbl AND index_name = idx
  ) THEN
    SET @sql = CONCAT('CREATE INDEX ', idx, ' ON ', tbl, '(', cols, ')');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END$$
DELIMITER ;

CALL add_index_if_missing('sensor_readings', 'idx_sensor_device_type_time', 'device_id, reading_type, recorded_at');
CALL add_index_if_missing('sensor_readings', 'idx_sensor_type_time', 'reading_type, recorded_at');
CALL add_index_if_missing('device_states', 'idx_state_user_time', 'changed_by, changed_at');

DROP PROCEDURE add_index_if_missing;

-- ============================================================
-- 4. ПРЕДСТАВЛЕНИЯ (VIEWS) для аналитики
-- ============================================================

-- 4.1 Текущее состояние всех устройств (последнее ON/OFF)
CREATE OR REPLACE VIEW v_current_device_status AS
SELECT
  d.id AS device_id,
  d.name AS device_name,
  d.room_id,
  r.name AS room_name,
  dt.name AS device_type,
  dt.is_sensor,
  d.power_watts,
  COALESCE(s.state_value, '0') AS current_state,
  s.changed_at AS last_changed_at,
  s.changed_by AS last_changed_by
FROM devices d
LEFT JOIN rooms r ON r.id = d.room_id
LEFT JOIN device_types dt ON dt.id = d.device_type_id
LEFT JOIN (
  SELECT ds.*
  FROM device_states ds
  INNER JOIN (
    SELECT device_id, MAX(id) AS max_id
    FROM device_states
    WHERE state_type = 'ON/OFF'
    GROUP BY device_id
  ) latest ON latest.max_id = ds.id
) s ON s.device_id = d.id;

-- 4.2 Окна включения/выключения (используем LAG window function)
CREATE OR REPLACE VIEW v_device_on_intervals AS
SELECT
  device_id,
  state_value,
  changed_at AS started_at,
  LEAD(changed_at) OVER (PARTITION BY device_id ORDER BY changed_at) AS ended_at,
  TIMESTAMPDIFF(SECOND, changed_at,
    COALESCE(LEAD(changed_at) OVER (PARTITION BY device_id ORDER BY changed_at), NOW())
  ) AS duration_seconds
FROM device_states
WHERE state_type = 'ON/OFF';

-- 4.3 Сводное время работы и кВт·ч по дням
CREATE OR REPLACE VIEW v_daily_uptime AS
SELECT
  d.id AS device_id,
  d.name AS device_name,
  d.power_watts,
  DATE(i.started_at) AS day,
  SUM(i.duration_seconds) AS on_seconds,
  ROUND(SUM(i.duration_seconds) / 3600.0, 2) AS on_hours,
  ROUND(SUM(i.duration_seconds) / 3600.0 * d.power_watts / 1000.0, 3) AS kwh
FROM v_device_on_intervals i
JOIN devices d ON d.id = i.device_id
WHERE i.state_value = '1'
GROUP BY d.id, d.name, d.power_watts, DATE(i.started_at);

-- 4.4 Топ потребителей энергии
CREATE OR REPLACE VIEW v_energy_leaders AS
SELECT
  device_id,
  device_name,
  SUM(on_hours) AS total_hours,
  SUM(kwh) AS total_kwh,
  COUNT(DISTINCT day) AS days_with_activity
FROM v_daily_uptime
GROUP BY device_id, device_name;

-- ============================================================
-- 5. ХРАНИМАЯ ПРОЦЕДУРА расчёта энергии за период
-- ============================================================

DROP PROCEDURE IF EXISTS calc_energy_for_period;
DELIMITER $$
CREATE PROCEDURE calc_energy_for_period(
  IN p_device_id INT,
  IN p_from DATETIME,
  IN p_to DATETIME
)
BEGIN
  SELECT
    d.id AS device_id,
    d.name AS device_name,
    d.power_watts,
    COALESCE(SUM(
      CASE WHEN i.state_value = '1'
           THEN LEAST(
                  TIMESTAMPDIFF(SECOND,
                    GREATEST(i.started_at, p_from),
                    LEAST(COALESCE(i.ended_at, NOW()), p_to)
                  ),
                  0
                )
           ELSE 0
      END
    ), 0) AS on_seconds_in_period,
    ROUND(COALESCE(SUM(
      CASE WHEN i.state_value = '1'
           THEN LEAST(
                  TIMESTAMPDIFF(SECOND,
                    GREATEST(i.started_at, p_from),
                    LEAST(COALESCE(i.ended_at, NOW()), p_to)
                  ),
                  0
                )
           ELSE 0
      END
    ), 0) / 3600.0 * d.power_watts / 1000.0, 3) AS kwh
  FROM devices d
  LEFT JOIN v_device_on_intervals i ON i.device_id = d.id
    AND i.started_at < p_to
    AND COALESCE(i.ended_at, NOW()) > p_from
  WHERE (p_device_id IS NULL OR d.id = p_device_id)
  GROUP BY d.id, d.name, d.power_watts;
END$$
DELIMITER ;

-- ============================================================
-- 6. ТРИГГЕРЫ ДЛЯ AUDIT LOG
-- ============================================================

-- 6.1 Каждое изменение состояния устройства — в audit_log
DROP TRIGGER IF EXISTS trg_device_state_audit;
DELIMITER $$
CREATE TRIGGER trg_device_state_audit
AFTER INSERT ON device_states
FOR EACH ROW
BEGIN
  INSERT INTO audit_log (user_id, action, entity_type, entity_id, details)
  VALUES (
    NEW.changed_by,
    'device_state',
    'device',
    NEW.device_id,
    JSON_OBJECT(
      'state_type', NEW.state_type,
      'state_value', NEW.state_value,
      'changed_at', NEW.changed_at
    )
  );
END$$
DELIMITER ;

-- 6.2 Создание правила автоматизации
DROP TRIGGER IF EXISTS trg_rule_create_audit;
DELIMITER $$
CREATE TRIGGER trg_rule_create_audit
AFTER INSERT ON automation_rules
FOR EACH ROW
BEGIN
  INSERT INTO audit_log (user_id, action, entity_type, entity_id, details)
  VALUES (
    NEW.created_by,
    'rule_create',
    'rule',
    NEW.id,
    JSON_OBJECT('name', NEW.name, 'enabled', NEW.enabled)
  );
END$$
DELIMITER ;

-- 6.3 Создание сценария
DROP TRIGGER IF EXISTS trg_scene_create_audit;
DELIMITER $$
CREATE TRIGGER trg_scene_create_audit
AFTER INSERT ON scenes
FOR EACH ROW
BEGIN
  INSERT INTO audit_log (user_id, action, entity_type, entity_id, details)
  VALUES (
    NEW.created_by,
    'scene_create',
    'scene',
    NEW.id,
    JSON_OBJECT('name', NEW.name)
  );
END$$
DELIMITER ;

-- ============================================================
-- 7. SEED ДАННЫЕ (мощности устройств + позиции на плане + дефолтные сценарии и правила)
-- ============================================================

-- Мощности (Вт)
UPDATE devices d
JOIN device_types dt ON dt.id = d.device_type_id
SET d.power_watts = CASE dt.name
  WHEN 'Лампа' THEN 12
  WHEN 'Розетка' THEN 0
  WHEN 'Умная розетка' THEN 0
  WHEN 'Кондиционер' THEN 1200
  WHEN 'Датчик температуры' THEN 1
  WHEN 'Датчик движения' THEN 1
  WHEN 'Датчик влажности' THEN 1
  ELSE 0
END
WHERE d.power_watts = 0;

-- Позиции на простом плане квартиры (нормализованные 0..100 — комнаты)
UPDATE devices SET pos_x = 25, pos_y = 30 WHERE id = 1;
UPDATE devices SET pos_x = 70, pos_y = 25 WHERE id = 2;
UPDATE devices SET pos_x = 30, pos_y = 70 WHERE id = 3;
UPDATE devices SET pos_x = 75, pos_y = 65 WHERE id = 4;
UPDATE devices SET pos_x = 50, pos_y = 50 WHERE id = 5;
UPDATE devices SET pos_x = 20, pos_y = 50 WHERE id = 6;
UPDATE devices SET pos_x = 80, pos_y = 80 WHERE id = 7;
UPDATE devices SET pos_x = 40, pos_y = 25 WHERE id = 8;
UPDATE devices SET pos_x = 60, pos_y = 75 WHERE id = 9;

-- Хешированный пароль "demo123" для существующих пользователей (bcrypt)
-- $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyA0bcdEFGhij2 = "demo123"
UPDATE users SET
  password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyA0bcdEFGhij2',
  role = CASE WHEN id = 1 THEN 'admin' ELSE 'user' END
WHERE password_hash NOT LIKE '$2b$%' OR password_hash IS NULL;

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Migration v2 applied successfully' AS status;
SELECT
  (SELECT COUNT(*) FROM scenes) AS scenes,
  (SELECT COUNT(*) FROM scene_actions) AS scene_actions,
  (SELECT COUNT(*) FROM automation_rules) AS rules,
  (SELECT COUNT(*) FROM schedules) AS schedules,
  (SELECT COUNT(*) FROM audit_log) AS audit_records,
  (SELECT COUNT(*) FROM forecasts) AS forecasts;
