# DHCraft Brand Assets

Official brand assets for **Digital Humanities Craft**.

## Structure

```
svg/      — Vector source files (SVG)
png/      — Raster exports (PNG)
pdf/      — Print-ready files (PDF)
favicon/  — Favicon sets (watercolor; current/ = live dhcraft.org favicon)
scripts/  — Reproducible tooling (SVG → PNG export, raster derivatives, icons)
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
transparent / web / link-preview / mark-only variants are derived from the
PNG master. The transparent variant uses an edge flood-fill, so only the
outer white background is removed — the bright highlights inside the hexagon
stay intact. Avatar and favicons are built from the text-free mark.

```
cd scripts
node derive-raster.mjs       # transparent / web / social-preview / mark-only (no text)
node make-icons.mjs          # square avatar + favicon set (from the mark)
```

### Favicon embedding

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
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
| `dhcraft_logo_watercolor_avatar` | PNG | Square profile picture (1024², white bg) |
| `favicon/` | ICO, PNG | Watercolor favicon set + app icons (16–512, apple-touch, `.ico`) |
| `favicon/current/` | ICO, PNG | Favicon currently live on dhcraft.org (monochrome), mirrored |
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

## Colours and fonts

The palette and fonts of dhcraft.org (`dhcraft-site/src/styles/global.css`),
whose hues follow the watercolor logo. Websites, slides and figures use them.

| Token | Hex | Use |
|-------|-----|-----|
| paper | `#fdfcf8` | background |
| ink | `#1e2749` | text |
| ink-deep | `#161d38` | dark surfaces |
| purple | `#8a4fa3` | accent, marks of a single-series chart |
| purple-deep | `#5b3a78` | emphasised text, links |
| pink | `#c06bb0` | secondary accent |
| green | `#5c9e4a` | further hue of the logo |
| lime | `#a9c53d` | further hue of the logo |
| orange | `#e39a3b` | further hue of the logo |
| blue | `#85aede` | further hue of the logo |
| blue-deep | `#4a7ab8` | further hue of the logo |

The further hues serve categorical charts and illustrations, and a chart uses
them only after a colour-vision check of the chosen set.

Fonts: **Sora** for headings and titles, **Instrument Sans** for text, both
from Google Fonts. Code stays in a monospace font such as Consolas.

## Slides

- Background pure white (`#ffffff`), titles and text black (`#000000`), no grey
  text. Titles and headings in Sora, always bold; body text in Instrument Sans.
- The brand hues colour sublines, categories and the didactic token in a code
  example; text itself stays black. Not more than one emphasis per element.
- Code boxes white with a thin light-purple border; rules and connectors thin,
  in a brand hue, never grey.
- The watercolor logo with text stands on the title slide; content slides
  carry no logo.
- Charts on slides: one series in purple, text black, background white.
  Several series take further hues of the palette only after a colour-vision
  check.

## License

All rights reserved. These assets are proprietary to Digital Humanities Craft and may not be used without permission.
