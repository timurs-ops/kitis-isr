/* Шаг 02 · проверки карточки пары. Контракт — в README.md.
 * Цвета сравниваются через приведение к rgb(): переменная может быть записана как #hex,
 * а вычисленный стиль всегда приходит как rgb(...). */
function toRgb(v) {
  var d = document.createElement('div');
  d.style.color = v;
  document.body.appendChild(d);
  var c = getComputedStyle(d).color;
  d.remove();
  return c;
}

runChecks({
  page: 'index.html',
  checks: [
    { title: 'Подключён style.css, Bootstrap нет',
      hint: '<link rel="stylesheet" href="style.css">. Этот шаг — чистый CSS, без фреймворков.',
      test: function (c) { return c.exists('link[href*="style.css"]') && !c.exists('link[href*="bootstrap"]'); } },

    { title: 'Три карточки .lesson-card',
      hint: 'Три пары среды — три <div class="lesson-card">.',
      test: function (c) { return c.all('.lesson-card').length === 3; } },

    { title: 'Карточка — flex',
      hint: '.lesson-card { display: flex; }.',
      test: function (c) { return c.css('.lesson-card', 'display') === 'flex'; } },

    { title: 'У каждой карточки своя переменная --subject-color',
      hint: 'style="--subject-color:#c4b478" (или класс). У трёх карточек — три разных цвета.',
      test: function (c) {
        var vals = c.all('.lesson-card').map(function (el) { return c.cssOf(el, '--subject-color').trim(); });
        return vals.length === 3 &&
          vals.every(function (v) { return v.length > 0; }) &&
          new Set(vals).size === 3;
      } },

    { title: 'Полоска слева: не тоньше 4px, solid',
      hint: 'border-left: 5px solid var(--subject-color).',
      test: function (c) {
        return parseFloat(c.css('.lesson-card', 'border-left-width')) >= 4 &&
          c.css('.lesson-card', 'border-left-style') === 'solid';
      } },

    { title: 'Цвет полоски = цвет предмета (переменная)',
      hint: 'border-left-color должен брать var(--subject-color), а не фиксированный цвет.',
      test: function (c) {
        return c.all('.lesson-card').every(function (el) {
          var v = c.cssOf(el, '--subject-color').trim();
          return !!v && toRgb(v) === c.cssOf(el, 'border-left-color');
        });
      } },

    { title: 'Номер .lesson-num окрашен в цвет предмета',
      hint: '.lesson-num { color: var(--subject-color); }.',
      test: function (c) {
        return c.all('.lesson-card').every(function (el) {
          var num = el.querySelector('.lesson-num');
          var v = c.cssOf(el, '--subject-color').trim();
          return !!num && !!v && toRgb(v) === c.cssOf(num, 'color');
        });
      } },

    { title: 'Фон — линейный градиент к белому',
      hint: 'background: linear-gradient(90deg, оттенок 0%, оттенок-светлее 45%, #fff 100%). Оттенки — таблица README.',
      test: function (c) { return c.css('.lesson-card', 'background-image').indexOf('linear-gradient') >= 0; } },

    { title: 'Скругление углов ≥8px',
      hint: 'border-radius: 12px.',
      test: function (c) { return parseFloat(c.css('.lesson-card', 'border-radius')) >= 8; } },

    { title: 'Внутренние отступы и зазор между карточками',
      hint: 'padding: 14px 18px; контейнер .lessons с gap: 10px (или margin-bottom карточкам).',
      test: function (c) {
        if (parseFloat(c.css('.lesson-card', 'padding-left')) < 10) return false;
        var cards = c.all('.lesson-card');
        var a = cards[0].getBoundingClientRect();
        var b = cards[1].getBoundingClientRect();
        return b.top - a.bottom >= 8;
      } }
  ]
});
