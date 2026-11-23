<?php
require __DIR__ . '/db.php';
if (isLoggedIn()) { header('Location: index.php'); exit; }

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fio       = trim($_POST['fio'] ?? '');
    $phone     = trim($_POST['phone'] ?? '');
    $email     = trim($_POST['email'] ?? '');
    $password  = $_POST['password'] ?? '';
    $password2 = $_POST['password2'] ?? '';

    // TODO 1 · валидация (правила шага 6):
    //   ФИО — кириллица, 2–3 слова; телефон — +7(XXX)-XXX-XX-XX; email — формат;
    //   пароль — ≥8, буквы и цифры; password2 совпадает.
    //   Ошибки складывай в $errors['fio'], $errors['email'] и т.д.

    // TODO 2 · email не занят?
    //   $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    //   $stmt->execute([$email]); if ($stmt->fetch()) $errors['email'] = 'Этот e-mail уже зарегистрирован';

    // TODO 3 · если ошибок нет:
    //   $hash = password_hash($password, PASSWORD_DEFAULT);
    //   INSERT INTO users (fio, phone, email, password_hash) VALUES (?, ?, ?, ?) — prepare + execute!
    //   header('Location: login.php'); exit;
}
?>
<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Регистрация · КИТиС-ДЭ</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<main>
<h1>Регистрация</h1>
<form method="post" novalidate>
  <label>ФИО <input name="fio" value="<?= e($_POST['fio'] ?? '') ?>"></label>
  <span class="err"><?= e($errors['fio'] ?? '') ?></span>

  <label>Телефон <input name="phone" value="<?= e($_POST['phone'] ?? '') ?>" placeholder="+7(___)___-__-__"></label>
  <span class="err"><?= e($errors['phone'] ?? '') ?></span>

  <label>E-mail <input name="email" type="email" value="<?= e($_POST['email'] ?? '') ?>"></label>
  <span class="err"><?= e($errors['email'] ?? '') ?></span>

  <label>Пароль <input name="password" type="password"></label>
  <span class="err"><?= e($errors['password'] ?? '') ?></span>

  <label>Повтори пароль <input name="password2" type="password"></label>
  <span class="err"><?= e($errors['password2'] ?? '') ?></span>

  <button>Зарегистрироваться</button>
</form>
<p><a href="login.php">Уже есть аккаунт? Войти</a></p>
</main>
</body>
</html>
