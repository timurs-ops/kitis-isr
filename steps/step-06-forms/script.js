/* Шаг 06 · регистрация и вход. Контракт и правила — в README.md.
 * Помощники готовы, обработчики подключены — твоя работа: маска, валидация, хранилище. */

var USERS_KEY = 'kitis-de:users';
var SESSION_KEY = 'kitis-de:session';

/* --- готовые помощники --- */
function showError(name, msg) {
  var el = document.querySelector('[data-error-for="' + name + '"]');
  if (el) el.textContent = msg;
}
function clearErrors(form) {
  form.querySelectorAll('[data-error-for]').forEach(function (el) { el.textContent = ''; });
}
function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch (e) { return []; }
}
function saveUsers(list) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

/* TODO 1 · маска телефона (input):
 * оставь только цифры (value.replace(/\D/g, '')), ведущие 7/8 отбрось,
 * собери '+7(' + первые3 + ')-' + следующие3 + '-' + следующие2 + '-' + последние2
 * по мере ввода (недостающие куски просто не добавляй). */
document.getElementById('phone').addEventListener('input', function () {
  // this.value = …
});

/* TODO 2 · регистрация:
 * - проверь ФИО (кириллица, 2–3 слова), телефон (полная маска), email, пароль (≥8, буквы+цифры),
 *   совпадение паролей; каждую ошибку — showError('имяполя', 'понятный текст');
 * - проверь, что email не занят (getUsers);
 * - если ошибок нет: добавь {fio, phone, email, password} в getUsers → saveUsers,
 *   покажи #reg-success («Готово! Теперь войди»), очисти форму.
 * Учебный прототип: пароль открыто. На шаге 9 узнаем, почему на сервере так нельзя. */
document.getElementById('reg-form').addEventListener('submit', function (e) {
  e.preventDefault();
  clearErrors(this);
  document.getElementById('reg-success').textContent = '';
  // …
});

/* TODO 3 · вход:
 * - очисти #login-error;
 * - найди пользователя по email (getUsers), сверь пароль;
 * - неудача (нет email ИЛИ не тот пароль) → #login-error = 'Неверный e-mail или пароль' (одинаковая!);
 * - успех → localStorage[SESSION_KEY] = JSON.stringify({email: …}), сообщение об успехе. */
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  document.getElementById('login-error').textContent = '';
  // …
});
