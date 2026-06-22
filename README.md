# DHCraft Brand Assets

Official brand assets for **Digital Humanities Craft**.

## Structure

```
svg/      — Vector source files (SVG)
png/      — Raster exports (PNG)
pdf/      — Print-ready files (PDF)
scripts/  — Reproducible tooling (SVG → PNG export, raster derivatives)
```

### Regenerating PNGs

PNG exports are rendered from the SVG sources with headless Chromium
(via Playwright), so embedded `@font-face` fonts render correctly.

```
cd scripts
npm install
npx playwright install chromium
npm run render-png          # render any SVG missing its PNG (long edge 2667 px, transparent)
```

### Raster derivatives (watercolor logo)

The watercolor logo is a raster artwork (no vector source), so its
transparent / web / Open-Graph variants are derived from the PNG master.
The transparent variant uses an edge flood-fill, so only the outer white
background is removed — the bright highlights inside the hexagon stay intact.

```
cd scripts
node derive-raster.mjs       # transparent / web / social-preview / mark-only (no text)
```

## Assets

| Asset | Formats | Description |
|-------|---------|-------------|
| `dhcraft_logo_invert` | SVG, PNG, PDF | Primary logo (inverted) |
| `dhcraft_logo_invert_white` | SVG, PNG | White variant for dark backgrounds |
| `dhcraft_logo_invert+text` | SVG, PNG | Logo with company name (original) |
| `dhcraft_logo_invert+text-horizontal` | SVG, PNG | Logo with company name (horizontal layout) |
| `dhcraft_logo_invert+text-vertical` | SVG, PNG | Logo with company name (vertical layout) |
| `dhcraft_logo_watercolor` | PNG | **Color** watercolor mark — hexagon only, no text (white bg) |
| `dhcraft_logo_watercolor_transparent` | PNG | Watercolor mark, transparent — works on any background |
| `dhcraft_logo_watercolor+text` | PNG, PDF | Watercolor logo with name & tagline (master, 5765 px) |
| `dhcraft_logo_watercolor+text_transparent` | PNG | Background removed — for light/mid backgrounds (dark title text) |
| `dhcraft_logo_watercolor+text_web` | PNG | Web-optimized export (1600 px, full color) |
| `dhcraft_logo_watercolor+text_social-preview` | PNG | Link/social preview image (1200 × 630, Open-Graph) |
| `dhcraft_stempel` | PDF | Company stamp |
| `exc` | SVG, PNG | Exclamation mark / secondary mark |
| `exc-notext` | PNG | Secondary mark without text |
| `ex-favi` | PNG | Favicon |

## Usage

- Prefer **SVG** for digital use (web, screen).
- Use **PNG** where SVG is not supported.
- Use **PDF** for print materials.
- The **watercolor** logo is the color variant; the monochrome `*_invert`
  logos remain the primary marks. Its `_transparent` export suits light or
  mid-toned backgrounds (the title text is dark).
- Do not alter colors, proportions, or other visual properties of the logos.

## License

All rights reserved. These assets are proprietary to Digital Humanities Craft and may not be used without permission.
