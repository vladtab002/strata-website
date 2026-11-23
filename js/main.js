// STRATA — site behaviour
(function () {
  'use strict';
  var mobile = window.matchMedia('(max-width: 760px)');
  var RO = (document.documentElement.lang || '').toLowerCase().indexOf('ro') === 0;
  var T = RO ? {
    open: 'Deschide meniul', close: 'Închide meniul',
    invalid: 'Te rugăm să completezi numele, o adresă de email validă și un scurt mesaj.',
    notConnected: 'Formularul nu este încă activ. Te rugăm să ne scrii direct pe email.',
    more: 'Vezi mai multe', less: 'Vezi mai puține',
    sending: 'Se trimite…', ok: 'Mulțumim! Mesajul tău a fost trimis. Revenim cu un răspuns în curând.',
    err: 'Ceva n-a mers. Încearcă din nou sau scrie-ne direct pe email.'
  } : {
    open: 'Open menu', close: 'Close menu',
    invalid: 'Please fill in your name, a valid email and a short message.',
    notConnected: 'The form isn’t connected yet. Please email us directly in the meantime.',
    more: 'Show more', less: 'Show less',
    sending: 'Sending…', ok: 'Thanks! Your message is on its way. We’ll be in touch soon.',
    err: 'Something went wrong. Please try again or email us directly.'
  };

  // Year in footer
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? T.close : T.open);
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
    if (more) more.addEventListener('click', function () {
      var collapsing = state.expanded;
      state.expanded = !state.expanded;
      render();
      // After collapsing, the page gets shorter: bring the button back into view
      if (collapsing) more.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });

    // Every filter shows at most this many pieces until "Show more" is pressed
    var LIMIT = 10;

    function render() {
      var matching = 0, shown = 0;
      items.forEach(function (it) {
        var match = state.filter === 'all' || it.getAttribute('data-cat') === state.filter;
        if (match) matching++;
        var visible = match && (state.expanded || shown < LIMIT);
        it.hidden = !visible;
        if (visible) shown++;
      });
      if (more) {
        // The button only appears when the selected filter has more pieces than the limit
        more.hidden = matching <= LIMIT;
        more.textContent = state.expanded ? T.less : T.more;
        more.setAttribute('aria-expanded', state.expanded ? 'true' : 'false');
      }
    }
    render();
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
      if (bad) { say(T.invalid, 'err'); bad.focus(); return; }
      if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
        say(T.notConnected, 'err');
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; say(T.sending);
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('bad status');
          form.reset();
          say(T.ok, 'ok');
        })
        .catch(function () { say(T.err, 'err'); })
        .then(function () { btn.disabled = false; });
    });
  }
})();
