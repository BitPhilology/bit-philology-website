# Bit Philology — session summary, 6 October 2026

- **Date of the summary:** 2026-10-06
- **Model used in this session:** Claude Sonnet 5.5, in Claude Code (VS Code)
- **Previous summary:** [2026-10-05 ai-assisted-session-summary.md](2026-10-05%20ai-assisted-session-summary.md). It already covers the event page, the publications, the Figma → Svelte sync of the post cards and the Credits note; this document only adds what came after.

---

## 1. Why text styles are a TypeScript map

The maintainer asked why the text styles are reached as `TEXT['body/body-lg']` and not with plain Tailwind utilities. The answer given:

- A Figma text style is a bundle of utilities (size, leading, weight, tracking, font family and axes), and the map keeps the Figma names and the notes on the approximations in one place.
- `markdown.ts` needs the styles as strings, because the renderer puts the classes on the HTML tags at build time.
- The price is indirection: the markup does not show the classes, and the project has a scheme of its own instead of the usual Tailwind one.
- The history shows `text.ts` from 1 October. The documents of that day only say "use the nearest Tailwind utility, no new absolute values"; they do not record a discussion of custom utilities as an alternative. So the map was a convenient choice, not a reasoned rejection of the maintainer's first idea.

## 2. Decision: move the styles into `tokens.css` as utilities

The maintainer's original idea was Tailwind custom utilities (`@utility`), written with existing utilities, in `src/lib/styles/tokens.css`. It was chosen over the map.

- **Names:** `text-` plus the Figma name with the slashes turned into hyphens, the same rule as the colour tokens: `heading/h1` → `text-heading-h1`, `body/body-lg` → `text-body-lg`, `card/title` → `text-card-title`. The prefix `type-` and the plain Figma names were considered and left out.
- **Risk found while planning:** Tailwind v4 refuses an `@utility` that is not at the top level of the CSS ("`@utility` cannot be nested", checked in `node_modules/tailwindcss/dist/lib.js`). `src/app.css` imports `tokens.css` inside `layer(tokens)`, which wraps it. `@theme` is exempt, so the file works today. The fix, if a first test fails as expected, is to import `tokens.css` without `layer(tokens)`. It changes nothing visible: the file holds only `@theme` blocks (which Tailwind merges into the `theme` layer) and utilities go into the `utilities` layer in any case.
- **Scope of the change:** 19 styles plus the responsive page title (`PAGE_TITLE`) as utilities; 17 components and `markdown.ts` switch to the class names; `text.ts` is deleted; `CLAUDE.md` and `docs/ARCHITECTURE.md` are updated.

## 3. Postponed

The maintainer chose to resume this another time, so **nothing in the code was changed**. The plan is saved as a to-do, [docs/todo/2026-10-06 text-styles-as-utilities.md](todo/2026-10-06%20text-styles-as-utilities.md), with the status "to do, not started": context, the decision on the names, the risk to test first, the steps and how to verify (`npm run check`, both builds, the generated CSS, and a visual comparison of the main pages before and after, with no visible change expected).

The folder `docs/todo/` is new.

## 4. Open points added

- Do the to-do above (start with a single test `@utility` and `npm run build`).
- The points still open from the previous summary are unchanged: the event note on HedgeDoc, the authors of the four publications, the Credits note, the image filler fit, the long publication titles and the placeholder photo on the Team page.
