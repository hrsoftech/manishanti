(function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };

  var burger = $('.burger'), nav = $('.nav');
  if (burger) burger.addEventListener('click', function () {
    burger.setAttribute('aria-expanded', nav.classList.toggle('open'));
  });

  var hdr = $('.hdr'), top = $('.top');
  window.addEventListener('scroll', function () {
    hdr.classList.toggle('sc', window.scrollY > 10);
    top.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });

  var slides = $$('.slide'), caps = $$('.cap'), dots = $$('.dots button'), cur = 0, timer;
  function go(k) {
    cur = (k + slides.length) % slides.length;
    [slides, caps, dots].forEach(function (list) {
      list.forEach(function (el, j) { el.classList.toggle('on', j === cur); });
    });
  }
  function auto() { clearInterval(timer); timer = setInterval(function () { go(cur + 1); }, 6500); }
  if (slides.length) {
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); auto(); }); });
    auto();
  }

  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !still) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, end = +el.getAttribute('data-n'), start = null;
        function step(ts) {
          start = start || ts;
          var p = Math.min((ts - start) / 1600, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    $$('.num').forEach(function (n) { io.observe(n); });
  }

  var tm = $('.tm');
  $$('[data-tm]').forEach(function (b) {
    b.addEventListener('click', function () {
      var card = tm.querySelector('.tc');
      tm.scrollBy({ left: (b.getAttribute('data-tm') === 'next' ? 1 : -1) * (card.offsetWidth + 28), behavior: 'smooth' });
    });
  });

  function closeLb() { var o = $('.lb'); if (o) o.remove(); }
  $$('[data-lb]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var o = document.createElement('div'), im = document.createElement('img');
      o.className = 'lb'; im.src = a.getAttribute('href'); im.alt = a.getAttribute('aria-label') || '';
      o.appendChild(im); o.addEventListener('click', closeLb); document.body.appendChild(o);
    });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
})();
