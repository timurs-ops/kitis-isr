<?php
/* КИТиС-ДЭ · шаг 09. Подключение к БД + сессия + помощники. ГОТОВО — изучи каждую строку.
 * Подключай в начале каждой страницы: require __DIR__ . '/db.php';
 * OpenServer: root, пустой пароль. Docker: хост 'db' (compose сам задаёт DB_HOST). */

session_start();

$DB_HOST = getenv('DB_HOST') ?: '127.0.0.1';

$pdo = new PDO(
    "mysql:host={$DB_HOST};dbname=kitis_de;charset=utf8mb4",
    'root',
    '',
    [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // ошибки — исключения, не молчание
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // строки — ассоциативные массивы
        PDO::ATTR_EMULATE_PREPARES   => false,                  // настоящие prepared statements
    ]
);

/* Экранирование при выводе в HTML. ВСЕГДА оборачивай пользовательские данные: <?= e($x) ?> */
function e($s) {
    return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}

function isLoggedIn() {
    return !empty($_SESSION['user_id']);
}

/* Защищённая страница: нет входа → на login.php */
function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
}

/* Админка: нет роли admin → 403 */
function requireAdmin() {
    requireLogin();
    if (($_SESSION['role'] ?? '') !== 'admin') {
        http_response_code(403);
        exit('Только для администратора');
    }
}
