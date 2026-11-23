# Шаг 04 · Рендер дня из данных (JS)

**Цель:** перестать вписывать пары руками. Данные лежат в `data/schedule.js` (подключается как обычный
скрипт и даёт глобальный объект `window.SCHEDULE`), твой `script.js` рисует **любой** день.

## Контракт (по нему работает автопроверка — соблюдай точно)

- `function renderDay(dayIndex)` — **глобальная** функция. Подключай `script.js` обычным тегом
  `<script src="script.js"></script>`, **не** `type="module"` (иначе функция не попадёт в window).
- Рисует в `#app`: заголовок дня (`weekday`) + карточки `.lesson-card` с номером `.lesson-num`.
- В `.lesson-num` — значение `badge` из данных («К» для кураторского часа, «1»…«6» для пар).
- `room === null` → показывай текст **«Дистант»**.
- Пустой день (воскресенье, `lessons: []`) → текст **«Пар нет»**.
- При открытии страницы показан **понедельник**: `renderDay(0)`.
- Никакого `document.write`.

## Данные

Открой [`data/schedule.js`](../../data/schedule.js) и [`data/README.md`](../../data/README.md).
Коротко: `SCHEDULE.days` — массив из 7 дней; у дня есть `weekday`, `date`, `lessons[]`;
у пары — `badge`, `start`, `end`, `subject`, `teacher`, `room` (строка или `null`), `color`.

## Подсказки (порядок действий)

1. В `renderDay`: `var day = SCHEDULE.days[dayIndex];`
2. Если `!day || !day.lessons.length` → вставь в `#app` сообщение «Пар нет» и выйди.
3. Собери HTML строкой через шаблонные литералы:
   ```js
   var cards = day.lessons.map(function (l) {
     var room = l.room === null ? 'Дистант' : 'ауд. ' + l.room;
     return '<div class="lesson-card">' +
       '<span class="lesson-num">' + l.badge + '</span>' +
       '<div><div class="lesson-subject">' + l.subject + '</div>' +
       '<div class="lesson-meta">' + l.start + '–' + l.end + ' · ' + l.teacher + ' · ' + room + '</div></div>' +
       '</div>';
   }).join('');
   ```
4. `document.getElementById('app').innerHTML = '<h2 class="day-title">' + day.weekday + '</h2>' + cards;`
5. В конце файла — вызов `renderDay(0);`.

## Проверка

`check.html`: **10 проверок** — чекер сам вызывает твой `renderDay` для разных дней и сверяет с данными.

## Зачёт (10 баллов)

- Автопроверка — 4.
- Ручные — 4: данные не вшиты в код (меняешь `schedule.js` — страница меняется); один шаблон на все дни;
  консоль чистая; код читаемый (осмысленные имена, без копипасты трёх почти одинаковых кусков).
- Защита — 2: добавь при эксперте вывод времени пары в карточку; объясни, что делает `map` и `join`.

**Бонус (+1):** раскрась карточки данными — `style="--subject-color:' + l.color + '"` и подключи
свой CSS из шага 2 (полоска и номер в цвет предмета).

## Ресурсы

[learn.javascript.ru](https://learn.javascript.ru): «Массивы», «Объекты», «Шаблонные строки», «DOM-навигация».
