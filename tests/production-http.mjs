// Run against `ROORA_DEMO_MODE=1 npm start -- --hostname 127.0.0.1 --port 3002`.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3002';
const response = await fetch(base), html = await response.text();
assert.match(html, /id="unlock-form" inert aria-busy="true"/);
assert.equal(response.status, 200); assert.match(html, /data-mode="demo"/); assert.match(html, /data-phase="sealed"/);
assert.equal(response.headers.get('x-frame-options'), 'DENY'); assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
let checked = 1;
for (const name of ['story-meeting', 'story-promise', 'story-homecoming', 'closing-portrait', 'attire-women', 'attire-men']) {
  const r = await fetch(`${base}/media/${name}.webp`); assert.equal(r.status, 200); const bytes = Buffer.from(await r.arrayBuffer()); assert.deepEqual(bytes, await readFile(new URL(`../public/media/${name}.webp`, import.meta.url))); checked++;
}
const looks = JSON.parse(await readFile(new URL('../public/media/looks/manifest.json', import.meta.url)));
for (const file of looks) { const r = await fetch(`${base}/media/looks/${file.file}`); assert.equal(r.status, 200); assert.equal((await r.arrayBuffer()).byteLength, file.bytes); checked++; }
for (const path of ['invitation', 'rsvp']) {
  const r = await fetch(`${base}/api/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: 'DEMO2027' }) }); assert.equal(r.status, 503); assert.match((await r.json()).error, /disabled in demo mode/); checked++;
}
const admin = await fetch(`${base}/api/admin`); assert.equal(admin.status, 503); checked++;
const ics = await (await fetch(`${base}/roora.ics`)).text(); assert.match(ics, /DTSTART;VALUE=DATE:20271201/); assert.match(ics, /DTEND;VALUE=DATE:20271202/); assert.ok(!/DTSTART:.*T/.test(ics)); checked++;
console.log(`${checked} actual Next.js HTTP and binary-asset checks passed.`);
