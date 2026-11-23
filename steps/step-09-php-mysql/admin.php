<?php
require __DIR__ . '/db.php';
requireAdmin(); // готово: только роль admin

$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id     = (int)($_POST['id'] ?? 0);
    $status = $_POST['status'] ?? '';
    $reason = trim($_POST['reason'] ?? '');

    // TODO 1 · проверь: $status ∈ ['approved','rejected']; при rejected причина обязательна.

    // TODO 2 · если approved — проверь конфликт:
    //   а) SELECT * FROM bookings WHERE id = ?  (получи room/date/pair заявки)
    //   б) SELECT id FROM bookings
    //      WHERE room = ? AND date = ? AND pair = ? AND status = 'approved' AND id <> ?
    //   в) если нашлась — $msg = 'Аудитория уже занята на эту дату и пару', статус НЕ менять.

    // TODO 3 · UPDATE bookings SET status = ?, reason = ? WHERE id = ?  (prepare + execute!)
    //          при approved причина = NULL.
}

// TODO 4 · все заявки с авторами:
//   SELECT b.*, u.fio, u.email FROM bookings b JOIN users u ON u.id = b.user_id
//   ORDER BY b.created_at DESC
$bookings = []; // замени на результат SELECT

$STATUS_RU = ['new' => 'новая', 'approved' => 'подтверждена', 'rejected' => 'отклонена'];
?>
<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Админка · КИТиС-ДЭ</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<main>
<h1>Все заявки</h1>
<p><a href="index.php">Мои заявки</a> · <a href="logout.php">Выйти</a></p>
<p class="err"><?= e($msg) ?></p>

<!-- TODO 5 · таблица: автор (fio, email), аудитория, дата, пара, цель, статус, причина + действия.
     Для заявок со статусом «новая» — две POST-формы:
       подтвердить: <input type="hidden" name="id" …> <input type="hidden" name="status" value="approved">
       отклонить:   то же + <input name="reason" placeholder="Причина отказа" required>
     Все значения через e(). -->
<table>
  <thead><tr><th>Автор</th><th>Аудитория</th><th>Дата</th><th>Пара</th><th>Цель</th><th>Статус</th><th>Действия</th></tr></thead>
  <tbody>
  <?php foreach ($bookings as $b): ?>
    <tr>
      <td><?= e($b['fio'] ?? '') ?><br><small><?= e($b['email'] ?? '') ?></small></td>
      <td><?= e($b['room']) ?></td>
      <td><?= e($b['date']) ?></td>
      <td><?= e($b['pair']) ?></td>
      <td><?= e($b['purpose']) ?></td>
      <td><?= e($STATUS_RU[$b['status']] ?? $b['status']) ?><?= $b['reason'] ? '<br><small>' . e($b['reason']) . '</small>' : '' ?></td>
      <td><!-- TODO: формы подтвердить/отклонить для статуса new --></td>
    </tr>
  <?php endforeach; ?>
  </tbody>
</table>
</main>
</body>
</html>
