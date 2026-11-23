/* Шаг 05 · дни, избранное, таймер. Контракт — в README.md.
 * Перенеси сюда свой renderDay из шага 4 (данные SCHEDULE уже подключены в index.html). */

var FAV_KEY = 'kitis-de:fav';
var GROUP = 'ИСр24-1';

// TODO 1: renderDay(dayIndex) — из шага 4 (.lesson-card, .lesson-num = badge, «Дистант», «Пар нет»).

// TODO 2: selectDay(i): снять .active со всех .day-btn, поставить нужной, вызвать renderDay(i).

// TODO 3: клики по .day-btn: querySelectorAll + forEach + addEventListener('click', …).
//         Номер дня бери из btn.dataset.day (это строка → Number(...)).

// TODO 4: избранное:
//   клик по #fav-btn: если localStorage[FAV_KEY] === GROUP → removeItem, иначе setItem(FAV_KEY, GROUP);
//   обнови aria-pressed и текст кнопки («★ В избранном» / «☆ В избранное»);
//   при загрузке восстанови состояние из localStorage.

// TODO 5: время:
//   getNow(): ?now=YYYY-MM-DDTHH:MM из адреса → new Date(строка), иначе new Date();
//   при загрузке с ?now: открой день, чья date совпадает с датой now (сравнивай локальные
//   год-месяц-день, не toISOString — часовой пояс сдвинет дату);
//   tick(): сними .current со всех карточек; найди пару, где start <= сейчас < end
//   (переведи «ЧЧ:ММ» в минуты: h*60+m); повесь .current на её карточку;
//   #timer = 'До конца пары: ' + Math.ceil((конец - сейчас) / 60000) + ' мин';
//   setInterval(tick, 1000).

// TODO 6: старт: без ?now — selectDay(0); с ?now — день из now. Восстанови избранное. Запусти tick.
