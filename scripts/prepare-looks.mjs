import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Coordinates on the approved reference boards' normalized design grids.
const boards = {
  women: { w: 658, h: 720, x: [0, 133, 262, 393, 523, 658], y: [[58, 347], [386, 676]] },
  men: { w: 682, h: 720, x: [0, 138, 275, 412, 549, 682], y: [[64, 329], [383, 644]] },
};
const output = new URL('../public/media/looks/', import.meta.url);
await mkdir(output, { recursive: true });
const manifest = [];
for (const [type, grid] of Object.entries(boards)) {
  const source = await readFile(new URL(`../public/media/attire-${type}.webp`, import.meta.url));
  const metadata = await sharp(source).metadata();
  for (let i = 0; i < 10; i++) {
    const column = i % 5, row = Math.floor(i / 5);
    const left = Math.round((grid.x[column] + 1) / grid.w * metadata.width);
    const right = Math.round((grid.x[column + 1] - 1) / grid.w * metadata.width);
    const top = Math.round((grid.y[row][0] + 1) / grid.h * metadata.height);
    const bottom = Math.round((grid.y[row][1] - 1) / grid.h * metadata.height);
    const file = `${type}-${String.fromCharCode(97 + i)}.webp`;
    const bytes = await sharp(source).extract({ left, top, width: right - left, height: bottom - top }).webp({ quality: 88 }).toBuffer();
    await writeFile(new URL(file, output), bytes);
    manifest.push({ file, width: right - left, height: bottom - top, bytes: bytes.length, source: `attire-${type}.webp`, sourceSHA256: createHash('sha256').update(source).digest('hex'), crop: { left, top, width: right - left, height: bottom - top } });
  }
}
await writeFile(new URL('manifest.json', output), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Prepared ${manifest.length} unchanged-color crops: ${manifest.reduce((n, f) => n + f.bytes, 0)} bytes.`);
