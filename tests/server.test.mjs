import test from 'node:test';
import assert from 'node:assert/strict';
import {readJson} from '../src/server.mjs';
const request=(body,headers={})=>new Request('https://invite.example/api/rsvp',{method:'POST',headers:{'content-type':'application/json',...headers},body});
test('request boundary rejects foreign origins, invalid JSON and oversized payloads',async()=>{
 await assert.rejects(()=>readJson(request('{}',{origin:'https://foreign.example'})),e=>e.status===403);
 await assert.rejects(()=>readJson(request('invalid')),e=>e.status===400);
 await assert.rejects(()=>readJson(request('{}',{'content-type':'text/plain'})),e=>e.status===415);
 await assert.rejects(()=>readJson(request(JSON.stringify({value:'x'.repeat(12000)}))),e=>e.status===413);
 assert.deepEqual(await readJson(request('{"ok":true}',{origin:'https://invite.example'})),{ok:true});
});
