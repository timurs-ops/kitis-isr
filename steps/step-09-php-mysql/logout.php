<?php
/* Выход. ГОТОВО — изучи: сессия уничтожается, пользователь уходит на вход. */
require __DIR__ . '/db.php';
$_SESSION = [];
session_destroy();
header('Location: login.php');
exit;
