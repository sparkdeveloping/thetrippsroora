import {configuration,authorized,rpc,limit,json,fail} from '../../../src/server.mjs';
export const runtime='nodejs';
export async function GET(request){try{const config=configuration();await limit(config,request,'admin',10);const token=request.headers.get('authorization')?.replace(/^Bearer /,'');if(!authorized(token,config.admin))return json({error:'Not authorized.'},401);return json(await rpc(config,'roora_admin_snapshot',{}));}catch(e){return fail(e);}}
