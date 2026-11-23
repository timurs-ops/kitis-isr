# Шаг 07 · Загрузка JSON (fetch)

**Цель:** данные приходят по сети, а не лежат в подключённом скрипте. И сеть умеет подводить:
три состояния — **грузится / ошибка / пусто** — обязательны, как на настоящем сайте.

## Контракт (по нему работает автопроверка)

- `async function loadSchedule(url)` — **глобальная** (обычный `<script src>`, не module).
- При открытии страницы: `loadSchedule('../../data/schedule.json')`, после загрузки рисуем
  **понедельник** в `#app` (карточки `.lesson-card`, как в шагах 4–5).
- `#status`:
  - во время запроса — «Загрузка…»;
  - успех — скрыт или «Готово»;
  - пустые данные (`days: []` или все `lessons` пусты) — **«Пар нет»**;
  - ошибка — **«Не удалось загрузить расписание»**.
- `#retry` (кнопка, изначально `hidden`): показывается при ошибке; клик повторяет **последний** url.
- Внутри: `fetch(url)` → проверка `response.ok` (404 — это ошибка!) → `response.json()` → `try/catch`.

## Подсказка (каркас)

```js
async function loadSchedule(url) {
  lastUrl = url;
  status.textContent = 'Загрузка…';
  retry.hidden = true;
  try {
    var response = await fetch(url);
    if (!response.ok) throw new Error('HTTP ' + response.status);
    var data = await response.json();
    // пусто? → «Пар нет»; иначе отрисуй понедельник, статус убери
  } catch (e) {
    status.textContent = 'Не удалось загрузить расписание';
    retry.hidden = false;
  }
}
```

Рендер перенеси из шага 4/5. Данные те же: [`data/schedule.json`](../../data/schedule.json).
Для тестов есть [`data/empty.json`](../../data/empty.json) (пустая неделя), а `missing.json`
не существует специально — на нём проверяем ошибку.

## Проверка

`check.html`: **7 проверок** — чекер сам гоняет `loadSchedule` на реальном, пустом и битом адресе.

## Зачёт (10 баллов)

- Автопроверка — 4.
- Ручные — 4: все три состояния видны глазом; нет необработанных промисов (консоль чистая);
  `response.ok` проверяется; кнопка «Повторить» реально повторяет запрос.
- Защита — 2: покажи состояние ошибки (переименуй schedule.json на минуту); объясни, чем `fetch`
  отличается от `<script src>` и почему 404 не попадает в `catch` сам по себе.

## Ресурсы

[learn.javascript.ru/fetch](https://learn.javascript.ru/fetch) · [learn.javascript.ru: Promise](https://learn.javascript.ru/promise-basics)
