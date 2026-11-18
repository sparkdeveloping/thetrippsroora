import test from 'node:test';
import assert from 'node:assert/strict';
import { postInvitationApi } from '../src/experience/request.mjs';
test('reply transport preserves idempotency payload and reports service errors', async () => {
  const body = { requestId: 'retry-reference-001' };
  const success = await postInvitationApi('rsvp', body, { fetcher: async (path, options) => { assert.equal(path, '/api/rsvp'); assert.deepEqual(JSON.parse(options.body), body); assert.equal(options.cache, 'no-store'); return Response.json({ reference: 'recorded' }); } });
  assert.equal(success.reference, 'recorded');
  await assert.rejects(() => postInvitationApi('rsvp', body, { fetcher: async () => Response.json({ error: 'Try again safely.' }, { status: 503 }) }), /Try again safely/);
  await assert.rejects(() => postInvitationApi('rsvp', body, { fetcher: async () => { throw new TypeError('network'); } }), /Check your connection/);
});
test('reply transport timeout and lifecycle abort work without AbortSignal.any', async () => {
  const pending = (_, { signal }) => new Promise((resolve, reject) => { const stop = () => reject(new DOMException('Aborted', 'AbortError')); if (signal.aborted) stop(); else signal.addEventListener('abort', stop, { once: true }); });
  await assert.rejects(() => postInvitationApi('rsvp', {}, { fetcher: pending, timeout: 5 }), e => e.name === 'AbortError');
  const controller = new AbortController();
  const result = postInvitationApi('rsvp', {}, { fetcher: pending, signal: controller.signal }); controller.abort();
  await assert.rejects(() => result, e => e.name === 'AbortError');
});
