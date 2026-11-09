// STRATA — site behaviour
(function () {
  'use strict';
  var mobile = window.matchMedia('(max-width: 760px)');

  // Year in footer
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('open', open);
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  // Work filters + "show all"
  var grid = document.getElementById('work-grid');
  if (grid) {
    var items = Array.prototype.slice.call(grid.querySelectorAll('.work-item'));
    var chips = Array.prototype.slice.call(document.querySelectorAll('.chip[data-filter]'));
    var more = document.getElementById('show-more');
    var total = document.getElementById('total-count');
    var state = { filter: 'all', expanded: false };

    chips.forEach(function (chip) {
      var f = chip.getAttribute('data-filter');
      var n = f === 'all' ? items.length : items.filter(function (it) { return it.getAttribute('data-cat') === f; }).length;
      var c = chip.querySelector('.count');
      if (c) c.textContent = String(n);
      chip.addEventListener('click', function () {
        state.filter = f; state.expanded = false;
        chips.forEach(function (x) { x.setAttribute('aria-pressed', x === chip ? 'true' : 'false'); });
        render();
      });
    });
    if (total) total.textContent = String(items.length);
    if (more) more.addEventListener('click', function () { state.expanded = true; render(); });

    function render() {
      var limit = mobile.matches ? 8 : 12;
      var shown = 0;
      items.forEach(function (it) {
        var match = state.filter === 'all' || it.getAttribute('data-cat') === state.filter;
        var capped = state.filter === 'all' && !state.expanded && shown >= limit;
        var visible = match && !capped;
        it.hidden = !visible;
        if (visible) shown++;
      });
      if (more) more.hidden = !(state.filter === 'all' && !state.expanded && items.length > limit);
    }
    render();
    mobile.addEventListener('change', render);
  }

  // Services: cards on desktop, accordion on phones
  var services = Array.prototype.slice.call(document.querySelectorAll('.service'));
  function layoutServices() {
    services.forEach(function (d, i) { d.open = mobile.matches ? i === 0 : true; });
  }
  services.forEach(function (d) {
    d.querySelector('summary').addEventListener('click', function (e) {
      if (!mobile.matches) { e.preventDefault(); return; }
      // one open at a time
      if (!d.open) services.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
  layoutServices();
  mobile.addEventListener('change', layoutServices);

  // Contact form (Formspree or any endpoint that accepts form posts and returns JSON)
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  function say(msg, kind) { if (!status) return; status.textContent = msg; status.className = 'form-status ' + (kind || ''); }
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = null;
      ['c-name', 'c-email', 'c-msg'].forEach(function (id) {
        var el = document.getElementById(id);
        var ok = el.value.trim() !== '' && (el.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
        el.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !bad) bad = el;
      });
      if (bad) { say('Please fill in your name, a valid email and a short message.', 'err'); bad.focus(); return; }
      if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
        say('The form isn’t connected yet. Please email us directly in the meantime.', 'err');
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; say('Sending…');
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('bad status');
          form.reset();
          say('Thanks! Your message is on its way. We’ll be in touch soon.', 'ok');
        })
        .catch(function () { say('Something went wrong. Please try again or email us directly.', 'err'); })
        .then(function () { btn.disabled = false; });
    });
  }
})();
