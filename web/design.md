---
type: design-document
created: 2026-11-10
tags: [hci, specification]
status: draft
scope: ui
---

# DHCraft web design

This document specifies the shared visual ground of the public DHCraft method sites, the Second Brain Vault method page, the Research Mission Control demo and the Promptotyping site. It names the tokens, the building blocks and the rules for applying them. Each site keeps its own `knowledge/design.md` for content hierarchy, project colours and interaction, and refers to this document for everything listed here.

## Agent briefing

- Copy the folder `web/` of this repository into the site, for example as `assets/dhcraft/`, and keep the files unchanged. A site that needs a different value overrides the custom property in its own stylesheet and records the override in its design document.
- Load `dhcraft-tokens.css` first, then `dhcraft-components.css`, then the site's own stylesheet. Load `dhcraft-copy.js` as a module where a page has code blocks.
- No build step, no framework, no runtime CDN. Fonts are served from `fonts/`, code uses the system monospace.
- `specimen.html` renders every building block in light and dark and is the comparison page for a review. Serve the repository root locally (`python -m http.server`) and open `web/specimen.html`.

## Design genesis

The values come from what already exists. The brand hues and fonts are those of dhcraft.org (`dhcraft-site/src/styles/global.css`), documented in the README of this repository. The type scale, gutter and dark ground follow the token layer of the Second Brain Vault method page (`second-brain-vault/docs/site.css`), which already translated the dhcraft.org palette for a reading page and was copied into `Promptotyping/intro/site.css`. The header with mark and name, the pill button and the dark footer of the Research Mission Control method page (`research-mission-control/site.css`) use the same palette in hex. Where these sources differed, the choice and its reason stand under Design rationale.

## Design system

### Colour

Brand hues stay unchanged and are available as `--dh-purple`, `--dh-purple-deep`, `--dh-pink`, `--dh-green`, `--dh-lime`, `--dh-orange`, `--dh-blue`, `--dh-blue-deep`, `--dh-paper`, `--dh-ink-brand` and `--dh-ink-deep`. Pages use role tokens for text and surfaces. Each role holds a light and a dark value in `light-dark()`.

| Role | Light | Dark | Use | Lowest WCAG 2 ratio |
|---|---|---|---|---|
| `--dh-ground` | `#fdfcf8` | `#161d38` | page background | |
| `--dh-ground-alt` | `#f6f4ec` | `#121932` | bands, code blocks, figure frames | |
| `--dh-surface` | `#ffffff` | `#1e2749` | cards, raised panels | |
| `--dh-ink` | `#1e2749` | `#fdfcf8` | text | 13.2 |
| `--dh-ink-soft` | `#576078` | `#b6bdd2` | secondary text, captions | 5.6 |
| `--dh-accent` | `#8a4fa3` | `#ca91e3` | marks, primary button, focus ring | 5.1 |
| `--dh-on-accent` | `#ffffff` | `#161d38` | text on accent | 5.6 |
| `--dh-link` | `#5b3a78` | `#e1b9f3` | links | 8.2 |
| `--dh-line` | `#dedce4` | `#2c3561` | decorative hairline | none required |
| `--dh-line-strong` | `#7f8499` | `#7a84a8` | boundary of a control | 3.3 |

The lowest ratio is measured against every ground and surface of the same scheme. Text roles pass AA for normal text (4.5:1), control boundaries pass the 3:1 of non-text contrast. The dark scheme uses the brand's ink-deep as ground and ink as surface, so dark pages stay within the palette.

The page follows the system setting. `data-theme="light"` or `data-theme="dark"` on `<html>` fixes the scheme, and the class `dh-dark` turns any element into a dark island, for example a header that is always dark. A site with a theme toggle sets `data-theme`.

Further hues mark categories in charts and diagrams. They carry no text and are used only after a contrast and colour-vision check of the chosen set, as the README requires. Project-specific colour systems, such as the function colours of Promptotyping or the status colours of Mission Control, stay in the project and sit on top of these roles.

### Type

| Token | Value |
|---|---|
| `--dh-font-display` | Sora 600 and 700, for headings and the site name |
| `--dh-font-text` | Instrument Sans 400 and 600, for all other text |
| `--dh-font-mono` | system monospace (`ui-monospace`, Cascadia Mono, Consolas, Menlo) |
| `--dh-step--1` | captions, footer, metadata |
| `--dh-step-0` | body text |
| `--dh-step-1` | h3 |
| `--dh-step-2` | h2 |
| `--dh-step-3` | h1 |

