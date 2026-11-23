<?php
require __DIR__ . '/db.php';
requireLogin(); // готово: без входа страница закрыта

$ROOMS = ['104', '105', '201', '403', '109м'];
$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $room    = $_POST['room'] ?? '';
    $date    = $_POST['date'] ?? '';
    $pair    = (int)($_POST['pair'] ?? 0);
    $purpose = trim($_POST['purpose'] ?? '');

    // TODO 1 · валидация: room из $ROOMS; date непустая и не в прошлом; pair 1–6; purpose непустая.
    // TODO 2 · INSERT INTO bookings (user_id, room, date, pair, purpose) VALUES (?, ?, ?, ?, ?)
    //          user_id = $_SESSION['user_id']. prepare + execute!
    // TODO 3 · header('Location: index.php'); exit;  (чтобы F5 не дублировал заявку)
}

// TODO 4 · мои заявки:
//   $stmt = $pdo->prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC');
//   $stmt->execute([$_SESSION['user_id']]);
//   $bookings = $stmt->fetchAll();
$bookings = []; // замени на результат SELECT

$STATUS_RU = ['new' => 'новая', 'approved' => 'подтверждена', 'rejected' => 'отклонена'];
?>
<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Мои заявки · КИТиС-ДЭ</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<main>
<h1>Бронирование аудитории</h1>
<p>Привет, <?= e($_SESSION['fio'] ?? '') ?>!
  <?php if (($_SESSION['role'] ?? '') === 'admin'): ?><a href="admin.php">Админка</a> · <?php endif; ?>
  <a href="logout.php">Выйти</a></p>

<h2>Новая заявка</h2>
<form method="post" novalidate>
  <label>Аудитория
    <select name="room">
      <?php foreach ($ROOMS as $r): ?><option value="<?= e($r) ?>"><?= e($r) ?></option><?php endforeach; ?>
    </select>
  </label>
  <label>Дата <input name="date" type="date"></label>
  <label>Пара
    <select name="pair">
      <?php for ($i = 1; $i <= 6; $i++): ?><option value="<?= $i ?>"><?= $i ?></option><?php endfor; ?>
    </select>
  </label>
  <label>Цель <input name="purpose" placeholder="Например: репетиция защиты проекта"></label>
  <button>Отправить заявку</button>
  <p class="err"><?= e(implode(' · ', $errors)) ?></p>
</form>

<h2>Мои заявки</h2>
<!-- TODO 5 · выведи $bookings таблицей: аудитория, дата, пара, цель, статус ($STATUS_RU), причина.
     Каждое значение — через e()! Пусто → «Заявок пока нет». -->
<table>
  <thead><tr><th>Аудитория</th><th>Дата</th><th>Пара</th><th>Цель</th><th>Статус</th><th>Причина</th></tr></thead>
  <tbody>
  <?php foreach ($bookings as $b): ?>
    <tr>
      <td><?= e($b['room']) ?></td>
      <td><?= e($b['date']) ?></td>
      <td><?= e($b['pair']) ?></td>
      <td><?= e($b['purpose']) ?></td>
      <td><?= e($STATUS_RU[$b['status']] ?? $b['status']) ?></td>
      <td><?= e($b['reason'] ?? '') ?></td>
    </tr>
  <?php endforeach; ?>
  </tbody>
</table>
</main>
</body>
</html>
