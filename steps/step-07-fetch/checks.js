/* Шаг 07 · проверки fetch и состояний. Контракт — в README.md. */
var REAL = '../../data/schedule.json';

function retryVisible(c) {
  var b = c.doc.getElementById('retry');
  return !!b && !b.hidden && b.offsetParent !== null;
}

runChecks({
  page: 'index.html',
  checks: [
    { title: 'loadSchedule — глобальная функция',
      hint: 'async function loadSchedule(url){…} в script.js, подключённом обычным тегом (не module).',
      test: function (c) { return typeof c.win.loadSchedule === 'function'; } },

    { title: 'Автозагрузка: карточки понедельника в #app',
      hint: 'При открытии вызывается loadSchedule(DATA_URL), после успеха рисуется понедельник (3 карточки).',
      test: async function (c) {
        return c.until(function () { return c.all('#app .lesson-card').length >= 3; }, 3000);
      } },

    { title: 'Статус «Загрузка…» исчез после загрузки',
      hint: 'При успехе #status скрыт или «Готово».',
      test: function (c) { return !/Загрузка/.test(c.text('#status')); } },

    { title: 'empty.json → «Пар нет»',
      hint: 'days: [] → состояние «Пар нет» в #status.',
      test: async function (c) {
        await c.win.loadSchedule('../../data/empty.json');
        return c.until(function () { return /Пар нет/.test(c.text('#status')); }, 2000);
      } },

    { title: 'missing.json → «Не удалось загрузить расписание»',
      hint: '404 → !response.ok → throw → catch → сообщение об ошибке. Не забудь проверить response.ok!',
      test: async function (c) {
        await c.win.loadSchedule('../../data/missing.json');
        return c.until(function () { return /Не удалось загрузить/.test(c.text('#status')); }, 2000);
      } },

    { title: 'Кнопка «Повторить» видна при ошибке',
      hint: '#retry: hidden снимается в catch; клик повторяет последний url.',
      test: function (c) { return retryVisible(c); } },

    { title: 'Повторная загрузка реальных данных → карточки снова',
      hint: 'После ошибки loadSchedule(реальный адрес) должен вернуть страницу в рабочее состояние.',
      test: async function (c) {
        await c.win.loadSchedule(REAL);
        return c.until(function () { return c.all('#app .lesson-card').length >= 3; }, 3000);
      } }
  ]
});
