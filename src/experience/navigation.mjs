import { clamp, motion, springStep } from './motion.mjs';

export function mountNavigation(ctx) {
  const { root, $, on } = ctx, nav = root.querySelector('nav'), toggle = $('chapter-toggle'), panel = $('chapter-links'), dock = nav.querySelector('.chapter-dock');
  const links = [...panel.querySelectorAll('a')], sections = links.map(a => $(a.hash.slice(1)));
  const names = ['Invitation', 'Our story', 'Roora', 'The day', 'Attire', 'Your reply'];
  let animation, raf = 0, last = 0, vector = [0, 0, 1], speed = [0, 0, 0], goal = [0, 0, 1];
  function setOpen(open, focus = false) {
    animation?.cancel(); toggle.setAttribute('aria-expanded', String(open)); panel.inert = !open;
    if (open) {
      panel.hidden = false;
      if (ctx.moving()) animation = ctx.animate(panel, [{ transform: 'translateY(-8px) scale(.97)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: motion.panel, fill: 'none' });
    } else panel.hidden = true;
    if (focus) toggle.focus({ preventScroll: true });
  }
  on(toggle, 'click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  on(document, 'pointerdown', e => { if (!nav.contains(e.target)) setOpen(false); });
  on(nav, 'focusout', e => { if (e.relatedTarget && !nav.contains(e.relatedTarget)) setOpen(false); });
  on(document, 'keydown', e => { if (e.key === 'Escape' && !panel.hidden) { e.preventDefault(); setOpen(false, true); } });
  links.forEach((link, i) => on(link, 'click', () => {
    setOpen(false); sections[i].focus({ preventScroll: true });
  }));
  function tick(now) {
    raf = 0; const dt = last ? Math.min(.05, (now - last) / 1000) : 1 / 60; last = now;
    let moving = false;
    vector.forEach((p, i) => { const n = springStep(p, speed[i], goal[i], dt, motion.navigation.frequency, motion.navigation.damping); vector[i] = n.p; speed[i] = n.v; if (Math.abs(n.p - goal[i]) > .002 || Math.abs(n.v) > .02) moving = true; });
    dock.style.setProperty('--mag-x', `${vector[0]}px`); dock.style.setProperty('--mag-y', `${vector[1]}px`); dock.style.setProperty('--mag-s', vector[2]);
    $('nav-thread').setAttribute('d', `M102 0 C102 24 ${62 + vector[0]} 33 ${62 + vector[0]} ${63 + vector[1]}`);
    if (moving && !document.hidden) raf = ctx.frame(tick); else last = 0;
  }
  function magnet(v = [0, 0, 1]) { goal = ctx.moving() ? v : [0, 0, 1]; if (!raf) raf = ctx.frame(tick); }
  on(toggle, 'pointermove', e => { if (e.pointerType !== 'mouse' || !panel.hidden) return; const r = toggle.getBoundingClientRect(); magnet([clamp((e.clientX - r.left - r.width / 2) * .12, -6, 6), clamp((e.clientY - r.top - r.height / 2) * .18, -4, 4), 1]); });
  on(toggle, 'pointerleave', () => magnet()); on(toggle, 'pointerdown', () => magnet([0, 4, .975]));
  on(toggle, 'pointerup', () => magnet()); on(toggle, 'pointercancel', () => magnet());
  on(root, 'motionchange', () => magnet()); on(root, 'phasechange', () => { if (root.dataset.phase !== 'reading') setOpen(false); });
  let progressFrame = 0, positions = [], current = -1;
  function measure() { positions = sections.map(s => s.getBoundingClientRect().top + scrollY); progress(); }
  function progress() {
    progressFrame = 0; if (root.dataset.phase !== 'reading') return;
    const range = document.documentElement.scrollHeight - innerHeight;
    dock.style.setProperty('--progress', `${range > 0 ? clamp(scrollY / range) * 100 : 0}%`);
    let active = 0; positions.forEach((top, i) => { if (top <= scrollY + innerHeight * .28) active = i; });
    if (active === current) return; current = active;
    links.forEach((a, i) => i === active ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current'));
    $('dock-count').textContent = `0${active + 1} / 06`; $('dock-label').textContent = names[active];
  }
  const schedule = () => { if (!progressFrame) progressFrame = ctx.frame(progress); };
  on(window, 'scroll', schedule, { passive: true }); on(window, 'resize', measure, { passive: true });
  on(root, 'phasechange', measure); on(root, 'motionchange', () => ctx.frame(measure));
  if ('ResizeObserver' in window) { const observer = new ResizeObserver(() => ctx.frame(measure)); observer.observe(root); ctx.cleanup(() => observer.disconnect()); }
  ctx.cleanup(() => animation?.cancel());
}
