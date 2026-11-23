<?php
require __DIR__ . '/db.php';
if (isLoggedIn()) { header('Location: index.php'); exit; }

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    // TODO 1 · найди пользователя: SELECT * FROM users WHERE email = ? (prepare + execute!)
    // TODO 2 · сверь пароль: password_verify($password, $user['password_hash'])
    // TODO 3 · успех:
    //   $_SESSION['user_id'] = $user['id'];
    //   $_SESSION['role']    = $user['role'];
    //   $_SESSION['fio']     = $user['fio'];
    //   header('Location: index.php'); exit;
    // TODO 4 · неудача (нет такого email ИЛИ не тот пароль) — ОДИНАКОВАЯ ошибка:
    //   $error = 'Неверный e-mail или пароль';
}
?>
<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Вход · КИТиС-ДЭ</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<main>
<h1>Вход</h1>
<form method="post" novalidate>
  <label>E-mail <input name="email" type="email" value="<?= e($_POST['email'] ?? '') ?>"></label>
  <label>Пароль <input name="password" type="password"></label>
  <button>Войти</button>
  <p class="err"><?= e($error) ?></p>
</form>
<p><a href="register.php">Нет аккаунта? Зарегистрироваться</a></p>
</main>
</body>
</html>
