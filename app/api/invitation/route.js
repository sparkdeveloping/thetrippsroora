import {configuration,hashCode,rpc,readJson,limit,json,fail} from '../../../src/server.mjs';
import {validCode} from '../../../src/validation.mjs';
export const runtime='nodejs';
export async function POST(request){try{const config=configuration();await limit(config,request,'verify',15);const body=await readJson(request);if(!validCode(body?.code))return json({error:'Enter a valid invitation code.'},400);const result=await rpc(config,'roora_verify',{p_code_hash:hashCode(body.code,config.pepper)});if(!result)return json({error:'That invitation code was not recognized.'},404);return json(result);}catch(e){return fail(e);}}
