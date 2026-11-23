# Шаг 09 · PHP + MySQL (серверная версия бронирования)

**Цель:** то же приложение, что на шаге 8, но по-настоящему: сервер, база данных, сессии, хеши паролей.
Это минимальный набор для ДЭ. Скелеты страниц готовы (формы свёрстаны), PHP-логика — твои TODO.

## Среда

**OpenServer** ([ospanel.io](https://ospanel.io)): скачать → установить → запустить (флажок в трее).
В комплекте PHP 8.x, MySQL/MariaDB, phpMyAdmin.

1. Создай в OpenServer домен `kitis-de.local`, указав папку этого шага (или скопируй папку в `domains/`).
2. Открой phpMyAdmin (меню OpenServer) → вкладка **Импорт** → выбери `schema.sql` → Выполнить.
3. Открой `http://kitis-de.local/register.php`.

Быстрая альтернатива для проб: встроенный сервер PHP — в папке шага `php -S localhost:8000`
(MySQL всё равно нужен от OpenServer).

## Порядок работы

| Файл | Что готово | Твои TODO |
|---|---|---|
| `schema.sql` | вся схема: `users`, `bookings` | импортировать, изучить связи |
| `db.php` | PDO-подключение, сессия, `e()`, guards | прочитать и понять каждую строку |
| `register.php` | форма | валидация, проверка email, `password_hash`, INSERT |
| `login.php` | форма | SELECT по email, `password_verify`, сессия, общая ошибка |
| `logout.php` | всё | — |
| `index.php` | форма заявки | guard, INSERT заявки, SELECT своих заявок |
| `admin.php` | — | guard роли, SELECT всех (JOIN), смена статуса, **проверка конфликта** |

Админа назначь SQL-запросом в phpMyAdmin (заодно потренируешь SQL):

```sql
UPDATE users SET role = 'admin' WHERE email = 'твой@email';
```

## Правила безопасности (обязательны, спрашиваются на защите)

1. **Только prepared statements**: `$pdo->prepare('… WHERE email = ?')` → `execute([$email])`.
   Никаких склеек переменных в SQL — это SQL-инъекция.
2. **`password_hash` / `password_verify`**. Пароли в базе открыто не хранятся никогда.
3. **`htmlspecialchars` при выводе** — готовая функция `e()` в `db.php`. Иначе XSS.
4. **Сессии**: `requireLogin()` на каждой защищённой странице; `requireAdmin()` в админке.
5. Одинаковая ошибка входа: «Неверный e-mail или пароль».

## Lite-версия (экспресс, если не успеваем)

`schema.sql` + `db.php` + `register/login/logout` + `index.php` (создание и просмотр своих заявок).
Админка и конфликт — по желанию. Этого минимума достаточно, чтобы понять серверную модель.

## Бонус (полный трек): Docker

В папке есть `Dockerfile` и `docker-compose.yml`: PHP 8.2 + Apache, MySQL 8, Adminer.

```bash
docker compose up -d
# сайт: http://localhost:8080 · Adminer: http://localhost:8081 (сервер: db, root, пустой пароль)
```

`db.php` сам берёт хост из переменной `DB_HOST` (в compose она равна `db`) — ничего править не нужно.
Схема импортируется автоматически при первом старте контейнера MySQL.

## Зачёт (ручные 8 + защита 2)

По чек-листу [CHECKLIST.md](CHECKLIST.md): смоук-сценарий из 12 пунктов + проверка на инъекцию и XSS.
Защита: объясни prepared statement и `password_hash`; покажи живую правку (новое поле в заявке).

**Контрольная точка:** режим экзамена (без ИИ, офлайн-доки) — [AI-POLICY](../../docs/AI-POLICY.md).

## Ресурсы

[php.net/manual/ru](https://www.php.net/manual/ru/) · [sql-ex.ru](https://sql-ex.ru) (первые 30 задач) · [ospanel.io](https://ospanel.io)
