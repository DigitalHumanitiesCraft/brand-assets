// Generate the square profile avatar and a full favicon set from the
// text-free watercolor mark (png/dhcraft_logo_watercolor_transparent.png).
//
//   png/dhcraft_logo_watercolor_avatar.png  -> 1024x1024 profile picture, white bg
//   favicon/favicon-16.png  favicon-32.png  favicon-48.png   (transparent, browser tab)
//   favicon/apple-touch-icon.png   (180, white bg — iOS rounds the corners)
//   favicon/favicon-192.png  favicon-512.png   (white bg — Android / PWA)
//   favicon/favicon.ico   (multi-size 16/32/48)
//
// The mark is centered on a square canvas with size-dependent padding so it
// stays clear when cropped to a circle (avatars) or shrunk to a tab icon.
//
// Usage: node make-icons.mjs

import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PNG_DIR = join(ROOT, 'png');
const FAVICON_DIR = join(ROOT, 'favicon');
const markFile = join(PNG_DIR, 'dhcraft_logo_watercolor_transparent.png');

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const NONE = { r: 255, g: 255, b: 255, alpha: 0 };

// Render the mark centered on a size×size canvas. fill = fraction of the
// canvas the mark's long edge occupies (rest is padding).
async function squareIcon(size, fill, bg) {
  const inner = Math.round(size * fill);
  const mark = await sharp(markFile)
    .resize({ width: inner, height: inner, fit: 'inside' })
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: mark, gravity: 'center' }])
    .png({ compressionLevel: 9 });
}

await mkdir(FAVICON_DIR, { recursive: true });

// --- Profile avatar (white, safe for circular crop) ---
await (await squareIcon(1024, 0.84, WHITE)).toFile(join(PNG_DIR, 'dhcraft_logo_watercolor_avatar.png'));
console.log('✓ png/dhcraft_logo_watercolor_avatar.png  (1024×1024, white)');

// --- Browser-tab favicons (transparent, near-full for legibility) ---
for (const s of [16, 32, 48]) {
  await (await squareIcon(s, 0.96, NONE)).toFile(join(FAVICON_DIR, `favicon-${s}.png`));
}
console.log('✓ favicon/favicon-16/32/48.png  (transparent)');

// --- Apple touch icon (white, padded safe area) ---
await (await squareIcon(180, 0.80, WHITE)).toFile(join(FAVICON_DIR, 'apple-touch-icon.png'));
console.log('✓ favicon/apple-touch-icon.png  (180×180, white)');

// --- Android / PWA icons (white) ---
for (const s of [192, 512]) {
  await (await squareIcon(s, 0.82, WHITE)).toFile(join(FAVICON_DIR, `favicon-${s}.png`));
}
console.log('✓ favicon/favicon-192/512.png  (white)');

// --- Multi-size favicon.ico (16/32/48) ---
const icoBufs = [];
for (const s of [16, 32, 48]) icoBufs.push(await (await squareIcon(s, 0.96, NONE)).toBuffer());
await writeFile(join(FAVICON_DIR, 'favicon.ico'), await pngToIco(icoBufs));
console.log('✓ favicon/favicon.ico  (16/32/48)');
