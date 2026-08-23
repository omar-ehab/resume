/* ===================================================================
   Omar Ehab — Portfolio
   Vanilla JS, zero dependencies. Progressive-enhancement friendly.
   =================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* ---------- Theme toggle (persisted, respects system) ----------
     The initial theme is set by an inline script in <head> to avoid FOUC. */
  var themeBtn = $('#theme-toggle');
  function syncTheme() {
    var light = root.getAttribute('data-theme') === 'light';
    if (themeBtn) themeBtn.setAttribute('aria-pressed', light ? 'true' : 'false');
    // Keep the browser address-bar / status-bar colour in sync with the *active*
    // theme (the media-scoped tags only follow the OS, not a manual toggle).
    var m = doc.getElementById('theme-color-active');
    if (!m) { m = doc.createElement('meta'); m.setAttribute('name', 'theme-color'); m.id = 'theme-color-active'; doc.head.appendChild(m); }
    m.setAttribute('content', light ? '#ffffff' : '#0b0d10');
  }
  syncTheme();
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncTheme();
    });
  }

  /* ---------- Mobile navigation ---------- */
  var menu = $('#nav-menu');
  var backdrop = $('#nav-backdrop');
  var navToggle = $('#nav-toggle');
  function openNav(open) {
    if (!menu) return;
    menu.classList.toggle('open', open);
    if (backdrop) backdrop.classList.toggle('open', open);
    if (navToggle) navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    doc.body.style.overflow = open ? 'hidden' : '';
  }
  if (navToggle) navToggle.addEventListener('click', function () { openNav(true); });
  var navClose = $('#nav-close');
  if (navClose) navClose.addEventListener('click', function () { openNav(false); });
  if (backdrop) backdrop.addEventListener('click', function () { openNav(false); });
  $$('.nav__link').forEach(function (l) { l.addEventListener('click', function () { openNav(false); }); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') openNav(false); });

  /* ---------- Header shadow + scroll-up visibility ---------- */
  var header = $('#header');
  var scrollUp = $('#scroll-up');
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 24);
    if (scrollUp) scrollUp.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  requestAnimationFrame(onScroll);

  /* ---------- Scroll-spy: highlight active nav link ---------- */
  var sections = $$('main section[id]');
  var navLinks = $$('.nav__link');
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.getAttribute('id');
          navLinks.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal-on-scroll ---------- */
  var reveals = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { ro.observe(el); });
    // Fail-safe: reveal anything already in the viewport on the next frame,
    // so above-the-fold content never stays hidden if the observer is delayed.
    requestAnimationFrame(function () {
      var vh = window.innerHeight;
      var visible = reveals.filter(function (el) { return el.getBoundingClientRect().top < vh; });
      visible.forEach(function (el) { el.classList.add('in'); ro.unobserve(el); });
    });
  }

  /* ---------- Animated counters ---------- */
  var counters = $$('[data-count]');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); obs.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-count') + (c.getAttribute('data-suffix') || ''); });
  }

  /* ---------- Testimonials: dots synced to scroll ---------- */
  var tTrack = $('#t-track');
  var tDots = $('#t-dots');
  if (tTrack && tDots) {
    var cards = $$('.tcard', tTrack);
    cards.forEach(function (_, i) {
      var b = doc.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', function () {
        var c = cards[i];
        tTrack.scrollTo({ left: c.offsetLeft - (tTrack.clientWidth - c.clientWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
      tDots.appendChild(b);
    });
    var dotBtns = $$('button', tDots);
    var raf;
    tTrack.addEventListener('scroll', function () {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var center = tTrack.scrollLeft + tTrack.clientWidth / 2;
        var best = 0, bestDist = Infinity;
        cards.forEach(function (c, i) {
          var cc = c.offsetLeft + c.clientWidth / 2;
          var d = Math.abs(cc - center);
          if (d < bestDist) { bestDist = d; best = i; }
        });
        dotBtns.forEach(function (d, i) { d.classList.toggle('active', i === best); });
      });
    }, { passive: true });
  }

  /* ---------- Contact form: success toast via redirect param ---------- */
  var toast = $('#toast');
  function showToast(msg) {
    if (!toast) return;
    if (msg) { var m = $('#toast-msg'); if (m) m.textContent = msg; }
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 4500);
  }
  if (/[?&]thanks=true/.test(window.location.search)) {
    showToast('Message sent — thank you! I will get back to you soon.');
    if (window.history.replaceState) {
      window.history.replaceState({}, doc.title, window.location.pathname + window.location.hash);
    }
  }

  /* ---------- Footer year ---------- */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

})();
