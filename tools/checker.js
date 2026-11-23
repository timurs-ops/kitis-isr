/* КИТиС-ДЭ · движок автопроверки.
 * Использование: на странице check.html подключить этот файл, затем checks.js шага,
 * который вызывает runChecks({ page: 'index.html', checks: [...] }).
 * Каждая проверка: { title, hint, test(ctx) } — test возвращает true (зачёт) или false/бросает Error.
 * Работает только через локальный сервер (Live Server), не через file://. */
(function () {
  'use strict';

  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  window.runChecks = async function (opts) {
    var frame = document.getElementById(opts.frame || 'frame');
    var listEl = document.getElementById(opts.list || 'checks');
    var sumEl = document.getElementById(opts.summary || 'summary');
    var verdictEl = document.getElementById(opts.verdict || 'verdict');
    var checks = opts.checks || [];
    var page = opts.page || 'index.html';
    var currentQuery = opts.query || '';

    listEl.innerHTML = '';
    var rows = checks.map(function (c, i) {
      var li = document.createElement('li');
      li.className = 'check pending';
      var mark = document.createElement('span');
      mark.className = 'mark';
      mark.textContent = '…';
      var box = document.createElement('div');
      var b = document.createElement('b');
      b.textContent = (i + 1) + '. ' + c.title;
      var small = document.createElement('small');
      box.appendChild(b);
      box.appendChild(small);
      li.appendChild(mark);
      li.appendChild(box);
      listEl.appendChild(li);
      return li;
    });

    function warn(html) {
      sumEl.textContent = '— / ' + checks.length;
      verdictEl.className = 'verdict warn';
      verdictEl.innerHTML = html;
      rows.forEach(function (r) {
        r.className = 'check skip';
        r.querySelector('.mark').textContent = '—';
      });
    }

    if (location.protocol === 'file:') {
      warn('Страница открыта как файл (<code>file://</code>), проверке нужен локальный сервер. ' +
        'Открой <b>корень репозитория</b> в VS Code, нажми <b>Go Live</b> (расширение Live Server) ' +
        'и открой этот check.html по адресу вида <code>http://127.0.0.1:5500/...</code>.');
      return;
    }

    function load(query) {
      if (query != null) currentQuery = query;
      return new Promise(function (resolve) {
        frame.onload = function () { setTimeout(resolve, 150); };
        frame.src = page + currentQuery;
      });
    }

    var ctx = {
      get doc() { return frame.contentDocument; },
      get win() { return frame.contentWindow; },
      frame: frame,
      sleep: sleep,
      reload: function (q) { return load(q == null ? currentQuery : q); },
      exists: function (sel) { return !!(this.doc && this.doc.querySelector(sel)); },
      all: function (sel) { return this.doc ? Array.prototype.slice.call(this.doc.querySelectorAll(sel)) : []; },
      text: function (sel) { var el = this.doc && this.doc.querySelector(sel); return el ? el.textContent : ''; },
      click: function (sel) {
        var el = this.doc && this.doc.querySelector(sel);
        if (!el) throw new Error('нет элемента ' + sel);
        el.click();
        return sleep(80);
      },
      type: function (sel, val) {
        var el = this.doc && this.doc.querySelector(sel);
        if (!el) throw new Error('нет поля ' + sel);
        el.value = val;
        el.dispatchEvent(new this.win.Event('input', { bubbles: true }));
        return sleep(30);
      },
      submit: function (sel) {
        var f = this.doc && this.doc.querySelector(sel);
        if (!f) throw new Error('нет формы ' + sel);
        f.dispatchEvent(new this.win.Event('submit', { bubbles: true, cancelable: true }));
        return sleep(80);
      },
      width: function (px) { frame.style.width = px ? px + 'px' : ''; return sleep(250); },
      css: function (sel, prop) {
        var el = this.doc && this.doc.querySelector(sel);
        if (!el) throw new Error('нет элемента ' + sel);
        return this.win.getComputedStyle(el).getPropertyValue(prop);
      },
      cssOf: function (el, prop) { return this.win.getComputedStyle(el).getPropertyValue(prop); },
      rect: function (sel) {
        var el = this.doc && this.doc.querySelector(sel);
        if (!el) throw new Error('нет элемента ' + sel);
        return el.getBoundingClientRect();
      },
      ls: {
        get: function (k) { return frame.contentWindow.localStorage.getItem(k); },
        set: function (k, v) { frame.contentWindow.localStorage.setItem(k, v); },
        del: function (k) { frame.contentWindow.localStorage.removeItem(k); }
      },
      until: async function (fn, ms) {
        var t0 = Date.now();
        while (Date.now() - t0 < (ms || 2500)) {
          try { if (fn()) return true; } catch (e) { /* ещё не готово */ }
          await sleep(80);
        }
        return false;
      }
    };

    await load(currentQuery);
    if (!frame.contentDocument) {
      warn('Не удалось прочитать страницу в рамке. Убедись, что открыл check.html через Live Server, ' +
        'а index.html лежит рядом и не сломан (открой его отдельно и проверь консоль).');
      return;
    }

    var passed = 0;
    for (var i = 0; i < checks.length; i++) {
      var c = checks[i], row = rows[i];
      row.className = 'check running';
      var ok = false, err = '';
      try { ok = await c.test(ctx); } catch (e) { ok = false; err = e && e.message ? e.message : String(e); }
      if (ok === true) {
        passed++;
        row.className = 'check pass';
        row.querySelector('.mark').textContent = '✓';
        row.querySelector('small').textContent = '';
      } else {
        row.className = 'check fail';
        row.querySelector('.mark').textContent = '✗';
        row.querySelector('small').textContent = (err ? 'Ошибка: ' + err + '. ' : '') + (c.hint || '');
      }
      sumEl.textContent = passed + ' / ' + checks.length;
      await sleep(10);
    }

    verdictEl.className = 'verdict ' + (passed === checks.length ? 'ok' : 'bad');
    verdictEl.innerHTML = passed === checks.length
      ? 'Все проверки прошли ✓ Заполни <code>SUBMISSION.md</code>, закоммить и отправь ссылку. Впереди — защита: будь готов объяснить каждую строку и сделать живую правку.'
      : 'Пока не всё. Почини красные пункты и нажми «Перезапустить». Если уверен, что проверка ошибается, — покажи преподавателю, разберём.';
  };
})();