The steps are fluid `clamp()` values from about 0.84 to 3.5 rem. Body text runs at line height 1.6, headings at 1.2. Fonts are Latin subsets in WOFF2 under the SIL Open Font License, whose texts lie beside them.

### Space, shape and lines

- Space steps `--dh-space-1` to `--dh-space-7` are 0.25, 0.5, 0.75, 1, 1.5, 2 and 3 rem. `--dh-gutter` is the fluid side margin of the page.
- `--dh-measure` (72ch) bounds prose, `--dh-page` (75rem) bounds the page frame. Work areas such as tables or diagrams may use the page width.
- `--dh-radius-s` (0.375rem) for small controls, `--dh-radius-m` (0.75rem) for cards, code blocks and figures, `--dh-radius-pill` for buttons.
- `--dh-hairline` is 1px. A line marks a boundary the reader needs, between header and page or around a control. Full-width decorative rules are not used.
- `--dh-tap` (2.75rem) is the minimum height of a button and of the brand link.
- Focus is a 2px outline in the accent with 3px offset on every focusable element, set through `:focus-visible`.

## Interaction design

- The header carries the brand and the navigation on a solid background. The current page has `aria-current` and an accent underline. On narrow screens the navigation takes its own line and scrolls sideways inside itself, never the page.
- Links in prose are underlined. Links in navigation and lists are not underlined at rest and underline on hover and focus.
- A card that is a link as a whole puts the link on its heading. The link stretches over the card, and the card shows the focus ring. A card with a heading link holds no second link.
- The copy button appears only where the Clipboard API exists, in the row above its code block. After copying it reads Copied (Kopiert) for two seconds. A failure stays visible until the next attempt.
- A diagram wider than the screen scrolls inside its frame. An SVG diagram uses `currentColor` for lines and text, so it follows the scheme, and `--dh-accent` for the one element it emphasises.
- Transitions are limited to colour changes of 0.15 s and are off under `prefers-reduced-motion`.

## Component architecture

All building blocks live in `@layer dh`. An unlayered rule of a site therefore overrides them without raising specificity. A site that uses its own layers puts `dh` first in its layer order.

| Class | Markup | Purpose |
|---|---|---|
| `dh-head` | `header` with `a.dh-brand` and `nav.dh-nav > ul` | site header |
| `dh-brand` | link with `img` (`dhcraft-mark-watercolor-128.png`, empty `alt`) and the site name as text | mark and name, linking to the site's start page |
| `dh-foot` | `footer` with one `p` each for publisher, licence and source | site footer |
| `dh-card`, `dh-cards` | `article.dh-card` in a `div.dh-cards` grid | self-contained objects with comparable siblings |
| `dh-btn`, `dh-btn--primary` | `a` or `button` | actions; one primary action per view |
| `dh-code` | `figure.dh-code` with optional `figcaption` and one `pre` | code and prompts, copy button added by script |
| `dh-figure` | `figure.dh-figure` with `div.dh-figure__canvas` and `figcaption` | diagrams |
| `dh-skip`, `dh-page`, `dh-prose` | skip link, page frame, reading width | layout helpers |

The brand mark is the coloured watercolour variant of the DHCraft logo, here as a transparent raster of 128 px height derived from `png/dhcraft_logo_watercolor_transparent.png` by proportional scaling with premultiplied alpha. It stands at 2rem height and works on both schemes. The site name beside it is the name of the site, such as Promptotyping. The footer names Digital Humanities Craft and links to dhcraft.org. The favicon comes from `favicon/`.

The footer carries three statements. The publisher reads Digital Humanities Craft with a link to https://dhcraft.org. The licence names the site's own terms, for these sites text under CC BY 4.0 and code under MIT, and notes that the DHCraft logo is excluded. The source links the public repository.

## Interface language

These rules apply to every visible string, including headings, navigation, button labels, captions, alt text and the footer.

- A title or heading names its subject, the method, the document or the question. Title formulas of the kind From X to Y are not used.
- No metaphors, punchlines or promotional framing. The interface describes what a page contains and what an action does.
- No advice-giving address to the reader in the style of a guidebook. Instructions state the step.
- No middle dot (U+00B7) as a separator. Separate items by line break, normal punctuation or separate elements.
- No emojis.
- No dash or colon used to join clauses. A colon stands only before a list, a quotation or code, and a dash only in ranges such as 1427–1496.
- A control is named after its function. A state keeps one word across all views.

## Design rationale

