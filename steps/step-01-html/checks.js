/* Шаг 01 · проверки семантического HTML. Контракт — в README.md. */
runChecks({
  page: 'index.html',
  checks: [
    { title: 'Язык страницы — русский (lang="ru")',
      hint: 'Добавь <html lang="ru">.',
      test: function (c) { return c.doc.documentElement.getAttribute('lang') === 'ru'; } },

    { title: 'Кодировка UTF-8 объявлена',
      hint: '<meta charset="utf-8"> в <head>.',
      test: function (c) {
        var m = c.doc.querySelector('meta[charset]');
        return !!m && m.getAttribute('charset').toLowerCase().replace('-', '') === 'utf8';
      } },

    { title: 'Заголовок вкладки содержит «Расписание»',
      hint: '<title>Расписание ИСр24-1 · среда</title>.',
      test: function (c) { return /расписание/i.test(c.doc.title); } },

    { title: 'Есть meta viewport',
      hint: '<meta name="viewport" content="width=device-width, initial-scale=1">.',
      test: function (c) { return c.exists('meta[name="viewport"]'); } },

    { title: 'Ровно один <h1> с названием группы',
      hint: 'В header один <h1>Расписание группы ИСр24-1</h1>.',
      test: function (c) { var h = c.all('h1'); return h.length === 1 && /ИСр24-1/.test(h[0].textContent); } },

    { title: 'Каркас страницы: header, main, footer',
      hint: 'Шапка — <header>, содержание — <main>, подвал — <footer>.',
      test: function (c) { return c.exists('header') && c.exists('main') && c.exists('footer'); } },

    { title: 'День — секция с заголовком «Среда, 18 ноября»',
      hint: '<section> внутри main, внутри <h2>Среда, 18 ноября</h2>.',
      test: function (c) {
        return c.all('main section, main article').some(function (s) {
          var h = s.querySelector('h2');
          return h && /сред/i.test(h.textContent) && /18/.test(h.textContent) && /ноябр/.test(h.textContent);
        });
      } },

    { title: 'Пары — нумерованный список <ol> из трёх <li>',
      hint: 'Порядок пар важен → <ol>, каждая пара — <li>.',
      test: function (c) {
        return c.all('main ol').some(function (o) { return o.querySelectorAll(':scope > li').length === 3; });
      } },

    { title: 'Все три предмета среды на месте',
      hint: 'Графический дизайн и мультимедиа, Экономика отрасли, Физическая культура.',
      test: function (c) {
        var t = c.text('main');
        return ['Графический дизайн и мультимедиа', 'Экономика отрасли', 'Физическая культура']
          .every(function (s) { return t.indexOf(s) >= 0; });
      } },

    { title: 'Преподаватели и аудитории на месте',
      hint: 'Морылёв К.С. (403), Брускина Н.И. (109м), Чертищев В.А. (Сп. зал 3).',
      test: function (c) {
        var t = c.text('main');
        return ['Морылёв', 'Брускина', 'Чертищев', '403', '109м', 'Сп. зал 3']
          .every(function (s) { return t.indexOf(s) >= 0; });
      } },

    { title: 'Время пар в тегах <time> (минимум 3)',
      hint: '<time>08:30</time>–<time>10:00</time> внутри каждой пары.',
      test: function (c) { return c.all('main time').length >= 3; } },

    { title: 'Таблица звонков: thead + tbody, 6 строк пар',
      hint: '<table><thead><tr><th>…</th></tr></thead><tbody>6 строк вт–сб</tbody></table>.',
      test: function (c) {
        return c.all('table').some(function (t) {
          return t.querySelector('thead th') &&
            t.querySelectorAll('tbody tr').length >= 6 &&
            /08:30/.test(t.textContent) && /10:00/.test(t.textContent);
        });
      } },

    { title: 'Чистый HTML: без стилей и скриптов',
      hint: 'Шаг 1 — только разметка. Убери <style>, style="…", <link rel="stylesheet">, <script>.',
      test: function (c) {
        return !c.exists('style') && !c.exists('link[rel="stylesheet"]') &&
          !c.exists('script') && c.all('[style]').length === 0;
      } }
  ]
});
