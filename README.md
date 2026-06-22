# DHCraft Brand Assets

Official brand assets for **Digital Humanities Craft**.

## Structure

```
svg/      — Vector source files (SVG)
png/      — Raster exports (PNG)
pdf/      — Print-ready files (PDF)
scripts/  — Reproducible tooling (SVG → PNG export)
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

## Assets

| Asset | Formats | Description |
|-------|---------|-------------|
| `dhcraft_logo_invert` | SVG, PNG, PDF | Primary logo (inverted) |
| `dhcraft_logo_invert_white` | SVG, PNG | White variant for dark backgrounds |
| `dhcraft_logo_invert+text` | SVG, PNG | Logo with company name (original) |
| `dhcraft_logo_invert+text-horizontal` | SVG, PNG | Logo with company name (horizontal layout) |
| `dhcraft_logo_invert+text-vertical` | SVG, PNG | Logo with company name (vertical layout) |
| `dhcraft_stempel` | PDF | Company stamp |
| `exc` | SVG, PNG | Exclamation mark / secondary mark |
| `exc-notext` | PNG | Secondary mark without text |
| `ex-favi` | PNG | Favicon |

## Usage

- Prefer **SVG** for digital use (web, screen).
- Use **PNG** where SVG is not supported.
- Use **PDF** for print materials.
- Do not alter colors, proportions, or other visual properties of the logos.

## License

All rights reserved. These assets are proprietary to Digital Humanities Craft and may not be used without permission.
