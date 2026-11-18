import {test} from 'node:test';
import assert from 'node:assert/strict';
import {demoEnabled} from '../src/mode.mjs';
import {configuration} from '../src/server.mjs';
import {POST as verify} from '../app/api/invitation/route.js';
import {POST as reply} from '../app/api/rsvp/route.js';
import {GET as admin} from '../app/api/admin/route.js';
test('hosted demo explicit opt-in, local-only legacy flag',()=>{assert.equal(demoEnabled({NODE_ENV:'production',ALLOW_DEMO:'1'}),false);assert.equal(demoEnabled({NODE_ENV:'production',ROORA_DEMO_MODE:'1'}),true);assert.equal(demoEnabled({NODE_ENV:'development',ALLOW_DEMO:'1'}),true);assert.equal(demoEnabled({NODE_ENV:'production',ROORA_DEMO_MODE:'0'}),false);});
test('demo deployment cannot call live guest services',async()=>{const old=process.env.ROORA_DEMO_MODE;process.env.ROORA_DEMO_MODE='1';try{assert.throws(configuration,/disabled in demo mode/);for(const handler of [verify,reply,admin]){const result=await handler(new Request('https://example.test/api'));assert.equal(result.status,503);assert.match((await result.json()).error,/disabled in demo mode/);}}finally{if(old===undefined)delete process.env.ROORA_DEMO_MODE;else process.env.ROORA_DEMO_MODE=old;}});
