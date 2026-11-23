-- КИТиС-ДЭ · шаг 09. База для «Бронирования аудиторий».
-- Импорт: phpMyAdmin → вкладка «Импорт» → этот файл.
-- Или из консоли: mysql -u root < schema.sql
-- В Docker импортируется автоматически при первом старте контейнера MySQL.

CREATE DATABASE IF NOT EXISTS kitis_de
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kitis_de;

CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(190) NOT NULL UNIQUE,
  fio           VARCHAR(190) NOT NULL,
  phone         VARCHAR(20)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL,           -- только хеш, никогда открытый пароль
  role          ENUM('student','admin') NOT NULL DEFAULT 'student',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  room       VARCHAR(20)  NOT NULL,              -- '104','105','201','403','109м'
  date       DATE         NOT NULL,
  pair       TINYINT UNSIGNED NOT NULL,          -- 1..6
  purpose    VARCHAR(255) NOT NULL,
  status     ENUM('new','approved','rejected') NOT NULL DEFAULT 'new',
  reason     VARCHAR(255) DEFAULT NULL,          -- причина отказа
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_slot (room, date, pair)              -- ускоряет проверку конфликта
) ENGINE=InnoDB;

-- Конфликт «две подтверждённые на одну аудитория+дата+пара» проверяется в PHP перед UPDATE:
-- частичного UNIQUE-индекса «только для approved» в MySQL нет, поэтому логика в коде (admin.php).
-- Назначение админа (после регистрации через форму):
-- UPDATE users SET role = 'admin' WHERE email = 'твой@email';
