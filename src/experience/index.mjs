import { createScope } from './motion.mjs';
import { mountReply } from './rsvp.mjs';
import { mountEnvelope } from './envelope.mjs';
import { mountNavigation } from './navigation.mjs';
import { mountCinema } from './cinematic.mjs';
import { mountGallery } from './gallery.mjs';
import { mountMedia } from './media.mjs';

export function mountExperience(root) {
  const ctx = createScope(root);
  let reducedByGuest = false;
  try { reducedByGuest = localStorage.getItem('cinematic-reduced') === '1'; } catch {}
  ctx.moving = () => !ctx.reduced.matches && !reducedByGuest;
  ctx.setPhase = phase => {
    root.dataset.phase = phase;
    ctx.$('letter').inert = phase !== 'reading';
    root.querySelector('footer').inert = phase !== 'reading';
    root.querySelector('nav').hidden = phase !== 'reading';
    root.dispatchEvent(new Event('phasechange'));
  };
  function syncMotion() {
    root.dataset.cinematic = ctx.moving() ? 'on' : 'off';
    const toggle = ctx.$('cinematic-toggle');
    toggle.hidden = false; toggle.disabled = ctx.reduced.matches;
    toggle.setAttribute('aria-pressed', String(!ctx.moving()));
    toggle.textContent = ctx.reduced.matches ? 'Motion reduced by your device' : ctx.moving() ? 'Reduce motion' : 'Enable cinematic motion';
    root.dispatchEvent(new Event('motionchange'));
  }
  ctx.on(ctx.$('cinematic-toggle'), 'click', () => { reducedByGuest = !reducedByGuest; try { localStorage.setItem('cinematic-reduced', reducedByGuest ? '1' : '0'); } catch {} syncMotion(); });
  ctx.on(ctx.reduced, 'change', syncMotion);
  syncMotion();
  const reply = mountReply(ctx);
  mountEnvelope(ctx, reply); mountNavigation(ctx); mountCinema(ctx); mountGallery(ctx); mountMedia(ctx);
  ctx.setPhase('sealed');
  if (root.dataset.mode === 'demo' && new URLSearchParams(location.search).has('qa')) {
    import('./diagnostics.mjs').then(({ mountDiagnostics }) => { if (!ctx.signal.aborted) mountDiagnostics(ctx); });
  }
  return () => ctx.dispose();
}
