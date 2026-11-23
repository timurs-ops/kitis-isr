/* Шаг 07 · fetch + состояния. Контракт — в README.md (там же каркас loadSchedule).
 * Рендер карточек перенеси из шага 4/5. */

var DATA_URL = '../../data/schedule.json';
var lastUrl = DATA_URL;
var statusEl = document.getElementById('status');
var retryEl = document.getElementById('retry');
var appEl = document.getElementById('app');

async function loadSchedule(url) {
  lastUrl = url;
  // TODO 1: статус «Загрузка…», скрыть retry, очистить #app
  // TODO 2: fetch(url); если !response.ok → throw new Error('HTTP ' + response.status)
  // TODO 3: var data = await response.json();
  // TODO 4: пусто (data.days пуст или во всех днях lessons пусты) → статус «Пар нет», выход
  // TODO 5: успех → отрисуй понедельник в #app (.lesson-card, .lesson-num), статус скрыть/«Готово»
  // TODO 6: catch → статус «Не удалось загрузить расписание», retry.hidden = false
}

/* Повтор — последний адрес (готово) */
retryEl.addEventListener('click', function () { loadSchedule(lastUrl); });

/* Автозагрузка при открытии (готово) */
loadSchedule(DATA_URL);
