// Explicit demo-only QA surface. No telemetry leaves the browser and no guest data is collected.
export function mountDiagnostics(ctx) {
  const { root, on } = ctx, observers = [], measurements = { lcp: null, cls: 0, longestObservedInteraction: null, longTasks: [], frameSamples: [], errors: [], checks: [], accessibility: null, expectedFaults: [] };
  let session = { start: 0, last: 0, value: 0 }, recording = false, previous = 0, raf = 0;
  function observe(type, callback, extra = {}) {
    if (!PerformanceObserver.supportedEntryTypes.includes(type)) return;
    const observer = new PerformanceObserver(list => list.getEntries().forEach(callback));
    observer.observe({ type, buffered: true, ...extra }); observers.push(observer);
  }
  observe('largest-contentful-paint', e => { measurements.lcp = e.startTime; measurements.lcpDetail = { tag: e.element?.tagName, class: e.element?.className, renderTime: e.renderTime, loadTime: e.loadTime, size: e.size, url: e.url }; });
  observe('layout-shift', e => {
    if (e.hadRecentInput) return;
    if (e.startTime - session.last > 1000 || e.startTime - session.start > 5000) session = { start: e.startTime, last: e.startTime, value: e.value };
    else { session.value += e.value; session.last = e.startTime; }
    measurements.cls = Math.max(measurements.cls, session.value);
  });
  observe('event', e => { if (e.interactionId) measurements.longestObservedInteraction = Math.max(measurements.longestObservedInteraction || 0, e.duration); }, { durationThreshold: 16 });
  observe('longtask', e => measurements.longTasks.push({ start: e.startTime, duration: e.duration }));
  on(window, 'error', e => { if (e.target?.dataset?.qaFault === 'true') measurements.expectedFaults.push(e.target.src); else measurements.errors.push(e.message || e.target?.src || 'resource error'); }, { capture: true });
  on(window, 'unhandledrejection', e => measurements.errors.push(String(e.reason)));
  const panel = document.createElement('details'); panel.id = 'qa-tools'; panel.hidden = true;
  panel.innerHTML = '<summary>Release QA</summary><label for="qa-type">Text size</label><select id="qa-type"><option value="100">100%</option><option value="150">150%</option><option value="200">200%</option></select><label for="qa-scene">Inspect scene</label><select id="qa-scene"><option value="">Select a scene</option><option value="letter,0">Letter</option><option value="album,0.1">Story: beginning</option><option value="album,0.48">Story: promise</option><option value="album,0.94">Story: homecoming</option><option value="union,0.06">Families: apart</option><option value="union,0.92">Families: joined</option><option value="calendar,0.05">Calendar: cell</option><option value="calendar,0.5">Calendar: movement</option><option value="calendar,0.94">Calendar: keepsake</option><option value="attire,0">Attire</option><option value="reply,0">Reply</option></select><button id="qa-record" type="button">Record frame timings</button><button id="qa-report" type="button">Refresh report</button><button id="qa-image" type="button">Test image failure and recovery</button><button id="qa-accessibility" type="button">Run accessibility audit</button><button id="qa-check" type="button">Run browser regression checks</button><pre id="qa-output" tabindex="0"></pre>';
  const style = document.createElement('style');
  style.textContent = '#qa-tools{position:fixed;z-index:150;left:8px;bottom:8px;max-width:min(460px,calc(100vw - 16px));background:#fff;color:#222;font:13px/1.4 Arial;padding:8px;border:1px solid #777;box-shadow:0 3px 12px #0002}#qa-tools[open]{max-height:50svh;overflow:auto}#qa-tools summary{cursor:pointer;min-height:28px}#qa-tools label{display:block}#qa-tools button,#qa-tools select{min-height:40px;margin:4px}#qa-tools pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:25svh;overflow:auto}';
  root.append(style, panel);
  on(root, 'phasechange', () => { panel.hidden = root.dataset.phase !== 'reading'; });
  function snapshot() {
    const frames = [...measurements.frameSamples].sort((a, b) => a - b);
    const percentile = p => frames.length ? frames[Math.min(frames.length - 1, Math.floor(frames.length * p))] : null;
    return { environment: { userAgent: navigator.userAgent, width: innerWidth, height: innerHeight, devicePixelRatio, rootFontSize: getComputedStyle(document.documentElement).fontSize, reducedMotion: ctx.reduced.matches }, laboratoryOnly: true, navigation: performance.getEntriesByType('navigation').map(e => ({ ttfb: e.responseStart, domContentLoaded: e.domContentLoadedEventEnd, load: e.loadEventEnd })), paints: performance.getEntriesByType('paint').map(e => ({ name: e.name, time: e.startTime })), openingMilliseconds: ctx.metrics.openingMilliseconds, lcpMilliseconds: measurements.lcp, lcpDetail: measurements.lcpDetail, cls: measurements.cls, longestObservedInteractionMilliseconds: measurements.longestObservedInteraction, inpFieldMeasurement: 'Not available; this is a finite laboratory session.', frames: { samples: frames.length, medianMilliseconds: percentile(.5), p95Milliseconds: percentile(.95), over20Milliseconds: frames.filter(t => t > 20).length, note: 'rAF intervals; not proof of GPU presentation or physical-device FPS.' }, longTasks: measurements.longTasks, errors: measurements.errors, expectedFaults: measurements.expectedFaults, missingLoadedImages: [...root.querySelectorAll('img[src]')].filter(i => i.complete && !i.naturalWidth && i.getAttribute('src')).map(i => i.getAttribute('src')), checks: measurements.checks, accessibility: measurements.accessibility, resources: performance.getEntriesByType('resource').map(e => ({ url: e.name, duration: e.duration, transferSize: e.transferSize })) };
  }
  function report() { panel.querySelector('#qa-output').textContent = JSON.stringify(snapshot(), null, 2); }
  function frame(t) { raf = 0; if (!recording) return; if (previous && !document.hidden) measurements.frameSamples.push(t - previous); previous = t; raf = ctx.frame(frame); }
  on(panel.querySelector('#qa-record'), 'click', e => { recording = !recording; previous = 0; e.target.textContent = recording ? 'Stop frame recording' : 'Record frame timings'; if (recording) raf = ctx.frame(frame); else { if (raf) ctx.cancel(raf); report(); } });
  on(panel.querySelector('#qa-report'), 'click', report);
  on(panel.querySelector('#qa-image'), 'click', async e => {
    e.target.disabled = true;
    const image = root.querySelector('.album-beat img'), original = image.dataset.src;
    const wait = (type, source) => new Promise(resolve => { const done = event => { clearTimeout(timer); image.removeEventListener('load', done); image.removeEventListener('error', done); resolve(event?.type === type); }; const timer = setTimeout(() => done(), 7000); image.addEventListener('load', done, { once: true }); image.addEventListener('error', done, { once: true }); image.src = source; });
    image.dataset.qaFault = 'true';
    const failed = await wait('error', '/media/__qa-missing__.webp');
    const fallback = image.closest('figure').querySelector('.photo-fallback');
    const announced = !fallback.hidden && fallback.textContent.includes('unavailable');
    const restored = await wait('load', original); delete image.dataset.qaFault;
    measurements.checks.push({ name: 'Deliberate missing image announces fallback and recovers', pass: failed && announced && restored && !image.hidden, detail: 'One intentional 404; all required assets are unchanged.' });
    e.target.disabled = false; report();
  });

  on(panel.querySelector('#qa-type'), 'change', e => { document.documentElement.style.fontSize = e.target.value === '100' ? '' : `${e.target.value}%`; });
  on(panel.querySelector('#qa-accessibility'), 'click', async e => { e.target.disabled = true; try { const axe = (await import('axe-core')).default; const result = await axe.run({ include: [root], exclude: [['#qa-tools']] }, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa','wcag22aa'] } }); measurements.accessibility = { violations: result.violations, incomplete: result.incomplete.map(v => ({ id: v.id, nodes: v.nodes.length })), passes: result.passes.length }; } catch (error) { measurements.accessibility = { error: error.message }; } e.target.disabled = false; report(); });
  function go(value) {
    const [kind, ratio] = value.split(',');
    const selectors = { letter: '.letter-hero', album: '.album-runway', union: innerWidth <= 760 ? '.union-runway' : '.heritage-runway', calendar: '.calendar-runway', attire: '#attire', reply: '#reply' };
    const el = root.querySelector(selectors[kind]); if (!el) return;
    const stage = el.querySelector(kind === 'album' ? '.album-stage' : kind === 'calendar' ? '.calendar-stage' : kind === 'union' ? (innerWidth <= 760 ? '.union-art' : '.heritage-grid') : '.letter-inner');
    const sticky = stage && getComputedStyle(stage).position === 'sticky', top = sticky ? parseFloat(getComputedStyle(stage).top) || 0 : 0;
    window.scrollTo({ top: scrollY + el.getBoundingClientRect().top - top + (sticky ? Math.max(0, el.offsetHeight - stage.offsetHeight) * Number(ratio) : 0), behavior: 'instant' });
  }
  on(panel.querySelector('#qa-scene'), 'change', e => go(e.target.value));
  const settle = () => new Promise(resolve => setTimeout(resolve, 700));
  on(panel.querySelector('#qa-check'), 'click', async e => {
    e.target.disabled = true; measurements.checks = [];
    const check = (name, pass, detail = '') => measurements.checks.push({ name, pass: !!pass, detail });
    try {
      check('Navigation hidden state follows reading phase', !root.querySelector('nav').hidden);
      for (const [value, beat] of [['album,0.1', 0], ['album,0.48', 1], ['album,0.94', 2], ['album,0.1', 0]]) {
        go(value); await settle(); const visible = [...root.querySelectorAll('.album-beat')].filter(b => b.getAttribute('aria-hidden') !== 'true');
        const linear = innerHeight < 620 || !ctx.moving() || root.dataset.largeType === 'true';
        check(`Album ${beat + 1}: ${value}`, linear ? visible.length === 3 && getComputedStyle(root.querySelector('.album-stage')).position !== 'sticky' : visible.length === 1 && visible[0].dataset.beat === String(beat));
      }
      for (const [value, end] of [['calendar,0.05', false], ['calendar,0.94', true], ['calendar,0.05', false]]) {
        go(value); await settle(); const lift = Number(root.querySelector('.calendar-runway').style.getPropertyValue('--cal-lift'));
        const linear = !ctx.moving() || innerHeight < 620 || root.dataset.largeType === 'true', date = root.querySelector('.calendar-date-reveal');
        check(`Calendar reversible: ${value}`, linear ? getComputedStyle(date).position === 'relative' && getComputedStyle(date).transform === 'none' : (end ? lift > .95 : lift < .05), String(lift));
      }
      check('Single shared date number', root.querySelectorAll('.calendar-date-reveal strong').length === 1 && !root.querySelector('.calendar-selected').textContent.trim());
      go('attire,0'); await settle();
      for (const type of ['women', 'men']) {
        root.querySelector(`#tab-${type}`).click();
        const track = root.querySelector(`#look-${type} .look-track`), slider = root.querySelector(`#scrub-${type}`);
        for (const i of [0, 4, 9]) { slider.value = String(i); slider.dispatchEvent(new Event('input', { bubbles: true })); await settle(); check(`${type} gallery style ${i + 1}`, root.querySelector(`#look-${type} .look-index`).textContent === `${String(i + 1).padStart(2, '0')} / 10`); }
        check(`${type} ten local look files`, track.querySelectorAll('img[src^="/media/looks/"]').length === 10);
      }
      check('Document has no horizontal overflow', document.documentElement.scrollWidth <= innerWidth + 1);
      check('No uncaught errors', measurements.errors.length === 0);
    } catch (error) { check('QA execution', false, error.message); }
    e.target.disabled = false; report();
  });
  ctx.cleanup(() => { recording = false; observers.forEach(o => o.disconnect()); panel.remove(); style.remove(); document.documentElement.style.removeProperty('font-size'); }); report();
}
