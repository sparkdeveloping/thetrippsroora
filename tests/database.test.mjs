import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('isolated PostgreSQL schema: allowances, idempotency, updates and denied public access', async () => {
  const db = new PGlite();
  try {
    await db.exec('create role anon; create role authenticated; create role service_role;');
    // PostgreSQL core provides gen_random_uuid and sha256; no extension is used by these functions.
    const schema = (await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8')).replace('create extension if not exists pgcrypto;', '');
    await db.exec(schema);
    const hash = 'a'.repeat(64);
    await db.query('insert into public.roora_invitations(code_hash,label,max_guests) values($1,$2,2)', [hash, 'Isolated test household']);
    const submit = (id, guests = 2, name = 'Test Guest') => db.query('select public.roora_submit($1,$2,true,$3,$4,false,$5,$6) as reply', [hash, name, guests, '', '', id]).then(r => r.rows[0].reply);
    assert.equal((await submit('allowance-test-001', 3)).status, 400);
    const first = await submit('idempotency-test-001'); assert.ok(first.reference);
    assert.equal((await submit('idempotency-test-001')).reference, first.reference);
    assert.equal((await submit('idempotency-test-001', 1)).status, 409);
    const issued = await Promise.all([submit('issued-together-001'), submit('issued-together-002')]);
    assert.equal(issued[0].reference, issued[1].reference);
    assert.equal((await db.query('select count(*)::int as count from public.roora_responses')).rows[0].count, 1);
    await db.query('update public.roora_invitations set allow_updates=false');
    assert.equal((await submit('updates-disabled-001')).status, 409);
    await db.exec('set role anon;');
    await assert.rejects(() => db.query('select * from public.roora_responses'), /permission denied/);
    await assert.rejects(() => db.query('select public.roora_verify($1)', [hash]), /permission denied/);
    await db.exec('reset role;');
    await db.query('update public.roora_invitations set active=false');
    assert.equal((await submit('inactive-code-001')).status, 404);
  } finally { await db.close(); }
});
