import { spawn } from 'node:child_process';
const port = '3016';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',port], {env:{...process.env,ROORA_DEMO_MODE:'1'},stdio:['ignore','pipe','pipe']});
server.stdout.on('data',d=>process.stdout.write(d));server.stderr.on('data',d=>process.stderr.write(d));
const run = (args, extra={}) => new Promise((resolve,reject)=>{const child=spawn(process.execPath,args,{env:{...process.env,TEST_BASE_URL:`http://127.0.0.1:${port}`,CHROME_PATH:'/usr/bin/chromium',...extra},stdio:'inherit'});child.on('exit',code=>code===0?resolve():reject(Error(`Check exited ${code}`)));});
try{
 let ready=false;
 for(let i=0;i<80;i++){try{const r=await fetch(`http://127.0.0.1:${port}`);if(r.ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,100));}
 if(!ready)throw Error('Production server did not become ready');
 await run(['tests/production-http.mjs']);
 if(process.argv.includes('--lighthouse'))await run(['node_modules/lighthouse/cli/index.js',`http://127.0.0.1:${port}`,'--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage','--only-categories=performance,accessibility,best-practices','--output=json','--output=html','--output-path=docs/evidence/lighthouse-mobile','--save-assets','--quiet']);
}finally{server.kill('SIGTERM');}
