// Render SVG brand assets to high-resolution transparent PNGs.
//
// Uses headless Chromium (Playwright) so embedded @font-face base64 fonts,
// CSS and vector paths render exactly as in a browser — critical for the
// logo variants that embed the Inter typeface as base64 OTF.
//
// Usage:
//   node render-png.mjs            # render every svg/*.svg whose png/ is missing
//   node render-png.mjs --force    # (re)render all svg/*.svg
//   node render-png.mjs name.svg   # render specific file(s)
//
// Output: png/<name>.png, transparent background, long edge = LONG_EDGE px.

import { chromium } from 'playwright';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SVG_DIR = join(ROOT, 'svg');
const PNG_DIR = join(ROOT, 'png');
const LONG_EDGE = 2667; // matches existing dhcraft_logo_invert*.png

/** Extract intrinsic width/height from the root <svg> tag (width/height attrs, fallback viewBox). */
function intrinsicSize(svg) {
  const tag = svg.slice(svg.indexOf('<svg'), svg.indexOf('>', svg.indexOf('<svg')) + 1);
  const num = (s) => (s ? parseFloat(s[1]) : NaN);
  let w = num(tag.match(/\bwidth\s*=\s*"([\d.]+)/));
  let h = num(tag.match(/\bheight\s*=\s*"([\d.]+)/));
  if (!(w > 0) || !(h > 0)) {
    const vb = tag.match(/viewBox\s*=\s*"\s*[\d.+-]+\s+[\d.+-]+\s+([\d.+-]+)\s+([\d.+-]+)/);
    if (vb) { w = parseFloat(vb[1]); h = parseFloat(vb[2]); }
  }
  if (!(w > 0) || !(h > 0)) throw new Error('Could not determine SVG size');
  return { w, h };
}

const args = process.argv.slice(2);
const force = args.includes('--force');
const explicit = args.filter((a) => a.endsWith('.svg')).map(basename);

const candidates = (explicit.length ? explicit : readdirSync(SVG_DIR).filter((f) => f.endsWith('.svg')))
  .map((name) => ({ name, png: name.replace(/\.svg$/, '.png') }))
  .filter(({ png }) => force || explicit.length || !existsSync(join(PNG_DIR, png)));

if (!candidates.length) {
  console.log('Nothing to do — every SVG already has a PNG.');
  process.exit(0);
}

const browser = await chromium.launch();
try {
  for (const { name, png } of candidates) {
    const svg = readFileSync(join(SVG_DIR, name), 'utf8');
    const { w, h } = intrinsicSize(svg);
    const scale = LONG_EDGE / Math.max(w, h);
    const tw = Math.round(w * scale);
    const th = Math.round(h * scale);

    // Force the root <svg> to the target pixel size; viewBox preserves the artwork.
    const sized = svg.replace(
      /<svg([^>]*?)>/,
      (m, attrs) => `<svg${attrs.replace(/\s(width|height)\s*=\s*"[^"]*"/g, '')} width="${tw}" height="${th}">`
    );

    const page = await browser.newPage({ viewport: { width: tw, height: th } });
    await page.setContent(
      `<!doctype html><html><head><meta charset="utf-8">
       <style>html,body{margin:0;padding:0;background:transparent}svg{display:block}</style>
       </head><body>${sized}</body></html>`,
      { waitUntil: 'load' }
    );
    await page.evaluate(() => document.fonts.ready);

    const out = join(PNG_DIR, png);
    await page.locator('svg').screenshot({ path: out, omitBackground: true, type: 'png' });
    await page.close();
    console.log(`✓ ${png}  (${tw}×${th})`);
  }
} finally {
  await browser.close();
}
