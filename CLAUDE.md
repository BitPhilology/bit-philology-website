# CLAUDE.md

Instructions for the LLM coding assistant working on this repository. We use Claude (Claude Code, by Anthropic), which loads this file automatically at the start of every session.

## Project

The Bit Philology website: a static site built with SvelteKit and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`, except a push that only changes the files in its `paths-ignore` list (the docs and other files that are not part of the site) or whose last commit has `[skip ci]` in its message. Keep that list in step with the repository: a file that the build reads must never be in it.

- Svelte 5 and SvelteKit 2, TypeScript, Vite 8
- `@sveltejs/adapter-static`: every route is prerendered (`export const prerender = true` in `src/routes/+layout.ts`) and the site is written to `build/`, one `<path>/index.html` per page (`trailingSlash = 'always'`)
- The site is served at the root of its custom domain, https://bitphilology.dh.unibe.ch/, and the deploy workflow builds it without a base path. The code must keep working under a base path too (a GitHub Pages project site): `kit.paths.base` is `process.env.BASE_PATH ?? ''`. Never hardcode the base path or the domain, and never write an internal link or asset as a bare absolute path (see [Links and assets](#links-and-assets))
- Tailwind CSS v4 through `@tailwindcss/vite`, with no plugins
- Fonts self-hosted with Fontsource
- Icons from `pixelarticons`
- Content edited with Sveltia CMS, served at `/admin/` from `static/admin/` (see [Content](#content))
- Node 24 (LTS) and npm

How the code in `src/lib` and `src/routes` turns the content into pages (loader, Home tile rule, category registry and theming, components, navigation dock) is described in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Read it before changing that code, and keep it up to date.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server |
| `npm run build` | Builds the static site into `build/` |
| `npm run preview` | Serves the build locally |
| `npm run check` | Runs `svelte-kit sync` and `svelte-check` (types and Svelte diagnostics) |

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

The guide for the people who write the pages is [docs/CONTENT.md](docs/CONTENT.md). Keep it in step with the rules below.

The repository is the only source of the content. The pages are edited with [Sveltia CMS](https://sveltiacms.app), served at `/admin/`: an editor signs in, fills in a form and saves. Every save is a commit on `main`, which starts the deployment: there are no drafts and no pull requests. A page can also be edited by hand, as a file.

### Structure

The pages are Markdown files grouped by section, so that the folder tree mirrors the URLs:

```
src/content/
  <section>/<slug>/index.md   a page
  <section>/<slug>/assets/    its images, linked as ./assets/<file>
  home-image-fillers/<slug>/index.md   a Home image filler (see below)
  assets/                     images uploaded from the Assets page of the CMS (see The CMS)
