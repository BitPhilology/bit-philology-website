# Architecture

How the site turns the Markdown files of `src/content` into pages. Read `CLAUDE.md` first for the stack, the CSS layers, the tokens and the import script; this file covers the code in `src/lib` and `src/routes`.

## From content to page

```
src/content/**/index.md
  └─ src/lib/server/content.ts        reads and parses every file at build time
       ├─ posts    ─ src/lib/content/posts.ts     front matter → Post
       │    └─ src/lib/server/markdown.ts         body → blocks and headings (notes.ts: footnotes → sidenotes)
       └─ fillers  ─ src/lib/content/fillers.ts   front matter + body → ImageFillerContent (validated)
            └─ src/lib/config/home.ts             the Home tile rule
                 └─ src/routes/*/+page.server.ts  thin loaders
                      └─ src/lib/templates/*      page templates
                           └─ src/lib/components/{ui,content,layout}
```

- Parsing runs only on the server (`src/lib/server`), so the YAML library and the Markdown never reach the browser. Every route is prerendered.
- Routes stay thin: a loader calls one function, a page renders one template.
- Logic lives in `.ts` modules; components only lay out what they receive.

## Folders

| Folder | Holds |
| --- | --- |
| `src/lib/categories.ts` | The category registry (see below) |
| `src/lib/embeds.ts` | The embed registry: the `{{…}}` markers of markdown bodies (see below) |
| `src/lib/content/` | The content model (`types.ts`) and pure helpers: `fields.ts`, `markdown.ts`, `markers.ts`, `dates.ts`, `posts.ts`, `fillers.ts`, `team.ts` (the Team member list, `memberSize`), `board.ts` (the advisory board list), `details.ts` (the lines of the post headers) |
| `src/lib/server/content.ts` | The loader: `getPosts`, `getPost`, `getPage`, `getFillers`, `getSheets` |
| `src/lib/server/markdown.ts` | The body renderer (unified: remark, then rehype), build time only: body → blocks and headings |
| `src/lib/server/notes.ts` | Footnotes → sidenotes: numbering, and pairing each note with the block that refers to it |
| `src/lib/config/` | Site rules as data: `home.ts` (tile order), `footer.ts` (colophon, partners and the path of the credits page) |
| `src/lib/navigation/` | `activeCategory.ts` (the category of the current page), `scrollDirection.ts` (dock compaction), `pageIndex.ts` (the page index of post pages) |
| `src/lib/styles/` | `tokens.css`, `custom.css`, `components.css` (theming, focus ring, dither), `text.ts` (text styles), `markdown.ts` (classes of the rendered markdown) and `grid.ts` (the grid of post pages) |
| `src/lib/components/ui/` | Generic building blocks: `Tile`, `Pill`, `IconLabel`, `ImagePanel`, `ImageContainer`, `Dither` |
| `src/lib/components/content/` | Blocks that show content: `PostCard`, `PostMeta`, `PostBody`, `PublicationBody`, `CardLink`, `CategorySignifier`, `CategoryTheme`, `ImageFiller`, `Colophon`, `PartnerLogo`; for post pages `PostMetaRow`, the headers `PageHeader`, `EventHeader`, `PublicationHeader`, the body `BodyBlocks`, `TextBlock`, `ImageFigure`, `SideNote`, the Team embeds `MemberList`, `TeamMember`, and the advisory board embed `BoardMemberList` |
| `src/lib/components/layout/` | Page structure: `Container`, `TileGrid`, `PageShell`, `PageIndex`, `Footer`, `TopStroke`, `NavDock`, `NavDockItem`, `PageSheet` |
| `src/lib/templates/` | `HomeTemplate`, `PostTemplate` (every post page), and `templates.ts` (the header of each post type) |
| `src/routes/` | `+layout.*` (fonts, theme, top stroke, dock), `+page.*` (Home), `[...path]/` (one page per post) |

## Content model

