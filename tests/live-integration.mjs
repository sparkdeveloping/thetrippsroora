// Isolated rehearsal: actual Next.js HTTP handlers -> local Supabase-shaped transport -> real PostgreSQL schema.
import {createServer} from 'node:http';
import {spawn} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {hashCode} from '../src/server.mjs';
const db=new PGlite(),pepper='isolated-test-pepper-'.repeat(3),admin='isolated-test-admin-'.repeat(3),key='isolated-service-key';
await db.exec('create role anon;create role authenticated;create role service_role;');
await db.exec((await readFile(new URL('../db/schema.sql',import.meta.url),'utf8')).replace('create extension if not exists pgcrypto;',''));
await db.query('insert into public.roora_invitations(code_hash,label,max_guests) values($1,$2,2)',[hashCode('TEST2027',pepper),'Isolated test household']);
const contracts={roora_rate_limit:['p_key','p_limit'],roora_verify:['p_code_hash'],roora_submit:['p_code_hash','p_name','p_attending','p_guests','p_dietary','p_travel','p_message','p_request_id'],roora_admin_snapshot:[]};
const rpc=createServer(async(req,res)=>{try{assert.equal(req.headers.authorization,`Bearer ${key}`);const name=req.url.split('/').pop(),params=contracts[name];if(!params){res.writeHead(404).end();return;}let raw='';for await(const part of req)raw+=part;const body=JSON.parse(raw);const result=await db.query(`select public.${name}(${params.map((_,i)=>'$'+(i+1)).join(',')}) as result`,params.map(p=>body[p]));res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(result.rows[0].result));}catch(error){res.writeHead(500,{'Content-Type':'application/json'}).end(JSON.stringify({error:error.message}));}});
await new Promise(resolve=>rpc.listen(3021,'127.0.0.1',resolve));
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3020'],{env:{...process.env,ROORA_DEMO_MODE:'0',SUPABASE_URL:'http://127.0.0.1:3021',SUPABASE_SERVICE_ROLE_KEY:key,INVITATION_PEPPER:pepper,ADMIN_TOKEN:admin},stdio:['ignore','pipe','pipe']});
server.stdout.on('data',d=>process.stdout.write(d));server.stderr.on('data',d=>process.stderr.write(d));
const base='http://127.0.0.1:3020';let checks=0;
const post=(path,body)=>fetch(`${base}/api/${path}`,{method:'POST',headers:{'Content-Type':'application/json','x-vercel-forwarded-for':'192.0.2.10'},body:JSON.stringify(body)});
try{
 let ready=false;for(let i=0;i<80;i++){try{if((await fetch(base)).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}assert.ok(ready);
 const invitation=await post('invitation',{code:'TEST2027'});assert.equal(invitation.status,200);assert.equal((await invitation.json()).maxGuests,2);checks++;
 assert.equal((await post('invitation',{code:'UNKNOWN2027'})).status,404);checks++;
 const payload={code:'TEST2027',name:'Isolated QA guest',attendance:'yes',guests:2,travel:'no',dietary:'',message:'Test only',requestId:'isolated-retry-001'};
 const accepted=await post('rsvp',payload);assert.equal(accepted.status,200);const reference=(await accepted.json()).reference;assert.ok(reference);checks++;
 assert.equal((await (await post('rsvp',payload)).json()).reference,reference);checks++;
 assert.equal((await post('rsvp',{...payload,guests:1})).status,409);checks++;
 assert.equal((await post('rsvp',{...payload,requestId:'over-allowance-001',guests:3})).status,400);checks++;
 const simultaneous=await Promise.all([post('rsvp',{...payload,requestId:'simultaneous-001'}),post('rsvp',{...payload,requestId:'simultaneous-001'})]);for(const r of simultaneous)assert.equal((await r.json()).reference,reference);checks++;
 const decline=await post('rsvp',{...payload,requestId:'decline-request-001',attendance:'no',guests:0,travel:null});assert.equal(decline.status,200);assert.equal((await db.query('select attending,guests,travel from public.roora_responses')).rows[0].attending,false);checks++;
 assert.equal((await fetch(`${base}/api/admin`)).status,401);checks++;
 const snapshot=await fetch(`${base}/api/admin`,{headers:{Authorization:`Bearer ${admin}`}});assert.equal(snapshot.status,200);assert.equal((await snapshot.json()).summary.declines,1);checks++;
 await db.query('update public.roora_invitations set allow_updates=false');assert.equal((await post('rsvp',{...payload,requestId:'blocked-update-001'})).status,409);checks++;
 await db.query('update public.roora_invitations set active=false');assert.equal((await post('invitation',{code:'TEST2027'})).status,404);checks++;
 assert.equal((await db.query('select count(*)::int as n from public.roora_responses')).rows[0].n,1);checks++;
 console.log(`${checks} isolated live-mode Next.js -> HTTP RPC -> PostgreSQL integration checks passed. No hosted service or real guest records were used.`);
}finally{server.kill('SIGTERM');await new Promise(resolve=>rpc.close(resolve));await db.close();}
