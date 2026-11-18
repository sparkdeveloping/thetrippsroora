export function mountGallery(ctx) {
  const { root, $, on } = ctx;
  const tabs = [...root.querySelectorAll('[role=tab]')];
  function select(index, focus = false) {
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; $(tab.getAttribute('aria-controls')).hidden = i !== index; });
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, i) => {
    on(tab, 'click', () => select(i));
    on(tab, 'keydown', e => { if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) { e.preventDefault(); select(e.key === 'Home' ? 0 : e.key === 'End' ? 1 : 1 - i, true); } });
  });
  root.querySelectorAll('.swatch').forEach(button => on(button, 'click', () => {
    root.querySelectorAll('.swatch').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    $('fabric').style.setProperty('--fabric', button.dataset.hex); $('fabric-name').textContent = button.dataset.color.toUpperCase();
    $('fabric-hex').textContent = button.dataset.hex; $('color-role').textContent = button.dataset.role;
    $('fabric').dataset.light = ['Ivory', 'Champagne', 'Sage'].includes(button.dataset.color) ? 'true' : 'false';
  }));
  for (const gallery of root.querySelectorAll('.look-gallery')) {
    const track = gallery.querySelector('.look-track'), slides = [...track.children], scrub = gallery.querySelector('.look-scrub');
    const prev = gallery.querySelector('.look-prev'), next = gallery.querySelector('.look-next'), label = gallery.querySelector('.look-index');
    let selected = 0, raf = 0, positions = [], dragging = false, origin = 0, start = 0;
    function measure() { positions = slides.map(s => s.offsetLeft + s.offsetWidth / 2 - track.clientWidth / 2); }
    function update(i) {
      selected = i; scrub.value = String(i); scrub.setAttribute('aria-valuetext', `Style ${String.fromCharCode(65 + i)}: ${slides[i].querySelector('h3').textContent}`);
      label.textContent = `${String(i + 1).padStart(2, '0')} / 10`; prev.disabled = i === 0; next.disabled = i === 9;
      slides.forEach((slide, j) => slide.toggleAttribute('data-active', i === j));
    }
    function go(i, smooth = true) { measure(); i = Math.max(0, Math.min(9, i)); update(i); track.scrollTo({ left: positions[i], behavior: smooth && ctx.moving() ? 'smooth' : 'instant' }); }
    on(track, 'scroll', () => {
      if (raf) return;
      raf = ctx.frame(() => { raf = 0; if (!positions.length) measure(); let closest = 0; positions.forEach((p, i) => { if (Math.abs(p - track.scrollLeft) < Math.abs(positions[closest] - track.scrollLeft)) closest = i; }); update(closest); });
    }, { passive: true });
    on(scrub, 'input', () => go(Number(scrub.value), false)); on(prev, 'click', () => go(selected - 1)); on(next, 'click', () => go(selected + 1));
    on(track, 'keydown', e => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) { e.preventDefault(); go(e.key === 'Home' ? 0 : e.key === 'End' ? 9 : selected + (e.key === 'ArrowRight' ? 1 : -1)); } });
    on(track, 'pointerdown', e => { if (e.pointerType !== 'mouse' || e.button !== 0) return; dragging = true; origin = e.clientX; start = track.scrollLeft; track.setPointerCapture(e.pointerId); track.dataset.dragging = 'true'; });
    on(track, 'pointermove', e => { if (dragging) track.scrollLeft = start + origin - e.clientX; });
    const stop = () => { if (!dragging) return; dragging = false; delete track.dataset.dragging; go(selected); };
    on(track, 'pointerup', stop); on(track, 'pointercancel', stop);
    if ('ResizeObserver' in window) { const observer = new ResizeObserver(() => { measure(); if (!gallery.closest('[hidden]')) go(selected, false); }); observer.observe(track); ctx.cleanup(() => observer.disconnect()); }
    update(0);
  }
  const dialog = $('image-dialog'); let opener;
  root.querySelectorAll('.look-photo').forEach(button => on(button, 'click', () => {
    opener = button; const image = button.querySelector('img');
    $('dialog-image').src = image.dataset.src; $('dialog-image').alt = image.alt; $('dialog-caption').textContent = image.alt; dialog.showModal();
  }));
  on(dialog, 'click', e => { if (e.target === dialog) dialog.close(); });
  on(dialog, 'close', () => opener?.focus({ preventScroll: true }));
  ctx.cleanup(() => { if (dialog.open) dialog.close(); });
}
