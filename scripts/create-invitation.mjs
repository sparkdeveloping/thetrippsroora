import {randomBytes} from 'node:crypto';
import {hashCode} from '../src/server.mjs';
const [label,maxArg]=process.argv.slice(2);const max=Number(maxArg);
if(!label||label.length>120||!Number.isInteger(max)||max<1||max>20||!process.env.INVITATION_PEPPER||process.env.INVITATION_PEPPER.length<32){console.error('Usage: node --env-file=.env.local scripts/create-invitation.mjs "Household label" 2 (requires >=32-char INVITATION_PEPPER)');process.exit(1);}
const code=randomBytes(12).toString('hex').toUpperCase();const hash=hashCode(code,process.env.INVITATION_PEPPER);const safe=label.replaceAll("'","''");console.log('Private guest code (share securely, not in version control): '+code);console.log(`\nRun in SQL Editor:\ninsert into public.roora_invitations(code_hash,label,max_guests) values ('${hash}','${safe}',${max});`);
