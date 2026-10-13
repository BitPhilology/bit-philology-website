# CLAUDE.md

Instructions for the LLM coding assistant working on this repository. We use Claude (Claude Code, by Anthropic), which loads this file automatically at the start of every session.

## Project

The Bit Philology website: a static site built with SvelteKit and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

- Svelte 5 and SvelteKit 2, TypeScript, Vite 8
- `@sveltejs/adapter-static`: every route is prerendered (`export const prerender = true` in `src/routes/+layout.ts`) and the site is written to `build/`, one `<path>/index.html` per page (`trailingSlash = 'always'`)
- The site is served at the root of its custom domain, https://bitphilology.dh.unibe.ch/, and the deploy workflow builds it without a base path. The code must keep working under a base path too (a GitHub Pages project site): `kit.paths.base` is `process.env.BASE_PATH ?? ''`. Never hardcode the base path or the domain, and never write an internal link or asset as a bare absolute path (see [Links and assets](#links-and-assets))
- Tailwind CSS v4 through `@tailwindcss/vite`, with no plugins
- Fonts self-hosted with Fontsource
- Icons from `pixelarticons`
- Node 24 (LTS) and npm

How the code in `src/lib` and `src/routes` turns the content into pages (loader, Home tile rule, category registry and theming, components, navigation dock) is described in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Read it before changing that code, and keep it up to date.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server |
| `npm run build` | Builds the static site into `build/` |
| `npm run preview` | Serves the build locally |
| `npm run check` | Runs `svelte-kit sync` and `svelte-check` (types and Svelte diagnostics) |
| `npm run syncFromHedgeDoc` | Imports the missing pages from HedgeDoc (see [Content](#content)) |

## General rules

- Everything in the repository is written in English: code, comments, docs, commit messages and page copy.
- Git: never push.

## Design source: Figma

- File: https://www.figma.com/design/OOCuuEYo0V7Me2Z5p9uqs5/Bit-Philology-Website-PRO
- Figma is the source of truth for the design. Read it through the Figma MCP tools, read-only. Never modify the Figma file unless the maintainer explicitly asks for it.

## CSS architecture

`src/app.css` declares the cascade layers, from lowest to highest priority:

```
theme, base, tokens, components, custom, utilities
```

- `theme`, `base`, `components` and `utilities` are Tailwind's layers.
- `tokens` holds `src/lib/styles/tokens.css`, the design tokens: the self-hosted fonts and the semantic colours. The repository is the source of truth: Figma's variables mirror these tokens, not the other way round.
- `custom` holds `src/lib/styles/custom.css`, hand-written overrides owned by the maintainer. Edit it only when explicitly asked.
- `src/content` is excluded from Tailwind's class detection (`@source not "./content"`).

Tailwind merges every `@theme` block into the `theme` layer, whichever file it sits in, and the last definition of a variable wins. `custom.css` is imported last, so the variables in its `@theme` block override both Tailwind's defaults and the tokens.

### Colors

- The primitives are Tailwind v4's default palette, in OKLCH. Never redefine them, and never reset a theme namespace (no `--color-*: initial` or similar).
- Semantic tokens point to Tailwind's variables, e.g. `var(--color-pink-500)`.
- In markup, use the design system's colors (the semantic tokens), not the raw palette.
- The semantic tokens live in the second `@theme` block of `tokens.css`. Each mirrors a variable of the `Colors` collection in Figma, with slashes turned into hyphens: `category/about/main` is `--color-category-about-main` (utilities `bg-category-about-main`, `text-category-about-main`, …).

| Figma variable | CSS variable | Tailwind colour |
| --- | --- | --- |
| `category/about/{lighter,main,darker}` | `--color-category-about-*` | teal-50, emerald-700, teal-900 |
| `category/event/{lighter,main,darker}` | `--color-category-event-*` | pink-50, pink-500, pink-800 |
| `category/publication/{lighter,main,darker}` | `--color-category-publication-*` | orange-100, orange-600, amber-800 |
| `category/artifact/{lighter,main,darker}` | `--color-category-artifact-*` | blue-50, cyan-600, sky-800 |
| `surface/light-background`, `surface/dark-background` | `--color-surface-*` | neutral-100, emerald-950 |
| `surface/white`, `surface/subtle` | `--color-surface-*` | white, neutral-50 |
| `text/neutral-on-light-bg`, `text/neutral-on-dark-bg` | `--color-text-*` | emerald-950, neutral-100 |

### Spacing and breakpoints

- Use Tailwind's defaults: the 4 px spacing scale and the default breakpoints.
- A Figma `spacing/N` variable is N × 4 px, i.e. Tailwind's spacing step `N` (e.g. `spacing/4` is `p-4`, 16 px).

### Fonts

Self-hosted with Fontsource, imported in `src/routes/+layout.svelte` and registered in the first `@theme` block of `tokens.css`:

- Mona Sans (`font-sans`, the default): `@fontsource-variable/mona-sans`, files `wght.css` and `wght-italic.css` (weight axis only). If the width axis is ever needed, switch to `standard.css` and `standard-italic.css`.
- JetBrains Mono (`font-mono`, for code): `@fontsource-variable/jetbrains-mono`, file `wght.css` (weight axis only).
- Bitcount Prop Single (`font-pixel`): `@fontsource-variable/bitcount-prop-single`, file `full.css` (all axes, custom ones included). Its custom axes (`CRSV`, `ELSH`, `ELXP`) are pinned per Figma text style in `tokens.css`: `font-pixel` is `pixel/metadata`, `font-pixel-caption` is `pixel/caption`, `font-pixel-note` is `pixel/note`.

Never load fonts from Google Fonts or any other external service.

### Text styles

The Figma text styles are the `TEXT` map in `src/lib/styles/text.ts`. Use Tailwind's own utilities for sizes, line heights, weights and tracking, never arbitrary values: where Figma has a value between two utilities, take the nearest one and note the Figma value in a comment. The axes of variable fonts are the only exception: they are set to the exact Figma values, in `tokens.css`. The mapping is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#text-styles).

### Icons

The icons come from [pixelarticons](https://pixelarticons.com) (`pixelarticons` on npm): pixel-art icons on a 24×24 grid, in four styles (base, `-sharp`, `-solid`, `-glyph`). Render them with `src/lib/components/Icon.svelte`, passing the raw SVG:

```svelte
<script lang="ts">
	import bookOpen from 'pixelarticons/svg/book-open.svg?raw';
	import Icon from '$lib/components/Icon.svelte';
</script>

<Icon svg={bookOpen} class="size-12" />
<Icon svg={bookOpen} label="Read more" />
```

- Import each icon from `pixelarticons/svg/<name>.svg?raw` and name the variable after the icon in camelCase. Only the imported icons end up in the bundle.
- Icons take the current text color: color them with text utilities.
- Size them in multiples of 24 px to keep the pixels sharp: `size-6` (the default, 24 px), `size-12`, `size-18`, `size-24`.
- An icon without `label` is decorative and hidden from screen readers. Give it a `label` when it carries meaning on its own, such as an icon-only link.
- Never use `pixelarticons/react` or the webfont. npm installs `react` as a peer dependency of the package, but nothing imports it.

### Svelte components

- No `<style>` blocks in Svelte components: their CSS is outside the cascade layers, so it would beat Tailwind's utilities.
- Style with Tailwind utilities. If a component needs its own CSS, put it in a stylesheet in the `components` layer.

## Content

The guide for the people who write the pages is [docs/CONTENT.md](docs/CONTENT.md); the templates of the notes are in [docs/templates/](docs/templates/). Keep both in step with the rules below.

### Structure

The pages are Markdown files grouped by section, so that the folder tree mirrors the URLs:

```
src/content/
  contents.yaml               the HedgeDoc notes of the website, filed by section
  <section>/<slug>/index.md   a page
  <section>/<slug>/assets/    its images, linked as ./assets/<file>
  home-image-fillers/<slug>/index.md   a Home image filler (see below)
```

- Sections: `events`, `publications`, `artifacts`, `about` (which also holds the team page, a note with `type: team`, normally `about/team`, that lists the members in its front matter), and `home-image-fillers` for the image tiles of the Home grid.
- The files in `src/content` are data: the import script never touches `src/routes` or any other code.
- A page with `source:` in its front matter was imported from HedgeDoc. To change it, edit the note on HedgeDoc and re-import it with `--force` (or `--refresh`): local edits to an imported page are lost on re-import.
- A `.md` file without `source:` is hand-written. Never touch it, and neither does the script. It is not listed in `contents.yaml`.
- An imported page is the note as it is, byte for byte, comments included: only its image links are rewritten, and `source:` and `importedAt:` are added at the end of its front matter.

### Notes on HedgeDoc

The notes live on a HedgeDoc 1.x server, https://pad.dsl.unibe.ch, which may only be reachable from the University of Bern network. Every note has two URL forms:

- edit: `https://pad.dsl.unibe.ch/<id>` (raw Markdown on `/<id>/download`). `https://pad.dsl.unibe.ch/<id>` is the canonical source of a page.
- published: `https://pad.dsl.unibe.ch/s/<shortid>` (raw Markdown on `/s/<shortid>/download`); `/s/<shortid>/edit` redirects to `/<id>`. This is the link that editors paste in the list, after pressing "Publish".

Every page uses the same front matter, the one of `docs/templates/page.md`: `type`, `title`, `subtitle`, `keywords`, `date` (`YYYY-MM-DD` or `YYYY`), `venue`, `location`, `authors`, `publication-type`, `doi`, `download-link`, `kind`, `members`, `advisory-board`, `excerpt`, `position`, `hidden-from-home`, `slug`, `tags`. A field that does not apply to the type of the page is ignored; an empty field counts as missing. The page title is the `title` field, not a `#` heading in the body.

- Names are lowercase with hyphens, and only these names are read: there are no aliases for older spellings (`externalURL`, `advisory_board`, `pinned`). To add a field, add it to the template, to `PAGE_FIELDS` in the script, to the loader (`src/lib/content/`) and to the table of docs/CONTENT.md.
- **The URL of a page** is its section and its slug. The slug is computed at import from `title`; `slug:` is left empty in the template, and only overrides the title when it is filled in.
- **To place a page in the Home grid, set `position:`.** `1` is the first tile, `2` the second…; `-1` is the last tile, and several pages with `-1` all go to the bottom. Without a position (or with an empty one) a page follows its date, newest first. The full rule is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#the-home-tile-rule).
- **To keep a page out of the Home grid, set `hidden-from-home: true`.** Without it every page has a card on Home. A hidden page keeps its URL and its place in the dock's list of its category.
- The credits page is an About note titled "Credits" (so `about/credits`, URL `/about/credits`) with `hidden-from-home: true`. The "Credits" link of the footer's colophon appears only when that page exists.

### The list: `src/content/contents.yaml`

The list of the notes of the website. The import script reads the links from it and writes the whole file again at every run:

```yaml
new:
  - https://pad.dsl.unibe.ch/s/AbCdEfGhI   # a link still to import

about:
  - page: about-bit-philology              # the slug: the folder and the last part of the URL
    title: About Bit Philology
    url: https://pad.dsl.unibe.ch/<id>     # the canonical URL of the note
    synced: 2026-09-30                     # the day it was fetched
events:
publications:
artifacts:
home-image-fillers:
```

- The only input is the links: a plain link under `new` (or dropped anywhere else) or the `url` of an entry. `page`, `title` and `synced` are read from the pages at every run, so editing them has no effect. The comment at the top of the file belongs to the script (`LIST_HEADER`); other comments are not kept.
- The sections are in the order of the website; pages are sorted newest first, fillers by position. A label is always a slug or a title, never a note id.
- A link that could not be imported (an error, a conflict, no network) stays under `new`.
- A page whose link is taken off the list is kept and reported; `--prune` deletes it. Hand-written pages are never listed and never deleted.
- If the file cannot be parsed, the script stops before touching anything and names the line; `--rebuild-list` writes the file again from the imported pages.

### Importing: `scripts/syncFromHedgeDoc.js`

Run it by hand; there is no GitHub Action. Pass options after `--`:

```sh
npm run syncFromHedgeDoc                                 # import the notes that are missing
npm run syncFromHedgeDoc -- --dry-run                    # show what would happen, write nothing
npm run syncFromHedgeDoc -- --force events/<slug>        # re-import one page (path relative to src/content)
npm run syncFromHedgeDoc -- --refresh                    # re-import every page of the list
npm run syncFromHedgeDoc -- --prune                      # also delete the imported pages taken off the list
npm run syncFromHedgeDoc -- --rebuild-list               # write contents.yaml again from the pages, offline
```

For each link of `contents.yaml` (both URL forms work, with or without `?edit`, `?view`, `?both` or `#fragment`), the script:

1. Finds the canonical note id; a published URL is followed through `/s/<shortid>/edit`. A canonical URL needs no request.
2. Skips the note, without touching anything, if any `index.md` already has that `source:` (unless `--refresh`).
3. Downloads the Markdown from `/<id>/download`.
4. Picks the section from `type` (lowercase, no spaces): `event` → `events`, `publication` → `publications`, `artifact` → `artifacts`, `about` and `team` → `about`, `home-image-filler` → `home-image-fillers`. A missing or unknown type falls back to `about`, with a warning.
5. Computes the slug from `slug:` or else from the title: Markdown and accents removed, lowercase, only `a-z`, `0-9` and hyphens, cut at a hyphen around 60 characters. A page without a title is refused. A folder is never named after a note id (see Home image fillers for the fallback).
6. Checks the front matter and reports, as warnings in plain words, the names it does not know (with the right name when it is an old or a mistyped one), and the dates, positions and `hidden-from-home` values that the site cannot read. The note is imported all the same.
7. Never overwrites: if `<section>/<slug>/index.md` exists with another source or without `source:`, it reports a conflict and moves on.
8. Downloads every linked image, from HedgeDoc or elsewhere, into `assets/` and rewrites the links as `./assets/<file>`, keeping alt text and title. It handles `![alt](url "title")`, the HedgeDoc size syntax `url =WxH`, reference definitions `[id]: url` and `<img src="…">`, and ignores code. It also downloads the images of the front matter fields named `photo`, at any depth (e.g. the `photo` of each entry in the team's `members` list), and sets the field to `./assets/<file>`; to download other fields, add their name to `IMAGE_FIELDS` in the script. Images from placeholder services (`picsum.photos`, `placehold.co`, `placeholder.com`, `dummyimage.com`, `loremflickr.com`, `placekitten.com`, `fakeimg.pl`, and their subdomains) are not downloaded: their URL stays as it is, and they are listed in the summary. If an image fails, the original link stays and it is reported. Editors are told to upload every image to HedgeDoc ("Upload Image") and to describe it: an image hosted elsewhere, and an image without alt text, are imported but reported as warnings.
9. Writes `index.md`: the front matter of the note as text, untouched apart from the `photo` links, followed by `source:` (canonical URL) and `importedAt:` (ISO timestamp) under a "do not edit" comment; then the body, identical apart from the image links (and a final newline). The `yaml` library only reads the front matter: the text is never written again from the parsed values, which would move the comments of empty fields.
10. Writes `contents.yaml` again.

`--force <path>` and `--refresh` re-import a page and replace its `index.md` and `assets/`. If the note's type or slug changed, the page moves to the new place: the old `index.md` and `assets/` are deleted, and the old folder too if nothing else is left in it.

Requests time out (15 s for notes, 60 s for images). An error on one note does not stop the others, but if the server is unreachable the script stops and says so. At the end it prints the pages added, re-imported, skipped and in conflict, the errors, the warnings, the images downloaded or failed, the placeholder images kept as links, the links to other HedgeDoc notes found in the text (not rewritten yet), the imported pages that are no longer in the list (kept, or deleted with `--prune`) and whether the list was written again. The exit code is 1 if there were errors, conflicts or failed images.

### Home image fillers

A Home image filler is a note that only holds an image for a tile of the Home grid. Its link goes in `contents.yaml` like any other note. The note is `docs/templates/home-image-filler.md`:

```markdown
---
type: home-image-filler
title: Floppy Disk       # a short name: it names the folder, it is not shown
accent: about            # about | event | publication | artifact
position: 2              # position in the Home grid
slug:                    # left empty
tags: website/home-image-filler
---

![alt text for screen readers](https://pad.dsl.unibe.ch/uploads/<id>.webp
 "Optional caption (ignored on Home)")
```

- It is written to `src/content/home-image-fillers/<slug>/index.md`, with the image in `assets/`. The slug comes from `slug:` or the `title`; without them, from the name of the image file or, when that is an upload id, from the first words of the alt text; as a last resort `image-<position>`.
- The script refuses a filler, reports it as an error and moves on, when:
  - `accent` is not one of `about`, `event`, `publication`, `artifact`;
  - `position` is not a whole number from 1 up (a quoted `"3"` is not a number), or another filler already has it. Fillers already imported keep their position; within one run, the first filler in the list wins; fillers that the same run re-imports later (`--refresh`) do not count, since their position may change;
  - the body does not hold exactly one image written as `![alt text](url "caption")`, holds anything else (text, headings, a second image), or the alt text is empty.
- `position` is the 1-based index in the Home grid. Any position is allowed, 1 included: position 1 is the first tile and holds the logo filler.
- The Home loader reads the fillers from `src/content/home-image-fillers/` and validates them again at build time: an invalid filler or two fillers with the same position fail the build (see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#the-home-tile-rule)).

## Svelte

- Svelte 5 with runes (`$state`, `$derived`, `$effect`, `$props`). Runes mode is forced in `svelte.config.js`, so do not use the legacy syntax (`export let`, `$:`, `on:click`).
- Use the Svelte MCP server, configured in `.mcp.json`, as described below.

### Links and assets

The site must work both at the root of a domain and under a base path, so nothing may point to `/…` directly.

- A page of the site is named by its path inside the site, with a trailing slash: `/about/team/` (`Post.href`, typed `Pathname`). In markup, pass it through `resolve()` from `$app/paths`: `<a href={resolve(post.href)}>`. Do not use the deprecated `base`.
- Files of `static/` go through `asset()` from `$app/paths`. Images and fonts imported in the code (`import logo from '…png'`, `import.meta.glob(…, { query: '?url' })`) are already base-aware.
- URLs that come from the content (links and images of a body, `download-link`, `external-url`) go through `siteUrl()` in `src/lib/content/links.ts`, which adds the base path to a path that starts with `/` and leaves everything else as it is.
- Do not compare `page.url.pathname` with a path of the site: it holds the base path. Use `page.route.id` and `page.params`, as `activeCategory()` does.
- After touching links, run `BASE_PATH=/bit-philology-website npm run build` as well as `npm run build`: the prerenderer fails on an internal link that leads nowhere.

### Svelte MCP server

The official instructions from https://svelte.dev/docs/ai/instructions:

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

#### Available Svelte MCP Tools:

##### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

##### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

##### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

##### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
