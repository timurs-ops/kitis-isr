/* Шаг 06 · проверки форм. Контракт — в README.md.
 * Чекер шлёт настоящие события input/submit — обработчики должны работать как от реального пользователя. */
var USERS = 'kitis-de:users';
var SESSION = 'kitis-de:session';
var VALID = {
  fio: 'Иванов Иван Иванович',
  phone: '9123456789',
  email: 'test@example.com',
  password: 'parol1234',
  password2: 'parol1234'
};

async function fill(c, over) {
  var v = Object.assign({}, VALID, over || {});
  await c.type('#fio', v.fio);
  await c.type('#phone', v.phone);
  await c.type('#email', v.email);
  await c.type('#password', v.password);
  await c.type('#password2', v.password2);
}
function users(c) { try { return JSON.parse(c.ls.get(USERS)) || []; } catch (e) { return []; } }
function err(c, name) { return c.text('[data-error-for="' + name + '"]').trim(); }

runChecks({
  page: 'index.html',
  checks: [
    { title: 'Все формы и поля на месте (контракт id)',
      hint: 'Не переименовывай id из скелета: reg-form, fio, phone, email, password, password2, reg-success, login-form, login-email, login-password, login-error.',
      test: function (c) {
        return ['#reg-form', '#fio', '#phone', '#email', '#password', '#password2', '#reg-success',
          '#login-form', '#login-email', '#login-password', '#login-error']
          .every(function (s) { return c.exists(s); });
      } },

    { title: 'Маска телефона: 9123456789 → +7(912)-345-67-89',
      hint: 'Обработчик input на #phone: цифры → формат +7(XXX)-XXX-XX-XX.',
      test: async function (c) {
        await c.type('#phone', '9123456789');
        return c.doc.getElementById('phone').value === '+7(912)-345-67-89';
      } },

    { title: 'ФИО латиницей отклоняется',
      hint: '«Ivan Petrov» → ошибка под полем fio, пользователь не создан.',
      test: async function (c) {
        c.ls.del(USERS); c.ls.del(SESSION);
        await c.reload();
        await fill(c, { fio: 'Ivan Petrov' });
        await c.submit('#reg-form');
        return err(c, 'fio').length > 0 && users(c).length === 0;
      } },

    { title: 'Неверный email отклоняется',
      hint: '«test@» → ошибка под полем email.',
      test: async function (c) {
        await fill(c, { email: 'test@' });
        await c.submit('#reg-form');
        return err(c, 'email').length > 0;
      } },

    { title: 'Короткий пароль отклоняется',
      hint: '«abc» → ошибка под полем password (≥8, буквы и цифры).',
      test: async function (c) {
        await fill(c, { password: 'abc', password2: 'abc' });
        await c.submit('#reg-form');
        return err(c, 'password').length > 0;
      } },

    { title: 'Пароли не совпадают → ошибка',
      hint: 'password2 отличается → ошибка под полем password2.',
      test: async function (c) {
        await fill(c, { password2: 'parol9999' });
        await c.submit('#reg-form');
        return err(c, 'password2').length > 0;
      } },

    { title: 'Успешная регистрация: пользователь в localStorage',
      hint: "Валидные данные → запись в 'kitis-de:users' + сообщение в #reg-success.",
      test: async function (c) {
        await fill(c);
        await c.submit('#reg-form');
        var u = users(c);
        return u.length === 1 && u[0].email === 'test@example.com' &&
          c.text('#reg-success').trim().length > 0;
      } },

    { title: 'Повторный email отклоняется',
      hint: 'Тот же email ещё раз → ошибка под полем email, второй записи нет.',
      test: async function (c) {
        await fill(c);
        await c.submit('#reg-form');
        return err(c, 'email').length > 0 && users(c).length === 1;
      } },

    { title: 'Вход с неверным паролем: общая ошибка',
      hint: '#login-error = «Неверный e-mail или пароль» — одинаковая для «нет email» и «не тот пароль».',
      test: async function (c) {
        await c.type('#login-email', 'test@example.com');
        await c.type('#login-password', 'wrongpass1');
        await c.submit('#login-form');
        return /Неверный e-mail или пароль/.test(c.text('#login-error'));
      } },

    { title: 'Успешный вход: сессия в localStorage',
      hint: "Верный пароль → 'kitis-de:session' содержит email.",
      test: async function (c) {
        await c.type('#login-email', 'test@example.com');
        await c.type('#login-password', 'parol1234');
        await c.submit('#login-form');
        return (c.ls.get(SESSION) || '').indexOf('test@example.com') >= 0;
      } }
  ]
});