- Hex values are kept for the brand hues because the README of this repository and dhcraft.org define them in hex. The Second Brain Vault page holds the same hues in OKLCH. The OKLCH values of that page are conversions of these hex values.
- The light ground is the brand paper `#fdfcf8`, as on dhcraft.org and both existing method pages. The dark ground is the brand's ink-deep `#161d38`, which keeps dark pages inside the palette. The Second Brain Vault night ground, a deeper navy outside the palette, was not taken over.
- Secondary text is `#576078`, already used on the Research Mission Control page, because it reaches 5.6:1 on every light surface.
- In dark mode the brand purple reaches only 2.9:1 on the dark ground, so the accent there is the lighter purple of the Second Brain Vault night scheme, converted to hex.
- Sora and Instrument Sans are the dhcraft.org fonts. They are served locally because a runtime font CDN transmits reader data to a third party.
- The reading width is 72ch because the house rule asks for about 80 characters per line. Since `ch` measures the digit zero, 80ch was observed to yield about 75 to 90 characters, so 72ch is expected to stay near 80 without exceeding it.
- The page width of 75rem matches the 1200 px frame of dhcraft.org and of the Research Mission Control page.
- Buttons are pills, as on dhcraft.org and both method pages. Cards and code use one medium radius, because the sources varied between 0.5 and 1 rem without a stated reason.
- Building blocks sit in a cascade layer so that adopting sites keep control of every detail without specificity overrides.
- The set holds only what all three sites need. Hero sections, graphs, glossaries, side panels and status systems remain project components.

## Page structure of a method site

Decided by the owner on 2026-11-10 for the method sites Promptotyping, Second Brain Vault, Grounded Vault and Research Mission Control. Each site is one static page that a reader takes in within two minutes, with the same seven parts in the same order, so that someone who knows one site finds their way on the others. A site adds a further page only for a tool of its own, such as a demo or an explorer, and links it from the page.

1. Title, the name of the method, with an abstract of two or three sentences that says what it is and for whom.
2. Main figure, one diagram from which the core terms, the concepts and the process can all be read. Every term the page uses later appears in it, and the page refers back to it instead of introducing a second diagram for the same thing.
3. What it is and where it comes from, a short description with the origin of the method and the publication to cite.
4. Formal description, the terms of the figure defined in running prose directly under it, each in one or two sentences, with links to the full specification in the repository inside the sentences.
5. Reuse, how to take the repository and start working, as a short numbered list with copyable commands and prompts.
6. Example, one didactic demo on invented or public material that a reader can run through, with the prompts in the order in which they are used and what each one yields.
7. Limits, licence and citation, what the method does not establish, under which terms it may be reused and how to cite it.

### Decisions of 2026-11-10 after the owner's review of the first sites

The Promptotyping start page is the reference for layout, type and overall look. The other method sites follow it.

- Colour. The four hues of the mark, green, blue, purple and orange, are the shared scheme of all sites and figures. Purple stays the accent for actions. Green, blue and orange mark categories in figures and lists, each with a text label, and always in the same role across the sites once a role is assigned.
- Light by default. A site opens in the light scheme whatever the system setting, and the dark scheme is reached only through the toggle in the header. The owner rejected the dark ground of the first Second Brain page.
- Main figure first. The main figure stands at the very top, directly under title and abstract, as a self-contained SVG that can also be used in a paper and on slides. No heading above it and no caption block below it.
- Prose under the figure. The text that explains the figure starts directly under it as running prose in two or three short paragraphs. It defines the terms of the figure in sentences, with links to the specification, the glossary and the cited publication inside the sentences. No definition list with several tiers per term and no separate reference line.
- No button row beside the abstract. Reuse, example and specification are reached by scrolling and from the header.
- Entries with at most three levels. A recurring entry, such as a step with a prompt, a template or a case, has at most three levels of text, and so does everything that stands before the first entry of a page. Links inside an entry share one form.
- Copy fields. A prompt or command stands in a field with a dashed border, slightly indented from the surrounding text and set in the monospace face. Copying is an icon inside the field with an accessible name and a visible confirmation, without a word beside it.
- One page. A method site is one page whose header navigation jumps to its parts. A further page exists only for a tool or a reading purpose of its own that the page does not serve.
- Downloads set apart. Files to take away, such as templates or a skill, stand in their own visually separate block with one clear download control per file and one control that downloads all of them as an archive. Explanatory prose stays outside this block.

Text stays short. A part has a heading, at most two sentences of prose and then a figure, a short list or a copyable block. What the README or the specification carries better is linked and not repeated.

## Licence

The CSS and JavaScript files of this folder are offered to the DHCraft sites under the MIT licence once the repository records that decision, the fonts are under the SIL Open Font License 1.1, and the logo files remain under the repository's all-rights-reserved terms. Until then the repository licence applies to the whole folder.
