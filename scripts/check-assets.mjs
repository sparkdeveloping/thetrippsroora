import {readFile} from 'node:fs/promises';
const names=['story-meeting','story-promise','story-homecoming','closing-portrait','attire-women','attire-men'];
const missing=[];
for(const name of names){try{const b=await readFile(new URL(`../public/media/${name}.webp`,import.meta.url));if(b.length<16||b.toString('ascii',0,4)!=='RIFF'||b.toString('ascii',8,12)!=='WEBP'||b.readUInt32LE(4)+8!==b.length)throw Error('Invalid WebP container');console.log(`${name}: ${b.length} bytes`)}catch(e){missing.push(`${name}: ${e.message}`)}}
if(missing.length){console.error('Required family assets missing or invalid:\n'+missing.join('\n'));process.exitCode=1}else console.log('All six bundled family images verified. No network import required.');
