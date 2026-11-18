import { clamp, springStep, motion } from './motion.mjs';

export function openingViewportChanged(before, after, touch) {
  return Math.abs(before.width - after.width) > 2 || (!touch && Math.abs(before.height - after.height) > 2);
}

export function mountEnvelope(ctx, reply) {
  const { root, $, on } = ctx;
  const envelope = $('envelope'), stage = $('stage'), entry = $('unlock-form'), input = $('entry-code');
  const arrival = $('arrival'), sensor = $('motion-button'), paper = root.querySelector('.letter-inner'), hero = $('invitation');
  let run = 0, flight = null, raf = 0, last = 0, orientationActive = false, baseline = null, openingViewport;
  let current = [0, 0], velocity = [0, 0], target = [0, 0];
  const activeAnimations = new Set();
  const sealed = () => root.dataset.phase === 'sealed';
  function tick(now) {
    raf = 0;
    if (!sealed() || !ctx.moving() || document.hidden) { last = 0; return; }
    const dt = last ? Math.min(.05, (now - last) / 1000) : 1 / 60; last = now;
    let moving = false;
    current.forEach((p, i) => {
      const next = springStep(p, velocity[i], target[i], dt, motion.tilt.frequency, motion.tilt.damping);
      current[i] = next.p; velocity[i] = next.v;
      if (Math.abs(next.p - target[i]) > .02 || Math.abs(next.v) > .04) moving = true;
    });
    envelope.style.setProperty('--rx', `${current[0]}deg`); envelope.style.setProperty('--ry', `${current[1]}deg`);
    envelope.style.setProperty('--shine', `${42 + current[1] * 2}%`);
    if (moving) raf = ctx.frame(tick); else last = 0;
  }
  function tilt(x = 0, y = 0) { target = [x, y]; if (!raf && sealed() && ctx.moving()) raf = ctx.frame(tick); }
  function pointer(e) {
    if (orientationActive || entry.contains(document.activeElement) || entry.contains(e.target)) return;
    const r = stage.getBoundingClientRect();
    tilt(clamp((.5 - (e.clientY - r.top) / r.height) * 14, -7, 7), clamp(((e.clientX - r.left) / r.width - .5) * 16, -8, 8));
  }
  on(stage, 'pointermove', pointer, { passive: true });
  on(stage, 'pointerleave', () => { if (!orientationActive) tilt(); });
  on(stage, 'pointerup', e => { if (e.pointerType === 'touch' && !orientationActive) tilt(); });
  on(stage, 'pointercancel', () => tilt()); on(entry, 'focusin', () => tilt());
  function orientation(e) {
    if (!orientationActive || !sealed() || !ctx.moving() || entry.contains(document.activeElement) || e.beta == null || e.gamma == null) return;
    baseline ||= [e.beta, e.gamma];
    tilt(clamp((e.beta - baseline[0]) * .22, -7, 7), clamp((e.gamma - baseline[1]) * .25, -7, 7));
  }
  on(window, 'deviceorientation', orientation);
  function stopSensor() {
    orientationActive = false; baseline = null;
    sensor.setAttribute('aria-pressed', 'false'); sensor.setAttribute('aria-label', 'Enable tilt effect');
    if (raf) ctx.cancel(raf); raf = 0; last = 0;
  }
  function setupSensor() { sensor.hidden = !sealed() || !ctx.moving() || !('DeviceOrientationEvent' in window) || !matchMedia('(pointer:coarse)').matches; }
  on(sensor, 'click', async () => {
    if (orientationActive) { stopSensor(); tilt(); return; }
    try {
      // Permission is requested synchronously from this supported user activation.
      const permission = typeof DeviceOrientationEvent.requestPermission === 'function' ? await DeviceOrientationEvent.requestPermission() : 'granted';
      if (permission !== 'granted') { $('entry-status').textContent = 'Tilt is unavailable. Your invitation works without it.'; return; }
      if (!sealed() || !ctx.moving()) return;
      orientationActive = true; baseline = null; sensor.setAttribute('aria-pressed', 'true'); sensor.setAttribute('aria-label', 'Disable tilt effect');
    } catch { $('entry-status').textContent = 'Tilt is unavailable. Your invitation works without it.'; }
  });
  on(window, 'orientationchange', () => { baseline = null; });
  function restorePaper() { if (paper.parentElement !== hero) hero.prepend(paper); flight?.remove(); flight = null; }
  function cancelAnimations() { activeAnimations.forEach(a => a.cancel()); activeAnimations.clear(); }
  function finish() {
    restorePaper(); cancelAnimations(); arrival.hidden = true; document.body.style.removeProperty('overflow');
    ctx.setPhase('reading'); window.scrollTo({ top: 0, behavior: 'instant' }); $('letter').focus({ preventScroll: true });
    reply.busy(entry, false);
  }
  function animate(el, frames, options) { const a = ctx.animate(el, frames, options); activeAnimations.add(a); return a; }
  async function opening() {
    const id = ++run; openingViewport = { width: innerWidth, height: innerHeight }; ctx.setPhase('opening'); input.blur(); stopSensor(); sensor.hidden = true;
    if (!ctx.moving() || !Element.prototype.animate) { finish(); return; }
    document.body.style.overflow = 'hidden';
    const flap = $('flap'), card = envelope.querySelector('.env-letter');
    try {
      animate(envelope, [{ transform: getComputedStyle(envelope).transform }, { transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)' }], { duration: 240 });
      animate(entry, [{ opacity: 1 }, { opacity: 0 }], { duration: 180 });
      animate($('wax'), [{ transform: 'translate(-50%,-50%) translateZ(9px)', opacity: 1 }, { transform: 'translate(-48%,-80%) translateZ(28px) rotate(-14deg)', opacity: 0 }], { delay: 120, duration: 300 });
      animate(flap, [{ transform: 'translateZ(5px) rotateX(0deg)' }, { transform: 'translateZ(5px) rotateX(176deg)' }], { delay: 280, duration: 620 });
      card.style.visibility = 'visible';
      const extraction = animate(card, [{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(0,-107%,0)' }], { delay: 620, duration: 640 });
      await extraction.finished;
      if (id !== run || ctx.signal.aborted) return;
      const rect = card.getBoundingClientRect();
      ctx.setPhase('unfolding');
      flight = document.createElement('div'); flight.className = 'flight-letter'; flight.setAttribute('aria-hidden', 'true');
      flight.style.width = `${innerWidth}px`; flight.style.height = `${document.documentElement.clientHeight}px`;
      flight.append(paper); root.append(flight); card.style.visibility = 'hidden';
      const w = innerWidth, h = document.documentElement.clientHeight;
      const from = `translate3d(${rect.left + rect.width / 2 - w / 2}px,${rect.top + rect.height / 2 - h / 2}px,0) scale(${rect.width / w},${rect.height / h})`;
      await animate(flight, [{ transform: from }, { transform: 'translate3d(0,0,0) scale(1)' }], { duration: 860 }).finished;
      if (id !== run || ctx.signal.aborted) return;
      // Move the same HTML surface into its resting place. There is no opacity proxy swap.
      finish();
    } catch { if (id === run && !ctx.signal.aborted) finish(); }
  }
  on(entry, 'submit', async e => {
    e.preventDefault(); if (!sealed() || entry.getAttribute('aria-busy') === 'true') return;
    const id = run, code = input.value.trim(); reply.busy(entry, true); tilt(); $('entry-status').textContent = 'Checking invitation…';
    try { const found = await reply.api('invitation', { code }); if (id !== run || ctx.signal.aborted) return; reply.apply(found, code); $('entry-status').textContent = ''; await opening(); }
    catch (e) { if (!ctx.signal.aborted) { $('entry-status').textContent = reply.description(e); input.setAttribute('aria-invalid', 'true'); } }
    finally { reply.busy(entry, false); if (sealed()) input.focus(); }
  });
  on(input, 'input', () => { input.removeAttribute('aria-invalid'); $('entry-status').textContent = ''; });
  function reset() {
    run++; cancelAnimations(); restorePaper(); stopSensor(); reply.clear();
    envelope.querySelector('.env-letter').style.removeProperty('visibility');
    envelope.style.removeProperty('--rx'); envelope.style.removeProperty('--ry'); current = [0, 0]; target = [0, 0]; velocity = [0, 0];
    arrival.hidden = false; entry.reset(); input.removeAttribute('aria-invalid'); $('entry-status').textContent = '';
    document.body.style.removeProperty('overflow'); ctx.setPhase('sealed'); setupSensor();
    history.replaceState(null, '', location.pathname + location.search); window.scrollTo({ top: 0, behavior: 'instant' }); input.focus({ preventScroll: true });
  }
  on($('replay'), 'click', reset);
  on(window, 'resize', () => { baseline = null; const touch = matchMedia('(pointer:coarse)').matches || navigator.maxTouchPoints > 0; if (['opening', 'unfolding'].includes(root.dataset.phase) && openingViewportChanged(openingViewport, { width: innerWidth, height: innerHeight }, touch)) { run++; finish(); } });
  on(root, 'motionchange', () => { if (!ctx.moving()) { stopSensor(); if (['opening', 'unfolding'].includes(root.dataset.phase)) { run++; finish(); } } setupSensor(); });
  on(document, 'visibilitychange', () => { baseline = null; if (document.hidden && raf) { ctx.cancel(raf); raf = 0; last = 0; } });
  ctx.cleanup(() => { run++; cancelAnimations(); restorePaper(); stopSensor(); }); setupSensor();
}