```

- Sections: `events`, `publications`, `artifacts`, `about` (which also holds the team page, `about/team`, the one page with `type: team`, that lists the members in its front matter), and `home-image-fillers` for the image tiles of the Home grid.
- The files in `src/content` are data: the CMS never touches `src/routes` or any other code.
- **The URL of a page** is its section and its slug, the name of its folder. The CMS computes the slug from the title when the page is created (accents removed, lowercase, only `a-z`, `0-9` and hyphens, at most 60 characters) and lets the editor change it at that moment only. Changing the title of a page later does not change its URL. To change a URL, rename the folder by hand.
- A file holds what the CMS writes, and nothing else: the fields of its collection in the order of `config.yml`, without comments, then a blank line and the body. When editing a file by hand, keep to that form, so that the next save from the CMS changes only what the editor changed.

### Front matter

Every type of page has its own collection in the CMS, with only the fields that the type uses:

| `type` | Collection | Folder | Fields, in the order of the file |
| --- | --- | --- | --- |
| `about` | About | `about/<slug>` | `title`, `subtitle`, `keywords`, `date`, `position`, `hidden-from-home`, `menu-position` |
| `about` | About Bit Philology (one file) | `about/about-bit-philology` | `title`, `subtitle`, `keywords`, `date`, `advisory-board`, `position`, `hidden-from-home`, `menu-position` |
| `team` | Team (one file) | `about/team` | `title`, `subtitle`, `keywords`, `date`, `members`, `position`, `hidden-from-home`, `menu-position` |
| `event` | Events | `events/<slug>` | `title`, `subtitle`, `keywords`, `date`, `venue`, `location`, `position`, `hidden-from-home` |
| `publication` | Publications | `publications/<slug>` | `title`, `keywords`, `date`, `venue`, `location`, `authors`, `publication-type`, `doi`, `download-link`, `position`, `hidden-from-home` |
| `artifact` | Artifacts | `artifacts/<slug>` | `title`, `subtitle`, `keywords`, `date`, `authors`, `kind`, `position`, `hidden-from-home` |
| `home-image-filler` | Home images | `home-image-fillers/<slug>` | `title`, `accent`, `position`, `image`, `alt`, `caption` |

- `type` is the first field of every file. The collection sets it (a hidden field): editors never see it.
- In the form of the CMS the Text comes before `position` and `hidden-from-home`, the two fields about the Home page. The body is not in the front matter, so its place in `config.yml` does not change the files.
- Names are lowercase with hyphens. The page title is the `title` field, not a `#` heading in the body; `title` is the only required field of a page.
- An empty optional field is not written (`output.omit_empty_optional_fields`), and the loader treats an empty field as a missing one. `hidden-from-home` is the exception: the CMS always writes it, `true` or `false`.
- `keywords` holds three entries at most (`max: 3`). The limit is in the CMS only: the site shows every keyword of a file.
- `date` is `YYYY-MM-DD` or `YYYY`. It is a text field with a pattern, since the date field of the CMS does not take a bare year. The CMS writes a bare year in quotes (`date: '2026'`).
- `members` (entries with `name` and `role`, both required, and `affiliation`, `photo`, `size`, `external-url`; `size` is the size of the photo, `large`, `medium` or `small`, and a member without it is medium) and `advisory-board` (`name`, required, and `affiliation`, `external-url`) are lists, shown in the body where it has `{{team}}` or `{{advisory-board}}`. Each belongs to one page: `members` to the Team page, `advisory-board` to the About Bit Philology page.
- The loader reads the same fields whatever the type (`toPost`); a field that the type does not use is simply not in its collection. To add a field, add it to `static/admin/config.yml`, to the loader (`src/lib/content/`) and to the table of docs/CONTENT.md. The CMS keeps a field it does not know, and writes it after the others.
- There is no field for the text of a card: the card of an About, Team or Artifact page shows the first paragraph of its body.
- **To place a page in the Home grid, set `position:`.** `1` is the first tile, `2` the second…; `-1` is the last tile, and several pages with `-1` all go to the bottom. Without a position a page follows its date, newest first. `0` fails the build. The full rule is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#the-home-tile-rule).
- **To order the About menu, set `menu-position:`** on its pages: `1` is the first. The pages without it follow, newest first. The other menus of the dock list their pages newest first: the loader reads the field on any page, but only the About pages have it in the CMS.
- **To keep a page out of the Home grid, set `hidden-from-home: true`.** Without it every page has a card on Home. A hidden page keeps its URL and its place in the dock's list of its category.
- The credits page is the About page titled "Credits" (so `about/credits`, URL `/about/credits`) with `hidden-from-home: true`. The "Credits" link of the footer, at the end of its copyright line, appears only when that page exists.

### The CMS: `static/admin/`

Two static files, copied as they are into the site:

- `index.html` loads the Sveltia CMS script from unpkg, **with the version pinned** (`@sveltia/cms@<version>`), and asks search engines not to index the page (`static/robots.txt` disallows `/admin/` too). To update the CMS, change the version, then check in the CMS that a page still opens and that a save changes only what was edited.
- `config.yml` is the configuration. The CMS loads it from the folder of the page, so it also works under a base path. It is checked against the schema named in its first line.

What `config.yml` sets, and why:

- **Backend**: the GitHub repository and the `main` branch, with `publish_mode: simple`. No `skip_ci`: every save must start the deployment.
- **Sign-in**: with GitHub (OAuth), through [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth), a small OAuth client that runs as a Cloudflare Worker: `base_url` is its address. The Worker lives in the maintainer's Cloudflare account, outside this repository; its variables are `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`, from a GitHub OAuth App whose callback URL is `<base_url>/callback`, and `ALLOWED_DOMAINS`, the domain of the site, so that no other site can use it. `auth_scope: public_repo` asks an editor for access to public repositories only: the repository is public. Signing in with a personal access token still works, as a fallback. An editor needs a GitHub account with write access to the repository either way. On localhost the Worker refuses the sign-in (the domain is not allowed): use "Work with Local Repository".
- **Collections**: one per type of page, with `folder: src/content/<section>`, `path: '{{slug}}/index'` and `format: yaml-frontmatter`. The two pages with a list of people are singletons, `src/content/about/about-bit-philology/index.md` and `src/content/about/team/index.md`: a collection gives the same fields to all its pages, and these lists belong to one page only. The CMS gives a file to its singleton, so the About collection does not list these two; if one of the folders is renamed, change the `file` of its singleton too. The fields shared by every type are written once, in the About collection, and reused through YAML anchors (`&title`, `*title`).
- **Images**: `media_folder: assets` with `public_folder: ./assets`, on every collection and on both singletons. An image is uploaded into the `assets/` folder of its page and linked as `./assets/<file>`, which `resolveAsset` resolves. Keep the `./`: with `public_folder: assets` the CMS writes `/assets/<file>`, a path of the site that leads nowhere. The global `media_folder`, which the CMS requires, is `src/content/assets`: an image uploaded from the Assets page goes there and is linked as `/src/content/assets/<file>`, which `resolveAsset` resolves as well. An uploaded file is renamed like a slug (`slugify_filename`), so new names have no spaces or accents; for the names that have them, a link of the text encodes them (`photo%20one.jpg`) and `resolveAsset` looks the file up under the decoded path too.
- **Slugs**: `slug: { template: '{{title}}', editable: [create] }` on every collection, and the global `slug` options (`encoding: ascii`, `clean_accents`, `maxlength: 60`).
- **The body** is a `richtext` field with `modes: [rich_text, raw]`: it opens in the visual editor, and the Markdown button of its toolbar switches to the raw Markdown. The visual editor comes first because it is the only place where an image can be uploaded: in the raw mode the image button writes an empty `![]()`, and a dropped or pasted file is ignored. Opening a page, or changing its other fields, leaves the text as it is; a change made in the visual editor rewrites the Markdown of the whole text in the editor's own style. A save of the About page from the visual editor (2026-10-14) changed `*italic*` to `_italic_` and some blank lines, and kept the notes (`[^label]`), the marker (`{{advisory-board}}`), the HTML comment, the lists and the headings: the built page was identical. The same check on the event page kept its hard line breaks (`\`). The visual editor shows as plain text what only the site understands: notes, markers, `[no-lead]`, and the content of an HTML comment, which it does not hide. It reads an image only when it is on one line, `![alt](src "title")`: with the title on the next line the image is shown as text.
- **Output**: `omit_empty_optional_fields: true`, and the YAML options (`quote: none`, two spaces, indented lists). With these the CMS writes strings without quotes, except where YAML needs them or where the text could be read as a number or a boolean; then it uses single quotes.

To try the CMS without signing in, run `npm run dev`, open `http://localhost:5173/admin/` in Chrome or Edge, press "Work with Local Repository" and pick the root folder of the repository: the CMS then reads and writes the local files, and commits nothing. The dev server does not serve the `index.html` of a folder of `static/` by itself: the `adminPage` plugin of `vite.config.ts` sends `/admin/` to the file.

### Home image fillers

A Home image filler is a file that only holds an image for a tile of the Home grid. It is edited in the "Home images" collection of the CMS:

```markdown
---
type: home-image-filler
title: Floppy Disk       # a short name: it names the folder, it is not shown
accent: about            # about | event | publication | artifact
position: 4              # position in the Home grid
image: ./assets/floppy-disk.png
alt: The description of the image, for screen readers
caption: Optional (kept, but not shown on Home)
---
```

(The comments are here to explain the fields: the CMS writes none.)

- It is written to `src/content/home-image-fillers/<slug>/index.md`, with the image in `assets/`. It has no body and no page of its own.
- `position` is the 1-based index in the Home grid. Any position is allowed, 1 included: position 1 is the first tile and holds the logo filler.
- The CMS requires every field but `caption`, offers the four accents and refuses a position below 1. It does not check that a position is free.
- The Home loader reads the fillers from `src/content/home-image-fillers/` and validates them at build time: a filler with an unknown `accent`, a `position` that is not a whole number from 1 up, no `image` or no `alt`, or two fillers with the same position, fail the build (see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#the-home-tile-rule)).

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
