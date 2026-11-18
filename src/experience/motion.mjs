export const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
export const smooth = n => { const p = clamp(n); return p * p * (3 - 2 * p); };
export const motion = Object.freeze({
  ease: 'cubic-bezier(.22,.72,.18,1)',
  press: 110, release: 240, panel: 360, confirmation: 640,
  tilt: { frequency: 16, damping: .79 },
  navigation: { frequency: 20, damping: .82 },
  scene: { frequency: 18, damping: .9 },
  opening: { align: 240, seal: 300, flap: 620, extract: 760, expand: 860, handoff: 140 },
});

// Exact solution of an underdamped oscillator, independent of frame rate.
export function springStep(p, v, goal, dt, frequency = 18, damping = .9) {
  const x = p - goal, a = damping * frequency;
  const b = frequency * Math.sqrt(1 - damping * damping);
  const decay = Math.exp(-a * dt), c = Math.cos(b * dt), s = Math.sin(b * dt);
  const k = (v + a * x) / b;
  return { p: goal + decay * (x * c + k * s), v: decay * ((-a * x + b * k) * c + (-a * k - b * x) * s) };
}

export function createScope(root) {
  const controller = new AbortController(), cleanups = [], frames = new Set(), animations = new Set();
  const scope = {
    root, signal: controller.signal, reduced: matchMedia('(prefers-reduced-motion: reduce)'),
    $: id => root.querySelector(`#${id}`),
    on(target, event, handler, options = {}) { target?.addEventListener(event, handler, { ...options, signal: controller.signal }); },
    cleanup(fn) { cleanups.push(fn); },
    frame(fn) { const id = requestAnimationFrame(t => { frames.delete(id); fn(t); }); frames.add(id); return id; },
    cancel(id) { cancelAnimationFrame(id); frames.delete(id); },
    animate(el, keyframes, options) {
      const animation = el.animate(keyframes, { fill: 'forwards', easing: motion.ease, ...options });
      animations.add(animation);
      animation.finished.catch(() => {}).finally(() => animations.delete(animation));
      return animation;
    },
    dispose() {
      controller.abort(); frames.forEach(cancelAnimationFrame); animations.forEach(a => a.cancel());
      cleanups.reverse().forEach(fn => fn());
      document.body.style.removeProperty('overflow');
    },
  };
  return scope;
}
