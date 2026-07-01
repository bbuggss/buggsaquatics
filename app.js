// ============================================================
// app.js — shared UI behavior across every page
// ============================================================
(function () {
  const t = document.getElementById('navToggle');
  const m = document.getElementById('mobileMenu');
  if (t && m) {
    t.addEventListener('click', () => {
      const open = m.classList.toggle('open');
      t.setAttribute('aria-expanded', open);
    });
  }

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();
