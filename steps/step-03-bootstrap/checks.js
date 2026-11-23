/* Шаг 03 · проверки недели на Bootstrap. Контракт — в README.md.
 * .day-card — класс на колонках сетки (col-12 col-md-6 col-xl-4 day-card). */
runChecks({
  page: 'index.html',
  checks: [
    { title: 'Bootstrap подключён ЛОКАЛЬНЫМ файлом',
      hint: 'Скачай bootstrap.min.css в vendor/ и подключи <link href="vendor/bootstrap.min.css">. CDN на экзамене может не работать.',
      test: function (c) {
        return c.all('link[rel="stylesheet"]').some(function (l) {
          var h = l.getAttribute('href') || '';
          return h.indexOf('bootstrap') >= 0 && !/^https?:/i.test(h);
        });
      } },

    { title: 'Шапка .navbar',
      hint: '<nav class="navbar …"> с брендом «КИТиС · Расписание».',
      test: function (c) { return c.exists('.navbar'); } },

    { title: 'Навигация дней: .nav-tabs или .nav-pills, ≥6 пунктов',
      hint: '<ul class="nav nav-pills"> с 6 ссылками Пн–Сб.',
      test: function (c) {
        return c.exists('.nav-tabs, .nav-pills') &&
          c.all('.nav-tabs a, .nav-tabs button, .nav-pills a, .nav-pills button').length >= 6;
      } },

    { title: 'Контейнер .container',
      hint: 'Основное содержимое обёрнуто в <main class="container">.',
      test: function (c) { return c.exists('.container, .container-fluid'); } },

    { title: 'Сетка: .row и ≥6 колонок .day-card с col-*',
      hint: '<div class="row"> → 6× <div class="col-12 col-md-6 col-xl-4 day-card">.',
      test: function (c) {
        var cards = c.all('.day-card');
        return c.exists('.row') && cards.length >= 6 &&
          cards.every(function (el) { return /col-/.test(el.className); });
      } },

    { title: 'Таблица звонков .table с thead и tbody',
      hint: '<table class="table"> … thead + 6 строк tbody.',
      test: function (c) {
        return c.all('table.table').some(function (t) {
          return t.querySelector('thead th') && t.querySelectorAll('tbody tr').length >= 6;
        });
      } },

    { title: 'Есть meta viewport',
      hint: 'Без viewport адаптив на телефоне не работает.',
      test: function (c) { return c.exists('meta[name="viewport"]'); } },

    { title: 'Свои стили живы: style.css + карточки .lesson-card',
      hint: 'Скопируй style.css из шага 2, подключи после bootstrap, используй .lesson-card внутри дней.',
      test: function (c) { return c.exists('link[href*="style.css"]') && c.all('.lesson-card').length >= 1; } },

    { title: '360px: дни стопкой (одна колонка)',
      hint: 'col-12 на узком экране. Проверь классы колонок.',
      test: async function (c) {
        await c.width(360);
        var cards = c.all('.day-card').slice(0, 2);
        if (cards.length < 2) return false;
        var a = cards[0].getBoundingClientRect(), b = cards[1].getBoundingClientRect();
        return Math.abs(a.left - b.left) < 2;
      } },

    { title: '1280px: минимум два дня в ряд',
      hint: 'col-xl-4 (или col-md-6) на широком экране.',
      test: async function (c) {
        await c.width(1280);
        var cards = c.all('.day-card').slice(0, 2);
        var ok = false;
        if (cards.length >= 2) {
          var a = cards[0].getBoundingClientRect(), b = cards[1].getBoundingClientRect();
          ok = Math.abs(a.left - b.left) > 50 && Math.abs(a.top - b.top) < 2;
        }
        await c.width(0);
        return ok;
      } }
  ]
});
