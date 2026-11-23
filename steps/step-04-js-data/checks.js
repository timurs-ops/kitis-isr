/* Шаг 04 · проверки рендера из данных. Контракт — в README.md.
 * SCHEDULE доступен здесь (check.html подключает ../../data/schedule.js). */
runChecks({
  page: 'index.html',
  checks: [
    { title: 'renderDay — глобальная функция',
      hint: 'function renderDay(i){…} в script.js, подключённом обычным тегом <script src> (не type="module").',
      test: function (c) { return typeof c.win.renderDay === 'function'; } },

    { title: 'Контейнер #app есть',
      hint: '<div id="app"></div> в index.html.',
      test: function (c) { return c.exists('#app'); } },

    { title: 'При открытии — понедельник, 3 карточки',
      hint: 'В конце script.js вызови renderDay(0). В понедельнике 3 занятия (кураторский + 2 пары).',
      test: function (c) {
        return /Понедельник/.test(c.text('#app')) && c.all('#app .lesson-card').length === 3;
      } },

    { title: 'Кураторский час со значком «К»',
      hint: 'В .lesson-num выводи l.badge: у первого занятия понедельника он равен «К».',
      test: function (c) {
        return c.all('#app .lesson-num').some(function (el) { return el.textContent.trim() === 'К'; });
      } },

    { title: 'Данные понедельника на месте',
      hint: 'Разговоры о важном (Шевченко П.С., 203), Графический дизайн и мультимедиа (403).',
      test: function (c) {
        var t = c.text('#app');
        return ['Разговоры о важном', 'Шевченко', 'Графический дизайн', '403'].every(function (s) { return t.indexOf(s) >= 0; });
      } },

    { title: 'renderDay(2) → среда: 3 карточки, Экономика отрасли, 109м',
      hint: 'Функция должна работать для любого индекса, а не только для понедельника.',
      test: async function (c) {
        c.win.renderDay(2);
        await c.sleep(60);
        var t = c.text('#app');
        return /Среда/.test(t) && c.all('#app .lesson-card').length === 3 &&
          t.indexOf('Экономика отрасли') >= 0 && t.indexOf('109м') >= 0;
      } },

    { title: 'renderDay(4) → пятница: все 3 пары «Дистант»',
      hint: 'room === null → текст «Дистант». У пятницы все пары без аудитории.',
      test: async function (c) {
        c.win.renderDay(4);
        await c.sleep(60);
        var cards = c.all('#app .lesson-card');
        return cards.length === 3 && cards.every(function (el) { return el.textContent.indexOf('Дистант') >= 0; });
      } },

    { title: 'renderDay(6) → воскресенье: «Пар нет»',
      hint: 'lessons пуст → сообщение «Пар нет», без карточек.',
      test: async function (c) {
        c.win.renderDay(6);
        await c.sleep(60);
        return /Пар нет/.test(c.text('#app'));
      } },

    { title: 'Количество карточек совпадает с данными (все 7 дней)',
      hint: 'Рендер должен быть полностью управляемым данными: сколько lessons — столько карточек.',
      test: async function (c) {
        for (var i = 0; i < SCHEDULE.days.length; i++) {
          c.win.renderDay(i);
          await c.sleep(30);
          if (c.all('#app .lesson-card').length !== SCHEDULE.days[i].lessons.length) return false;
        }
        return true;
      } },

    { title: 'Без document.write',
      hint: 'document.write устарел и ломает страницу. Используй innerHTML.',
      test: async function (c) {
        var r = await fetch('script.js');
        var t = await r.text();
        return t.indexOf('document.write') < 0;
      } }
  ]
});