A post is `src/content/<section>/<slug>/index.md`; its URL is its folder, with a trailing slash, e.g. `/events/<slug>/` (`Post.href`). That is a path inside the site: the base path of the deployment is added when the link is rendered (see [Links and the base path](#links-and-the-base-path)). The `[...path]` route prerenders one page per post (`entries` lists them). Home image fillers have no page. `src/content/contents.yaml`, the list of the HedgeDoc notes, belongs to the import script: the site never reads it (see `CLAUDE.md`).

Every page has the same front matter, the one of `docs/templates/page.md`. A field that does not apply to the type of the page is ignored, and an empty field counts as missing: the readers of `src/lib/content/fields.ts` (`text`, `list`, `flag`) turn empty values into nothing.

Front matter read by `toPost` (`src/lib/content/posts.ts`):

| Field | Type | Used for |
| --- | --- | --- |
| `type` | `about`, `team`, `event`, `publication`, `artifact` | Category and card layout. Unknown or missing → `about`, as in the import script |
| `title` | string, may hold Markdown | Card and page title (the page's `h1`), shown as plain text. **Required**: the build fails, naming the file, without it |
| `subtitle` | string | Event cards; the subtitle of the page header |
| `date` | `YYYY-MM-DD` or `YYYY` | Order on Home and in the lists, newest first; card and page pills; the date lines of event and publication headers |
| `position` | whole number, not 0 | The place of the card in the Home grid: `1` is the first tile, `-1` the last. Empty or missing: the post follows its date. Anything else fails the build |
| `hidden-from-home` | `true`, also as text | `true` leaves the post out of the Home grid; it keeps its page and its place in the dock's page sheet |
| `excerpt` | string | Card text; otherwise the first paragraph of the body |
| `venue`, `location` | string | Event and publication pills and headers |
| `authors` | string | Publication and artifact cards; publication header |
| `publication-type` | string | Publication pills |
| `kind`, `keywords` | string, list | Artifact pills; `keywords` are the `#…` pills of every page and of the About, Team and Artifact cards. Empty entries are dropped; a single text is split at its commas |
| `doi` | `10.…` or a URL | Publication header, linked to `https://doi.org/…` |
| `download-link` | URL | Publication header, the Download pill |

Every field except `title` may be missing: its pill or line is left out. Other fields (`tags`, `source`, `importedAt`, …) are kept in the file and ignored by the site, except the fields that embeds read (see [Markdown bodies and embeds](#markdown-bodies-and-embeds)).

The Team page is the one file with `type: team`, `src/content/about/team/index.md` (URL `/about/team`). Its front matter holds the `members` list, whose entries have `name` and `role` (both required: the build fails without them), `affiliation`, `photo` and `external-url` (the member's page, linked from the name). The import script downloads the `photo` files into the page's `assets/` and writes `./assets/<file>`; `getPage` turns that path into the built URL. Placeholder images (`https://picsum.photos/…`) stay remote.

The advisory board is on the About page, `src/content/about/about-bit-philology/index.md`, as its last section. The front matter of that page holds the `advisory-board` list, whose entries have `name` (required: the build fails without it), `affiliation` and `external-url`. Each entry is a list item, `Name (Affiliation)` followed by an icon that links to `external-url`; an entry without `affiliation` or `external-url` is shown without the brackets or the icon. Any other field of an entry is ignored.

A Home image filler (`type: home-image-filler`) is validated at build time by `toFiller`; the build fails, naming the file, when `accent` is not `about`, `event`, `publication` or `artifact`, when `position` is not a whole number from 1 up, or when the body is not exactly one `![alt](url "caption")` image with a non-empty alt text.

## The Home tile rule

`src/lib/config/home.ts` is the only place that decides the order of the Home grid. The tiles are the posts, except those with `hidden-from-home: true`, and the image fillers. A `position` in the front matter is the place of a tile in the final grid: `1` is the first tile, `2` the second…; `-1` is the last tile, `-2` the one before it… A post without a position follows its date. The order is computed at build time and is the order of the markup too, so nothing is reordered with CSS.

1. The image fillers take their position. Position 1 is the first tile, which holds the logo filler.
2. The posts with a positive position take it, or the next free place after it (when a filler or another post has it).
3. The posts with a negative position take it, or the nearest free place before it: several posts with `-1` all end up at the bottom.
4. A position past the end of the grid means the last free place.
5. The posts without a position fill the places left, newest first; posts without a date come last.

Posts that share a position keep their date order, newest first. The footer tiles (colophon, partner logos) follow in the same grid.

The logo is content, not code: it is the image filler at position 1. The build fails when two fillers share a position, or when the `position` of a post is not a whole number other than 0. Fix the note on HedgeDoc and re-import it with `--force`.

**The credits page** is the post at `CREDITS_PATH` (`src/lib/config/footer.ts`): `src/content/about/credits/index.md`, an About note with `slug: credits` and `hidden-from-home: true`. The root layout's load passes its URL to every page (`credits`), and the `Colophon` shows its "Credits" link only when the page exists, so the footer never links to a missing page.

## Post cards and image tiles

`PostCard` is the Figma "Post" component: a square `Tile` with, from the top,

- `PostMeta`: the icon of the post type in an icon pill on the left, and the pills of the card on the right (`card.pills` in `src/lib/categories.ts`): the keywords for About, Team and Artifact, the date and the place for an Event, the year and the publication type for a Publication. The last pill is cut with an ellipsis when the row is full.
- the body: `PostBody` (the title over a description line) or `PublicationBody` (the title beside the authors and the venue). `card.align` says whether a stacked body starts at the top (About, Team) or is centred (Event, Artifact); `card.description` picks the line and its text style.
- the fade of long text (`card.fade`), over the bottom of the tile.

The card has no arrow button: its title is the link to the post (`CardLink`), stretched over the whole tile, so the card is one click target and one keyboard stop, with the focus ring drawn inside the tile.

Under the pointer or the keyboard focus a post card comes forward: it grows by 5% around its centre (`ZOOM` in `PostCard`), above its neighbours and without moving them, since only its transform changes. The 16 px gaps and page padding leave room for it. The effect is for post cards only, not for image fillers or footer tiles, and only without `prefers-reduced-motion`.

`ImagePanel` is the duotone of the Figma "Image Filler Base Instance" and "Image Base Instance": a white frame, the image in greyscale, and an overlay in `--cat-darker`, as large as the frame, screen-blended over both. Dark parts take the category colour; light parts and the frame stay white. The image keeps its proportions and is never cropped.

- `ImageFiller` (Home): the panel covers the tile, with 64 px padding, and the image takes the space left.
- `ImageContainer` (post pages): 16 px padding; the image fits the width, and the frame is at most 432 px high, so a tall image is scaled down and centred.

## How the content is written

What the files of `src/content` hold, and how the renderer reads it. The notes on HedgeDoc carry the same rules in their front matter comments.

- **Headings and paragraphs**: plain Markdown. The first paragraph is the **lead** (`body/lead-paragraph`), unless it starts with `[no-lead]`; an image or a heading in first position means there is no lead. Editors write section headings as `###` or `####`; the renderer moves them up so that the highest level of the body is `h2` (the title is the `h1`), keeping the distance between levels.
- **Images**: `![alt text](./assets/file.png "Caption")`. The alt text is for screen readers; the title is the visible caption. An image alone in its paragraph is a **figure** (an Image Container with its caption); an image inside text stays inline. The import script downloads the images into `assets/`. An image without alt text gives a warning in the build output.
- **Notes**: GFM footnotes. The text has `[^label]` where the note is called, and the note is a paragraph of its own anywhere in the body: `[^label]: Text of the note`. Labels are any unique word; the page numbers the notes in the order of their first call (`[note 01]`, `Note 01—…`). A note that nothing calls is left out, with a warning.
- **Embeds**: a marker `{{name}}` alone in its paragraph places a component that renders a front matter field (see [Markdown bodies and embeds](#markdown-bodies-and-embeds)). Today: `{{team}}` on the Team page and `{{advisory-board}}` on the About page.

## Post pages

`getPage(path)` returns a `PostPage`: the post, its body rendered as blocks and headings, and `section`, every post of the same category (for the page index). The `[...path]` route renders `PostTemplate` for every type: the page shell, the header of the type and the body blocks. The types differ only by their **header** (`HEADERS` in `src/lib/templates/templates.ts`, the template registry) and by their **pills** (`page.pills` in `src/lib/categories.ts`). Artifacts use the default header, because in Figma their header is the same as About's.

### The grid

`PageShell` lays out the page with the classes of `GRID` (`src/lib/styles/grid.ts`), in the post's category colours. 16 px gaps; the layout changes only at `sm`, `lg` and `xl`:

|  | columns | meta row | page index | header, block content | notes, caption |
| --- | --- | --- | --- | --- | --- |
| base, `sm` | 1 | in order | – | in order | after the content |
| `lg` | 3 | cols 1–3 | – | cols 1–2 | col 3 |
| `xl` | 4 | cols 1–4 | col 1 | cols 2–3 | col 4 |

From `lg` the article is a subgrid of the page grid (`grid-cols-subgrid`), and every block of the body is one row, itself a subgrid of the article: the block's content takes the content columns and its notes (or its caption) the notes column, **on the same row**. A note therefore starts at the top of the paragraph that calls it; a caption sits at the bottom of the row, 16 px above the bottom of its image. A caption keeps 64 px on its right, to set it apart from the notes, which use the full width of the column (Figma "Sidenotes & Captions"). Nothing is positioned absolutely. A long note makes its row taller, so the next paragraph moves down. Below `lg` the same row is a column: the notes or the caption follow the content.

The page index sits in column 1 at `xl` and sticks to the top while the article scrolls; it is hidden below `xl`, where the dock's page sheet lists the posts.

### Component tree

```
PostTemplate                         page = getPage(path)
└─ PageShell (CategoryTheme, Container, GRID)
   ├─ PostMetaRow                    CategorySignifier, line (lg+), Pill…
   ├─ PageIndex (xl)                 nav "On this page", nav "In <Category>"
   ├─ article
   │  ├─ header snippet → HEADERS[type]
   │  │    PageHeader                about, team, artifact: h1, subtitle
   │  │    EventHeader               PageHeader + Location and Date lines
   │  │    PublicationHeader         h1, authors, venue and date, DOI + Download Pill
   │  └─ BodyBlocks                  one grid row per block
   │     ├─ TextBlock                HTML (lead, paragraph, heading, list…) + SideNote…
   │     ├─ ImageFigure              ImageContainer (ImagePanel) + figcaption
   │     └─ embed                    MemberList › TeamMember… ({{team}}), BoardMemberList ({{advisory-board}})
   └─ TileGrid › Footer              Colophon, PartnerLogo…
```

Reused from Home and Team: `CategoryTheme`, `CategorySignifier`, `Pill`, `ImagePanel`, `Container`, `TileGrid`, `Footer`, the dock and the top stroke, the embed registry and the Team embeds.

**Team Member size.** `memberSize(role)` in `src/lib/content/team.ts` is the only place that picks the size, from the role: `Principal Investigator` is `large` (120 px photo), every other role is `medium` (96 px). Roles are matched without regard to case. `TeamMember` takes a typed `size` prop, after the Figma `Size` property; the Figma `small` size (60 px) is not implemented, since the advisory board is a plain list on the About page.

### From content to layout

| Layout element (Figma) | Source | Types |
| --- | --- | --- |
| Category signifier (Post Meta) | `type`, through the registry (`team` → About) | all |
| Line (Post Meta, `lg`+) | – | all |
| Pills (Post Meta) | `page.pills` of the type, see below | all |
| Title (Page Header) | `title` | all |
| Subtitle (Page Header, `body/lead-paragraph`) | `subtitle` | about, team, event, artifact |
| Location line (`heading/h6`) | `venue`, then `location` | event |
| Date line (`heading/h6`) | `date`, `08.05.2026` | event |
| Authors (`card/authors`) | `authors` | publication |
| Venue and date (`body/body`) | `venue`, `location`, `date`: `Colloque Humanistica 2026 — 20 May 2026` | publication |
| DOI (`code/code`) and Download pill | `doi`, `download-link` | publication |
| Lead paragraph (`body/lead-paragraph`) | the first paragraph of the body | all |
| Paragraphs, headings (`heading/h2`), lists | the body | all |
| Image Container | an image alone in its paragraph | all |
| Caption (`pixel/caption`) | the image's title | all |
| Sidenotes (`pixel/note`) | the footnotes of the body | all |
| Member list | `{{team}}` and the `members` list | team |
| Advisory board list | `{{advisory-board}}` and the `advisory-board` list | about |
| On this page | the `h2` headings of the body | all |
| In &lt;Category&gt; | the posts of the category (`getSheets`) | all |
| Footer | `src/lib/config/footer.ts` | all |

The pills of each type (`page.pills` in `src/lib/categories.ts`):

| Type | Pills |
| --- | --- |
| about, team | `Published on 29.09.2025` (`date`), `#keyword`… |
| event | `08.05.2026` (`date`), `location` or else `venue`, `#keyword`… |
| publication | `20.05.2026` (`date`), `#keyword`…, `publication-type` |
| artifact | `Online since 03.2026` (`date`), `kind`, `#keyword`… |

A pill longer than its row is cut with an ellipsis. The venue of a publication is not a pill: it is in the publication header.

### Blocks and notes

`renderBody` (`src/lib/server/markdown.ts`) turns the body into `BodyBlock`s, one per top-level element of the Markdown, in order:

1. `pairNotes` (`src/lib/server/notes.ts`) takes the footnote definitions out of the tree, numbers the notes in the order of their first call, and replaces each call with a link, `[note 01]`, to `#sidenote-01`, with `aria-describedby` pointing to the note, so screen readers read the note with the link. Each note belongs to the **top-level block that first calls it**; a later call links to the same note.
2. Headings are moved up so the body starts at `h2`; the first paragraph is marked as the lead.
3. Each top-level node becomes a block: a marker paragraph an `embed`, an image alone in its paragraph a `figure` (`src`, `alt`, `caption` from the title), anything else an `html` block with its notes. Link reference definitions and raw HTML render nothing.
4. The HTML blocks are rendered in one pass, so the heading ids (`rehype-slug`) stay unique, and every block keeps its own element. The `h2`s become `headings`, for "On this page".

`BodyBlocks` renders the blocks: `TextBlock` puts the HTML in the content columns and its `SideNote`s in the notes column; `ImageFigure` is a `<figure>` whose `<figcaption>` sits in the notes column.

### Headers

| Header | Reads |
| --- | --- |
| `PageHeader` (about, team, artifact) | `title`, `subtitle` |
| `EventHeader` | `title`, `subtitle`, `venue` and `location` (Location), `date` (Date of the event) |
| `PublicationHeader` | `title`, `authors`, `venue`, `location` and `date`, `doi`, `download-link` |

Each line is left out when its fields are missing. The text of the lines is built in `src/lib/content/details.ts`.

### Differences from the Figma frames

- **Images** are never enlarged: an image smaller than the Image Container keeps its size, centred, where Figma fits every picture to the frame. The frame follows the image and is at most 432 px high, as in Figma.
- **Text styles** use the nearest Tailwind utility where Figma has a value in between (see [Text styles](#text-styles)).
- **The page index** has no Figma frame: column 1 is empty in the 1280 frames. It uses `pixel/metadata` for the labels and `body/body` (`body/strong` for the current post) for the links.
- **The lead paragraph** is the first block of the body, not part of the header: it looks the same, and on an event it follows the Location and Date lines.
- **Note calls** are underlined like every link of the body; Figma draws `[note 01]` as plain text.
- **The meta row** lets the pills wrap on the right from `lg` when they do not fit on one line.

### Adding a page type

1. Add the type to `PostType` and its entry to `POST_TYPES` in `src/lib/categories.ts` (label, icon, route, category, card, `page.pills`), and to the `type` mapping of `scripts/syncFromHedgeDoc.js`. A new colour also needs its tokens and its `[data-category]` block (see [Common changes](#common-changes)).
2. If its header differs, add `XHeader.svelte` in `src/lib/components/content/` (compose `PageHeader` when it only adds lines; put the text of the lines in `details.ts`) and list it in `HEADERS` in `src/lib/templates/templates.ts`. Otherwise map the type to `PageHeader`.
3. New front matter fields: add them to `Post` and read them in `toPost`.

The shell, the grid, the body blocks and the page index need no change.

## Markdown bodies and embeds

`renderBody` (`src/lib/server/markdown.ts`) renders a body at build time with unified: `remark-parse` and `remark-gfm` read the markdown (GFM footnotes included), `remark-rehype` turns it into HTML (dropping raw HTML), `rehype-slug` gives the headings ids, so that the page index and links can point to a section. There is no mdsvex: the HTML is plain data, injected by `TextBlock` and `SideNote` with `{@html}`. Links and images with unsafe URL schemes are dropped, and the classes of `src/lib/styles/markdown.ts` are added to the elements (`LEAD_CLASSES` to the lead). It returns `blocks` and `headings` (see [Blocks and notes](#blocks-and-notes)).

**Markers.** A marker is `{{name}}`, spaces inside the braces allowed, alone in its paragraph (a blank line before and after). The markers are handled on the markdown tree, before any HTML exists: a marker paragraph becomes an embed block, between the blocks of the text around it. Editors move a marker above or below any paragraph or heading to move its embed. The build fails, naming the file, for a marker that is not in the registry, a marker used twice, a marker inside other text, a list or a quote, and a marker whose front matter field is missing. A front matter list without its marker is not shown, with a warning in the build output; an empty list field, as in the page template, counts as missing. Markers in code (`` `{{team}}` ``) are text.

**The embed registry** is `EMBEDS` in `src/lib/embeds.ts`: each marker name gives the front matter field, a `parse` function that validates it at build time, and the component that renders it, which receives the parsed value as `data`. `{{team}}` renders `members` with `MemberList` (parser `toMembers`), and `{{advisory-board}}` renders `advisory-board` with `BoardMemberList` (parser `toBoardMembers`), a bulleted list in the style of the lists of the body. A marker works on any post page whose front matter holds its field. To add an embed, add one entry (and, if needed, its parser and component).

## Categories and theming

`src/lib/categories.ts` is the one list of content types and dock entries. Each entry gives a label, a pixelarticons icon, a route, a colour category, a dock label and whether the dock item opens a page sheet; post types also describe their card (layout, fade, description line, pills). `team` shares the `about` category. Components read these fields and never branch on a category name: to change how a category behaves, add a field to its entry.

Colours follow the category through CSS variables, never through generated class names:

- `<CategoryTheme category="…">` sets `data-category` on a wrapper.
- `src/lib/styles/components.css` maps each `[data-category]` to three variables, `--cat-lighter`, `--cat-main` and `--cat-darker`, which point to the semantic tokens of `tokens.css` (`home` uses the neutral surface and text tokens).
- Components use `bg-(--cat-lighter)`, `text-(--cat-darker)` and similar. Never build a Tailwind class from a string (`bg-category-${name}-main`): Tailwind cannot see it.

The root layout themes the whole page with the active category (`activeCategory()`): on a post page, the post's `type` from its load data; elsewhere, the entry whose route is the longest prefix of the URL; Home otherwise. In development a mismatch between the two is logged.

## Layout

- `Container` is the page width: 16 px padding, full width below `sm`, then capped at the width of the last breakpoint reached (`sm` 640, `lg` 1024, `xl` 1280). Between two breakpoints the layout of the smaller one stays, as in the four Figma frames. Tailwind's `container` class is not used: it also stops at `md` and `2xl`.
- `TileGrid` is the square-tile grid: 1, 2, 3 and 4 columns at base, `sm`, `lg` and `xl`, with a 16 px gap. `Tile` gives each cell its square shape, surface and padding.
- The grid of post pages is `GRID` in `src/lib/styles/grid.ts` (see [The grid](#the-grid)).
- The dock is fixed to the bottom of the viewport below `lg` and to the top from `lg` (64 px high). The root layout keeps the page clear of it: `pb-16` below `lg`, `pt-16` from `lg`, on top of each page's own top padding. From `lg` the `html` element also has `scroll-pt-20`, so a link to a heading or a note does not land under the dock.

## Navigation dock

`NavDock` renders one `NavDockItem` per dock entry and owns the open page sheet.

- Styles by breakpoint only: phone (icon over label) below `lg`, wide (icon beside label) from `lg`. Below `lg` it turns compact (icons only, 48 px) while the page scrolls down, and back on scroll up; the transition is `motion-safe` only.
- The icons and labels are in the category's darker colour. The active item has the category tint and a dithered cap over the whole cell, also in the darker colour, and carries `aria-current="page"`. Another item gets the tint alone, without the dither, under the pointer (on devices that can hover) or the keyboard focus. The top stroke (`TopStroke`) is the same dither at the top of the page, in the category's main colour (neutral on Home); it exists only below `lg`, since from `lg` the dock itself is at the top.
- Home is a link. The other items are buttons (`aria-expanded`, `aria-controls`) that open a `PageSheet`: the list of all posts of the category (`getSheets`), full width above the dock on phones, a popover below the item from `lg`. It has no header and no close button: it starts with the rows. The sheet is a non-modal dialog that takes the focus on open; its dock item, Escape, a click outside or a navigation close it, and Escape gives the focus back to the item.
- The dock comes before the page in the markup (root layout), so the keyboard and screen readers reach the navigation first, at every breakpoint.

## Text styles

`TEXT` in `src/lib/styles/text.ts` holds the Figma text styles (the Typography sheet) as Tailwind classes. Sizes, line heights, weights and tracking are always Tailwind's own utilities, never arbitrary values: where Figma has a value between two utilities, the nearest one is used and a comment in `text.ts` gives the Figma value.

| Figma | Tailwind |
| --- | --- |
| line height 0.85, 0.9, 1 | `leading-none` (1) |
| line height 1.2, 1.25 | `leading-tight` (1.25) |
| line height 1.375, 1.5 | `leading-snug`, `leading-normal` |
| `display/page-title`, -2 px at 72 px | `tracking-tight` (-1.8 px) |
| `body/lead-paragraph`, -0.5 px at 24 px | `tracking-tight` (-0.6 px) |
| `card/title`, -0.4 px at 18 px | `tracking-tight` (-0.45 px) |
| `pixel/caption`, 1 px at 12 px | `tracking-widest` (1.2 px) |
| `pixel/note`, 11 px with 0.4 px | `text-xs` (12 px), `tracking-wide` (0.3 px) |

The custom axes of the pixel font (Bitcount Prop Single) are the exception: they are exact, one font utility per Figma style, defined in `src/lib/styles/tokens.css`.

| Figma style | Utility | CRSV | ELSH | ELXP |
| --- | --- | --- | --- | --- |
| `pixel/metadata` | `font-pixel` | 0 | 0 | 0 |
| `pixel/caption` | `font-pixel-caption` | 1 | 50 | 0 |
| `pixel/note` | `font-pixel-note` | 0 | 50 | 0 |

Figma styles without markup of their own are not in `TEXT`: `body/italic` (the site uses Mona Sans italic; Figma still names Instrument Sans), `body/link`, `body/name-link`, `body/del`, `table/*` and `code/code-block`.

## Links and the base path

The site is prerendered with `trailingSlash = 'always'` (`src/routes/+layout.ts`), so every page is `<path>/index.html`, and it may be deployed under a base path: `kit.paths.base` is the `BASE_PATH` environment variable, empty by default (`svelte.config.js`). Nothing in the code holds the base path.

- **Pages.** `Post.href`, `PostLink.href` and the `route` of a registry entry are paths inside the site (`/about/team/`), typed `Pathname`. The components that link to them call `resolve()` from `$app/paths`: `CardLink`, `PageSheet`, `NavDockItem`, `Colophon`, and `pageIndex()` for the page index. In the prerendered HTML these links are relative (`../../about/team/`); after hydration they are absolute, with the base path.
- **Content.** `siteUrl()` (`src/lib/content/links.ts`) adds the base path to the URLs written in the content that start with `/`: the links of a body (`decorate` in `src/lib/server/markdown.ts`), the images that are not files of the page (`resolveAsset` in `src/lib/server/content.ts`), `download-link` and `external-url`.
- **Assets.** The images of the content (`import.meta.glob` with `?url`), the partner logos, the favicon and the fonts are handled by Vite, which writes them under `<base>/_app/immutable/`.
- **The current page.** `activeCategory()` reads the route (`page.route.id`, and the rest parameter of post pages) and not `page.url.pathname`, which holds the base path. With `trailingSlash = 'always'` the rest parameter ends with a slash: the `[...path]` loader removes it before looking the post up.

## Conventions

- Every component starts with a comment that says what it is and, when it has one, which Figma component it implements. Keep components short; move logic into `.ts` modules.
- No `<style>` blocks. Component CSS that utilities cannot express goes in `src/lib/styles/components.css`.
- Text styles come from `TEXT` in `src/lib/styles/text.ts`, named after the Figma text styles (`TEXT['heading/h1']`); see [Text styles](#text-styles). The columns of post pages come from `GRID` in `src/lib/styles/grid.ts`.
- Colours only through semantic tokens or `--cat-*`; spacing and breakpoints are Tailwind's defaults.

## Common changes

- **Move a card in the Home grid**: set `position` in the note's front matter (see [The Home tile rule](#the-home-tile-rule)).
- **Change the Home order rule**: edit `composeHomeTiles` in `src/lib/config/home.ts`.
- **Add a front matter field**: add it to `Post` in `src/lib/content/types.ts` and read it in `toPost`; then to `docs/templates/page.md`, to `PAGE_FIELDS` in `scripts/syncFromHedgeDoc.js` and to the table of `docs/CONTENT.md`. Field names are lowercase with hyphens.
- **Change a card's pills, description line or alignment**: edit the `card` of the post type in `src/lib/categories.ts`.
- **Change a text style**: edit `TEXT` in `src/lib/styles/text.ts`; for the axes of the pixel font, the `--font-pixel*` tokens in `src/lib/styles/tokens.css`.
- **Change the pills of a post page**: edit the `page.pills` of the post type in `src/lib/categories.ts`.
- **Change which header a type shows**: edit `HEADERS` in `src/lib/templates/templates.ts`.
- **Change the columns of post pages**: edit `GRID` in `src/lib/styles/grid.ts`.
- **Add an embed**: add an entry to `EMBEDS` in `src/lib/embeds.ts`.
- **Change which roles get which Team Member size**: edit `SIZE_BY_ROLE` in `src/lib/content/team.ts`.
- **Style an element of the rendered markdown**: edit `MARKDOWN_CLASSES` in `src/lib/styles/markdown.ts`.
- **Add a category**: add its colour tokens to `tokens.css`, its `[data-category]` block to `components.css`, and its entry to `categories.ts` (and to the `type` mapping of `scripts/syncFromHedgeDoc.js`).
