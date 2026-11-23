/* Шаг 05 · проверки событий, избранного и таймера. Контракт — в README.md. */
var FAV = 'kitis-de:fav';

runChecks({
  page: 'index.html',
  checks: [
    { title: 'Семь кнопок .day-btn с data-day 0–6',
      hint: 'Кнопки уже в index.html — не удаляй их; обработчики вешаешь ты.',
      test: function (c) {
        var b = c.all('.day-btn');
        var s = new Set(b.map(function (el) { return el.dataset.day; }));
        return b.length === 7 && s.size === 7;
      } },

    { title: 'Клик по «Ср» → кнопка активна, среда в #app',
      hint: 'selectDay(2): .active на кнопке + renderDay(2).',
      test: async function (c) {
        await c.click('[data-day="2"]');
        var b = c.doc.querySelector('[data-day="2"]');
        return b.classList.contains('active') && /Среда/.test(c.text('#app'));
      } },

    { title: 'Клик по «Пт» → .active переехал, пятница в #app',
      hint: 'Снимай .active со всех кнопок, потом ставь нажатой.',
      test: async function (c) {
        await c.click('[data-day="4"]');
        return c.doc.querySelector('[data-day="4"]').classList.contains('active') &&
          !c.doc.querySelector('[data-day="2"]').classList.contains('active') &&
          /Пятница/.test(c.text('#app'));
      } },

    { title: 'Избранное: клик → localStorage + aria-pressed="true"',
      hint: "localStorage.setItem('kitis-de:fav', 'ИСр24-1'); кнопка #fav-btn обновляет aria-pressed.",
      test: async function (c) {
        c.ls.del(FAV);
        await c.reload();
        await c.click('#fav-btn');
        return c.ls.get(FAV) === 'ИСр24-1' &&
          c.doc.getElementById('fav-btn').getAttribute('aria-pressed') === 'true';
      } },

    { title: 'Избранное переживает перезагрузку',
      hint: 'При загрузке читай localStorage и восстанавливай aria-pressed/текст кнопки.',
      test: async function (c) {
        await c.reload();
        return c.ls.get(FAV) === 'ИСр24-1' &&
          c.doc.getElementById('fav-btn').getAttribute('aria-pressed') === 'true';
      } },

    { title: 'Повторный клик убирает из избранного',
      hint: 'Ключ удаляется (removeItem), aria-pressed="false".',
      test: async function (c) {
        await c.click('#fav-btn');
        return !c.ls.get(FAV) &&
          c.doc.getElementById('fav-btn').getAttribute('aria-pressed') === 'false';
      } },

    { title: '?now=2026-11-18T10:30 → открыта среда',
      hint: 'Читай URLSearchParams(location.search).get("now"), находи день по дате и открывай его.',
      test: async function (c) {
        await c.reload('?now=2026-11-18T10:30');
        return c.doc.querySelector('[data-day="2"]').classList.contains('active') &&
          /Среда/.test(c.text('#app'));
      } },

    { title: 'Текущая пара подсвечена: .current на «Экономике отрасли»',
      hint: 'В 10:30 идёт 2-я пара (10:10–11:40). Повесь класс .current на её .lesson-card.',
      test: function (c) {
        var el = c.doc.querySelector('.lesson-card.current');
        return !!el && el.textContent.indexOf('Экономика отрасли') >= 0;
      } },

    { title: 'Таймер: «До конца пары: 70 мин»',
      hint: 'N = Math.ceil(оставшихся секунд / 60). В 10:30 до 11:40 ровно 70 минут. Выводи в #timer.',
      test: function (c) { return /70/.test(c.text('#timer')); } }
  ]
});
