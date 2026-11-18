import test from 'node:test';
import assert from 'node:assert/strict';
import { openingViewportChanged } from '../src/experience/envelope.mjs';
test('keyboard and toolbar height changes preserve touch opening; rotation finishes safely', () => {
  const before = { width: 390, height: 600 };
  assert.equal(openingViewportChanged(before, { width: 390, height: 844 }, true), false);
  assert.equal(openingViewportChanged(before, { width: 844, height: 390 }, true), true);
  assert.equal(openingViewportChanged(before, { width: 390, height: 844 }, false), true);
});
