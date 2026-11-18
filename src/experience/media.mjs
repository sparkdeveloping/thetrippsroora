export function daysUntilCelebration(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Harare', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(date);
  const value = key => Number(parts.find(p => p.type === key).value);
  return Math.max(0, Math.round((Date.UTC(2027, 11, 1) - Date.UTC(value('year'), value('month') - 1, value('day'))) / 86400000));
}
export function mountMedia(ctx) {
  const { root, $, on } = ctx;
  const images = [...root.querySelectorAll('img[data-src]')];
  function loaded(img) { img.hidden = false; img.closest('figure')?.querySelector('.photo-fallback')?.setAttribute('hidden', ''); }
  function load(img) { if (!img.hasAttribute('src') && img.dataset.src) img.src = img.dataset.src; }
  images.forEach(img => {
    on(img, 'load', () => loaded(img));
    on(img, 'error', () => {
      img.hidden = true; const fallback = img.closest('figure')?.querySelector('.photo-fallback');
      if (fallback) { fallback.hidden = false; fallback.removeAttribute('aria-hidden'); fallback.querySelector('.photo-label').textContent = `${img.alt}. Photograph unavailable. Please reload to try again.`; }
    });
    if (img.complete && img.naturalWidth) loaded(img);
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { const img = e.target.matches('img') ? e.target : e.target.querySelector('img[data-src]'); if (img) load(img); observer.unobserve(e.target); } }); }, { rootMargin: '500px' });
    images.forEach(img => observer.observe(img.closest('figure') || img)); ctx.cleanup(() => observer.disconnect());
  } else images.forEach(load);
  on(root, 'phasechange', () => { if (['opening', 'reading'].includes(root.dataset.phase)) images.filter(img => img.closest('.album-runway') || img.classList.contains('letter-memory')).forEach(load); });
  let timer;
  function countdown() { clearTimeout(timer); if (!document.hidden) { $('days-left').textContent = String(daysUntilCelebration()); timer = setTimeout(countdown, 60000); } }
  on(document, 'visibilitychange', countdown); countdown(); ctx.cleanup(() => clearTimeout(timer));
}
