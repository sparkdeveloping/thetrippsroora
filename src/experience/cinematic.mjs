import { clamp, smooth, springStep, motion } from './motion.mjs';

export function mountCinema(ctx) {
  const { root, on } = ctx;
  const kinds = ['letter', 'album', 'heritage-pin', 'union-pin', 'calendar'];
  const items = [...root.querySelectorAll('[data-cine]')].filter(el => kinds.includes(el.dataset.cine)).map(el => ({ el, kind: el.dataset.cine, top: 0, height: 0, p: 0, v: 0, active: false }));
  const album = items.find(a => a.kind === 'album');
  const beats = [...album.el.querySelectorAll('.album-beat')], meters = [...album.el.querySelectorAll('.album-meter i')];
  const union = root.querySelector('.union-art'), calendar = root.querySelector('.calendar-runway');
  let raf = 0, last = 0, dirty = true, initialized = false, lastY = scrollY, velocity = 0, width = innerWidth;
  const canPin = () => ctx.moving() && innerHeight >= 620 && root.dataset.largeType !== 'true';
  function schedule() { if (!raf && !document.hidden && root.dataset.phase === 'reading') raf = ctx.frame(tick); }
  function refresh() { dirty = true; schedule(); }
  function accessibility(active) {
    beats.forEach((beat, i) => {
      const hidden = canPin() && i !== active;
      beat.inert = hidden;
      if (hidden) beat.setAttribute('aria-hidden', 'true'); else beat.removeAttribute('aria-hidden');
    });
  }
  function measure(y, h) {
    // Every geometry read happens before the frame's first style write.
    for (const a of items) {
      const rect = a.el.getBoundingClientRect(); a.top = rect.top + y; a.height = rect.height;
      a.stage = a.el.querySelector(a.kind === 'album' ? '.album-stage' : a.kind === 'letter' ? '.letter-inner' : a.kind === 'calendar' ? '.calendar-stage' : a.kind === 'union-pin' ? '.union-art' : '.heritage-grid');
      const style = a.stage && getComputedStyle(a.stage);
      a.pinned = style?.position === 'sticky'; a.pinHeight = a.stage?.offsetHeight || h; a.pinTop = parseFloat(style?.top) || 0;
    }
    const book = calendar.querySelector('.calendar-book'), cell = calendar.querySelector('.calendar-selected');
    const b = book.getBoundingClientRect(), c = cell.getBoundingClientRect();
    const date = { x: c.left + c.width / 2 - b.left - b.width / 2, y: c.top + c.height / 2 - b.top - b.height / 2, sx: c.width / b.width, sy: c.height / b.height };
    calendar.style.setProperty('--cal-x', `${date.x}px`); calendar.style.setProperty('--cal-y', `${date.y}px`);
    calendar.style.setProperty('--cal-sx', date.sx); calendar.style.setProperty('--cal-sy', date.sy);
    dirty = false;
  }
  function tick(now) {
    raf = 0;
    if (root.dataset.phase !== 'reading' || document.hidden) { last = 0; return; }
    const y = scrollY, h = document.documentElement.clientHeight || innerHeight, mobile = innerWidth <= 760;
    if (!ctx.moving()) { accessibility(0); initialized = false; last = 0; return; }
    const dt = last ? clamp((now - last) / 1000, .001, .05) : 1 / 60; last = now;
    if (dirty) {
      const large = String(parseFloat(getComputedStyle(document.documentElement).fontSize) >= 24);
      if (large !== root.dataset.largeType) { root.dataset.largeType = large; accessibility(0); schedule(); return; }
      measure(y, h);
    }
    if (root.dataset.largeType === 'true') { accessibility(0); initialized = false; last = 0; return; }
    const speed = clamp((y - lastY) / dt, -2400, 2400); lastY = y;
    velocity += (speed - velocity) * (1 - Math.exp(-12 * dt));
    let unsettled = Math.abs(velocity) > 5;
    for (const a of items) {
      const visible = a.top + a.height > y - h * .15 && a.top < y + h * 1.15;
      const goal = a.pinned ? clamp((y - a.top + a.pinTop) / Math.max(1, a.height - a.pinHeight)) : clamp((y + h * .7 - a.top) / Math.max(h * .65, a.height));
      if (!visible || !initialized || !a.active) { a.p = goal; a.v = 0; }
      else {
        const n = springStep(a.p, a.v, goal, dt, motion.scene.frequency, motion.scene.damping); a.p = n.p; a.v = n.v;
        if (Math.abs(n.p - goal) < .0005 && Math.abs(n.v) < .005) { a.p = goal; a.v = 0; } else unsettled = true;
      }
      if (visible || a.active || !initialized) render(a, clamp(a.p), mobile);
      a.active = visible;
    }
    const heritage = items.find(a => a.kind === (mobile ? 'union-pin' : 'heritage-pin'));
    if (heritage.active) {
      const p = clamp(heritage.p);
      // Long deceleration around the convergence; the last segment resolves the knot.
      union.style.setProperty('--union-draw', smooth((p - .05) / .78));
      union.style.setProperty('--union-finish', smooth((p - .63) / .30));
    }
    initialized = true; if (unsettled) schedule(); else last = 0;
  }
  function render(a, p, mobile) {
    if (a.kind === 'letter') {
      const q = smooth(p);
      a.el.style.setProperty('--letter-s', 1 - .075 * q);
      a.el.style.setProperty('--letter-r', `${-3 * q}deg`);
      a.el.style.setProperty('--letter-y', `${-20 * q}px`);
      a.el.style.setProperty('--memory-reveal', q);
    }
    if (a.kind === 'album') {
      const scene = p < .5 ? smooth((p - .22) / .15) : 1 + smooth((p - .64) / .15);
      beats.forEach((beat, i) => {
        const delta = i - scene, weight = clamp(1 - Math.abs(delta)), opacity = smooth(weight);
        beat.style.setProperty('--beat-opacity', opacity.toFixed(4));
        beat.style.setProperty('--frame-x', `${(delta * (mobile ? 70 : 110)).toFixed(2)}px`);
        beat.style.setProperty('--frame-r', `${(delta * (mobile ? 9 : 6) + (i % 2 ? 1 : -1) * weight).toFixed(2)}deg`);
        beat.style.setProperty('--frame-ry', `${(-delta * 14).toFixed(2)}deg`);
        beat.style.setProperty('--frame-s', (.92 + weight * .08).toFixed(4));
        beat.style.setProperty('--copy-y', `${(delta * 18).toFixed(2)}px`);
        meters[i].style.opacity = String(.3 + .7 * opacity);
      });
      a.el.style.setProperty('--album-progress', `${p * 100}%`); accessibility(Math.round(scene));
    }
    if (a.kind === 'calendar') a.el.style.setProperty('--cal-lift', smooth((p - .24) / .57).toFixed(4));
  }
  on(window, 'scroll', schedule, { passive: true });
  on(window, 'resize', () => {
    // A software keyboard or moving toolbar must not rebuild every scene's geometry.
    if (document.activeElement?.matches('input,textarea,select') && Math.abs(innerWidth - width) < 2) return;
    width = innerWidth; refresh();
  }, { passive: true });
  on(root, 'phasechange', () => { initialized = false; refresh(); });
  on(root, 'motionchange', () => { initialized = false; accessibility(0); refresh(); });
  on(window, 'pageshow', refresh);
  on(document, 'visibilitychange', () => { if (document.hidden) { if (raf) ctx.cancel(raf); raf = 0; last = 0; } else { initialized = false; refresh(); } });
  if ('ResizeObserver' in window) { const observer = new ResizeObserver(refresh); items.forEach(a => observer.observe(a.el)); ctx.cleanup(() => observer.disconnect()); }
  document.fonts?.ready.then(() => { if (!ctx.signal.aborted) refresh(); });
  ctx.cleanup(() => beats.forEach(beat => { beat.inert = false; beat.removeAttribute('aria-hidden'); }));
  accessibility(0); refresh();
}
