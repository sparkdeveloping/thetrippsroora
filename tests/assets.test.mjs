import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
test('six original hashes and all twenty cropped images decode correctly', async () => {
 const originals=JSON.parse(await readFile(new URL('../public/media/originals.json',import.meta.url)));
 assert.equal(Object.keys(originals).length,6);
 for(const [name,hash] of Object.entries(originals)){const bytes=await readFile(new URL(`../public/media/${name}`,import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),hash);await sharp(bytes).stats();}
 const looks=JSON.parse(await readFile(new URL('../public/media/looks/manifest.json',import.meta.url)));assert.equal(looks.length,20);
 for(const look of looks){const bytes=await readFile(new URL(`../public/media/looks/${look.file}`,import.meta.url));const metadata=await sharp(bytes).metadata();assert.equal(metadata.width,look.width);assert.equal(metadata.height,look.height);assert.equal(bytes.length,look.bytes);await sharp(bytes).stats();}
});
