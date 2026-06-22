// Derive raster variants of the watercolor color logo from the PNG master.
//
//   <name>.png                 -> master (white background, full resolution)
//   <name>_transparent.png     -> white background removed via edge flood-fill
//   <name>_web.png             -> downscaled (long edge WEB_EDGE) for web use
//   <name>_social-preview.png  -> fitted onto a 1200x630 white link-preview
//                                 canvas (Open-Graph dimensions)
//
//   dhcraft_logo_watercolor.png             -> hexagon mark only (no text), white bg
//   dhcraft_logo_watercolor_transparent.png -> hexagon mark only, transparent
//
// The transparent variant uses a flood-fill seeded from the image border so
// only the *outer* white background is removed. Bright highlights inside the
// hexagon (flower centers) are enclosed by the dark frame and stay opaque.
// The mark-only variants crop the upper ink band (the hexagon) located via
// the transparent export's alpha profile, dropping the title/tagline text.
//
// Usage: node derive-raster.mjs

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PNG_DIR = join(ROOT, 'png');
const BASE = 'dhcraft_logo_watercolor+text';
const MARK = 'dhcraft_logo_watercolor'; // text-free hexagon mark

const WHITE_T = 240; // a pixel counts as background-white if R,G,B all >= this
const WEB_EDGE = 1600; // long edge of the web-optimized export
const PREVIEW = { w: 1200, h: 630 }; // link-preview canvas (Open-Graph dimensions)

const master = join(PNG_DIR, `${BASE}.png`);
const transparentFile = join(PNG_DIR, `${BASE}_transparent.png`);

// ---- 1. Transparent variant (edge flood-fill) -----------------------------
async function makeTransparent() {
  const { data, info } = await sharp(master)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const N = w * h;

  const visited = new Uint8Array(N);
  const stack = new Int32Array(N);
  let sp = 0;

  const isWhite = (i) => {
    const p = i * 4;
    return data[p] >= WHITE_T && data[p + 1] >= WHITE_T && data[p + 2] >= WHITE_T;
  };
  const push = (i) => {
    if (!visited[i] && isWhite(i)) {
      visited[i] = 1;
      stack[sp++] = i;
    }
  };

  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }

  while (sp > 0) {
    const i = stack[--sp];
    const x = i % w;
    const y = (i - x) / w;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (y > 0) push(i - w);
    if (y < h - 1) push(i + w);
  }

  let cleared = 0;
  for (let i = 0; i < N; i++) {
    if (visited[i]) { data[i * 4 + 3] = 0; cleared++; }
  }

  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(transparentFile);
  console.log(`✓ ${BASE}_transparent.png  (${w}×${h}, ${(cleared / N * 100).toFixed(1)}% cleared)`);
}

// ---- 2. Web-optimized variant ---------------------------------------------
async function makeWeb() {
  const out = join(PNG_DIR, `${BASE}_web.png`);
  // Full color depth (no palette) to avoid banding in the watercolor gradients.
  const info = await sharp(master)
    .resize({ width: WEB_EDGE, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`✓ ${BASE}_web.png  (${info.width}×${info.height})`);
}

// ---- 3. Social / link-preview variant (Open-Graph) ------------------------
async function makeSocialPreview() {
  const out = join(PNG_DIR, `${BASE}_social-preview.png`);
  await sharp(master)
    .resize({ width: PREVIEW.w, height: PREVIEW.h, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`✓ ${BASE}_social-preview.png  (${PREVIEW.w}×${PREVIEW.h})`);
}

// ---- 4. Mark-only variants (hexagon without text) -------------------------
async function makeLogoOnly() {
  // Locate the hexagon via the transparent export: it is the first (top) band
  // of non-transparent rows; the title/tagline form separate bands below,
  // separated by a tall fully-transparent gap.
  const { data, info } = await sharp(transparentFile)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  const ALPHA_T = 16;                          // treat alpha <= this as empty
  const ROW_T = Math.max(8, Math.round(w * 0.003)); // min ink px for a non-empty row
  const GAP = Math.round(h * 0.02);            // empty-row run that ends a band

  const rowInk = new Int32Array(h);
  for (let y = 0; y < h; y++) {
    let c = 0;
    const base = y * w * 4;
    for (let x = 0; x < w; x++) if (data[base + x * 4 + 3] > ALPHA_T) c++;
    rowInk[y] = c;
  }

  let top = 0;
  while (top < h && rowInk[top] <= ROW_T) top++;
  let bandEnd = h - 1, empty = 0;
  for (let y = top; y < h; y++) {
    if (rowInk[y] <= ROW_T) { if (++empty >= GAP) { bandEnd = y - empty; break; } }
    else empty = 0;
  }

  // Tight bounding box using a per-column / per-row ink threshold, so isolated
  // stray pixels in the transparent background can't inflate the crop (that
  // previously pulled the left edge ~940 px out into white space).
  const bandH = bandEnd - top + 1;
  const col = new Int32Array(w);
  for (let y = top; y <= bandEnd; y++) {
    const b = y * w * 4;
    for (let x = 0; x < w; x++) if (data[b + x * 4 + 3] > ALPHA_T) col[x]++;
  }
  const COL_T = Math.max(8, Math.round(bandH * 0.004)); // ~9 px of ink to count as an edge
  let left = 0; while (left < w && col[left] < COL_T) left++;
  let right = w - 1; while (right > left && col[right] < COL_T) right--;

  // refine top/bottom within [left,right] the same way
  const ROW_T2 = Math.max(8, Math.round((right - left + 1) * 0.004));
  let t2 = top;
  for (; t2 <= bandEnd; t2++) {
    let c = 0; const b = t2 * w * 4;
    for (let x = left; x <= right; x++) if (data[b + x * 4 + 3] > ALPHA_T) c++;
    if (c >= ROW_T2) break;
  }
  let b2 = bandEnd;
  for (; b2 > t2; b2--) {
    let c = 0; const b = b2 * w * 4;
    for (let x = left; x <= right; x++) if (data[b + x * 4 + 3] > ALPHA_T) c++;
    if (c >= ROW_T2) break;
  }

  const region = { left, top: t2, width: right - left + 1, height: b2 - t2 + 1 };
  await sharp(transparentFile).extract(region).png({ compressionLevel: 9 }).toFile(join(PNG_DIR, `${MARK}_transparent.png`));
  await sharp(master).extract(region).png({ compressionLevel: 9 }).toFile(join(PNG_DIR, `${MARK}.png`));
  console.log(`✓ ${MARK}.png / _transparent.png  (${region.width}×${region.height} crop)`);
}

await makeTransparent();
await makeWeb();
await makeSocialPreview();
await makeLogoOnly();
