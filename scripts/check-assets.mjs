import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const originals=JSON.parse(await readFile(new URL('../public/media/originals.json',import.meta.url)));
const looks=JSON.parse(await readFile(new URL('../public/media/looks/manifest.json',import.meta.url)));
if(Object.keys(originals).length!==6||looks.length!==20)throw Error('The complete six-original, twenty-look asset set is required.');
for(const [name,expected] of Object.entries(originals)){const bytes=await readFile(new URL(`../public/media/${name}`,import.meta.url));if(createHash('sha256').update(bytes).digest('hex')!==expected)throw Error(`Approved original changed: ${name}`);await sharp(bytes).stats();}
for(const look of looks){const bytes=await readFile(new URL(`../public/media/looks/${look.file}`,import.meta.url));const metadata=await sharp(bytes).metadata();if(metadata.width!==look.width||metadata.height!==look.height||bytes.length!==look.bytes)throw Error(`Invalid look: ${look.file}`);if(originals[look.source]!==look.sourceSHA256)throw Error(`Crop source mismatch: ${look.file}`);await sharp(bytes).stats();}
console.log('6 approved original hashes and 20 decoded outfit crops verified.');
