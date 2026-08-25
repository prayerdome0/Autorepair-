/* ============================================================
   SWDL Auto Repair — shared behaviour
   Auto-playing hero slideshow, testimonials, gallery, lightbox,
   mobile nav, reveal-on-scroll, mailto forms, back-to-top.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Announcement bar (dismissible) ---------- */
  var bar = document.getElementById('announceBar');
  if (bar) {
    var closed = false;
    try { closed = localStorage.getItem('swdl-announce') === '1'; } catch (e) {}
    if (closed) bar.remove();
    else {
      var closeBtn = bar.querySelector('.announce-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          bar.remove();
          try { localStorage.setItem('swdl-announce', '1'); } catch (e) {}
        });
      }
    }
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('no-scroll', open);
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  /* ---------- Auto-playing hero slideshow ---------- */
  document.querySelectorAll('[data-slideshow]').forEach(initSlideshow);

  function initSlideshow(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
    var dotsWrap = root.querySelector('[data-slideshow-dots]');
    var prevBtn = root.querySelector('[data-slideshow-prev]');
    var nextBtn = root.querySelector('[data-slideshow-next]');
    var progress = root.querySelector('[data-slideshow-progress]');
    var interval = parseInt(root.getAttribute('data-slideshow'), 10) || 5500;
    if (slides.length < 2) return;

    var current = 0;
    var timer = null;
    var paused = false;

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var b = document.createElement('button');
        b.className = 'hero-dot' + (i === 0 ? ' active' : '');
        b.type = 'button';
        b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        b.addEventListener('click', function () { go(i, true); });
        dotsWrap.appendChild(b);
      });
    }

    function render() {
      slides.forEach(function (s, i) { s.classList.toggle('active', i === current); });
      var dots = dotsWrap ? dotsWrap.children : [];
      for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('active', i === current);
      if (progress) {
        progress.style.animation = 'none';
        void progress.offsetWidth; /* restart CSS animation */
        progress.style.animation = 'heroProgress ' + interval + 'ms linear forwards';
      }
    }

    function go(i, user) {
      current = (i + slides.length) % slides.length;
      render();
      if (user) restart();
    }

    function next() { if (!paused) go(current + 1); }

    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(next, interval);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { go(current - 1, true); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(current + 1, true); });
    root.addEventListener('mouseenter', function () { paused = true; });
    root.addEventListener('mouseleave', function () { paused = false; });
    root.addEventListener('focusin', function () { paused = true; });
    root.addEventListener('focusout', function () { paused = false; });
    document.addEventListener('keydown', function (e) {
      if (!root.isIntersecting) return;
      if (e.key === 'ArrowLeft') go(current - 1, true);
      if (e.key === 'ArrowRight') go(current + 1, true);
    });

    render();
    restart();
  }

  /* Make keyboard arrows only react when the hero is on screen */
  if ('IntersectionObserver' in window) {
    document.querySelectorAll('[data-slideshow]').forEach(function (root) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { root.isIntersecting = en.isIntersecting; });
      }, { threshold: 0.2 }).observe(root);
    });
  } else {
    document.querySelectorAll('[data-slideshow]').forEach(function (root) { root.isIntersecting = true; });
  }

  /* ---------- Auto-playing testimonials ---------- */
  document.querySelectorAll('[data-tslider]').forEach(function (root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.t-slide'));
    if (slides.length < 2) return;
    var interval = parseInt(root.getAttribute('data-tslider'), 10) || 6000;
    var i = 0;
    setInterval(function () {
      i = (i + 1) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('active', k === i); });
    }, interval);
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Gallery filters ---------- */
  var filterBtns = document.querySelectorAll('[data-filter]');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) { b.classList.toggle('active', b === btn); });
      document.querySelectorAll('.g-item').forEach(function (item) {
        var show = f === 'all' || item.getAttribute('data-cat') === f;
        item.classList.toggle('hidden', !show);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('.lightbox-cap');
    var items = Array.prototype.slice.call(document.querySelectorAll('.g-item'));
    var idx = 0;

    function openLb(i) {
      var item = items[i];
      if (!item) return;
      idx = i;
      var src = item.querySelector('img');
      lbImg.src = src.src;
      lbImg.alt = src.alt || '';
      if (lbCap) lbCap.textContent = item.getAttribute('data-title') || '';
      lb.classList.add('open');
      document.body.classList.add('no-scroll');
    }
    function closeLb() {
      lb.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
    function step(d) { openLb((idx + d + items.length) % items.length); }

    items.forEach(function (item, i) {
      item.addEventListener('click', function () { openLb(i); });
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); }
      });
    });

    var closeBtn = lb.querySelector('[data-lb-close]');
    var prevBtn = lb.querySelector('[data-lb-prev]');
    var nextBtn = lb.querySelector('[data-lb-next]');
    if (closeBtn) closeBtn.addEventListener('click', closeLb);
    if (prevBtn) prevBtn.addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function (e) { e.stopPropagation(); step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ---------- Forms (mailto hand-off) ---------- */
  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var to = form.getAttribute('data-mailto') || 'xxxxx';
      var subject = form.getAttribute('data-subject') || 'Enquiry';
      var f = new FormData(form);
      var body = [];
      f.forEach(function (v, k) { body.push(k.toUpperCase() + ': ' + v); });
      window.location.href =
        'mailto:' + encodeURIComponent(to) +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body.join('\n\n'));
      var note = form.querySelector('.form-note');
      if (note) {
        note.textContent = 'Thanks! Your email app should now open with the message pre-filled. We will get back to you shortly.';
        note.classList.add('show');
      }
    });
  });

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
