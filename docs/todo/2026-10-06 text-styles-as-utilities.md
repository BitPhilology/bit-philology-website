# To do: text styles as Tailwind utilities

- **Status:** to do, not started
- **Added:** 2026-10-06

## Context

The Figma text styles are now the `TEXT` map in `src/lib/styles/text.ts`, read by 17 components and by `markdown.ts` as `TEXT['card/title']`. The maintainer wants what they first pictured: Tailwind custom utilities, one per Figma style, written with the existing Tailwind utilities, living in `src/lib/styles/tokens.css`. Markup then reads `class="text-body-lg"`, and `text.ts` goes away.

Decision taken: the utilities are named `text-` + the Figma name with slashes turned into hyphens (same rule as the colour tokens): `heading/h1` → `text-heading-h1`, `body/body-lg` → `text-body-lg`, `card/title` → `text-card-title`, `pixel/caption` → `text-pixel-caption`.

## The one technical risk (check first)

`src/app.css` imports tokens.css as `@import "./lib/styles/tokens.css" layer(tokens)`. Tailwind v4 throws "`@utility` cannot be nested" when `@utility` sits inside a wrapper such as that `@layer`, whose node is a parent (checked in `node_modules/tailwindcss/dist/lib.js`). `@theme` is exempt, which is why tokens.css works today.

Step 0 is therefore a spike: add one `@utility` to tokens.css and run `npm run build`.
- If it builds: carry on.
- If it fails (expected): import tokens.css without `layer(tokens)` in `src/app.css`. This changes nothing visible: tokens.css holds only `@theme` blocks, which Tailwind already merges into the `theme` layer, so the `tokens` layer is empty today; and `@utility` output goes into Tailwind's `utilities` layer in any case. Keep `tokens` in the `@layer` order line, and update the CSS architecture section of CLAUDE.md to say so.

## Changes

1. **`src/lib/styles/tokens.css`** — add a third section "Text styles" with one `@utility` per style of `TEXT`, using `@apply` with the same utilities as now (sizes, leading, weight, tracking, `font-mono`, `font-pixel*`). Move the comments about the nearest-utility approximations (line height 1.2 → `leading-tight`, 0.9 → `leading-none`, tracking, 11 px → `text-xs`) from `text.ts` next to each style. The 19 styles: display/page-title, heading/h1–h6, body/lead-paragraph, body/body, body/body-lg, body/strong, body/blockquote, card/title, card/subtitle, card/authors, card/venue, code/code, pixel/metadata, pixel/caption, pixel/note. Update the header comment of the file (it now holds fonts, colours and text styles).
2. **Page title**: `PAGE_TITLE` becomes a utility too, `text-page-title`: heading/h1 on phones and display/page-title from `sm`, written with `sm:` variants inside `@apply`. `PageHeader.svelte` uses it.
3. **Components** (mechanical, 17 files, about 36 uses): remove `import { TEXT } …` and replace each `TEXT['x/y']` with the literal class `text-x-y`. Where the style sits in a map or a condition (`PostBody` description styles, `PublicationBody` long-title switch, `PageSheet`, `PageIndex`), keep the structure and use the literal class names as strings, so that Tailwind's scanner sees them. Files: Pill, NavDockItem, PageSheet, PageIndex, EventHeader, CategorySignifier, PublicationBody, PublicationHeader, ImageFigure, PageHeader, SideNote, TeamMember, Colophon, PostBody (plus the ones the grep finds under `src/lib`).
4. **`src/lib/styles/markdown.ts`**: drop the `TEXT` import; `MARKDOWN_CLASSES` and `LEAD_CLASSES` use the class names (`'text-heading-h2 scroll-mt-4'`, …). The file stays: it still maps the HTML tags to classes at build time.
5. **Delete `src/lib/styles/text.ts`.**
6. **Docs**:
   - `CLAUDE.md`, "Text styles": the Figma text styles are the `text-*` utilities in `tokens.css`; same rules (nearest Tailwind utility, Figma value in a comment, font-variable axes exact). Update the `tokens` layer paragraph if step 0 requires the unlayered import.
   - `docs/ARCHITECTURE.md`: the "Text styles" section (around lines 267–292, the table maps Figma style → utility), the conventions line near 305 and "Change a text style" near 314; the `src/lib/styles/` row of the file table (no more `text.ts`).
   - Leave the dated session summaries as they are (history).

## Verification

- `npm run check` (no leftover `TEXT` or `PAGE_TITLE` import) and `grep -rn "TEXT\[\|styles/text" src docs CLAUDE.md` returns nothing outside dated summaries.
- `npm run build` and `BASE_PATH=/bit-philology-website npm run build`.
- In the built CSS (`build/_app/immutable/assets/*.css`) every `text-…` utility appears once with the expected declarations; compare sizes, weights and leading with the table in ARCHITECTURE.md.
- Look at Home, a page with a long body (lists, quote, code), a publication page, the Team page and the nav dock in `npm run dev`, before and after: the text must look identical (this is a refactor, no visual change expected).
