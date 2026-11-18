import test from 'node:test';
import assert from 'node:assert/strict';
import { springStep } from '../src/experience/motion.mjs';
import { daysUntilCelebration } from '../src/experience/media.mjs';

test('spring solution gives the same state at 30, 60 and 120Hz', () => {
  const simulate = fps => { let p = 0, v = 0; for (let i = 0; i < fps; i++) ({ p, v } = springStep(p, v, 1, 1 / fps, 16, .79)); return { p, v }; };
  const reference = simulate(60);
  for (const fps of [30, 120]) { const actual = simulate(fps); assert.ok(Math.abs(actual.p - reference.p) < 1e-10); assert.ok(Math.abs(actual.v - reference.v) < 1e-10); }
  assert.ok(Math.abs(reference.p - 1) < .0001);
});
test('Zimbabwe countdown changes at local midnight and never becomes negative', () => {
  assert.equal(daysUntilCelebration(new Date('2027-11-30T21:59:59Z')), 1);
  assert.equal(daysUntilCelebration(new Date('2027-11-30T22:00:00Z')), 0);
  assert.equal(daysUntilCelebration(new Date('2027-12-02T00:00:00Z')), 0);
  assert.equal(new Date('2027-12-01T00:00:00Z').getUTCDay(), 3);
});
