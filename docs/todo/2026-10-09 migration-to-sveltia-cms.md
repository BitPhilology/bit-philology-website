# To do: migrate the content from HedgeDoc to Sveltia CMS

- **Status:** to do, not started
- **Added:** 2026-10-09

## Context

Today the pages are written as notes on HedgeDoc (which may only be reachable from the University of Bern network), and a 1247-line script run by hand, `scripts/syncFromHedgeDoc.js`, copies them into `src/content`. Writers have to know YAML, paste links into `contents.yaml` and run a command with Node.

With [Sveltia CMS](https://sveltiacms.app) the repository becomes the only source of the content: editors open `/admin/`, sign in with GitHub, fill in a form and save. Every save is a commit on `main`, which already starts the deployment. The script, `contents.yaml` and the note templates go away.

Decisions taken:

- **Sign-in:** OAuth through Sveltia CMS Authenticator on Cloudflare Workers.
- **Publishing:** straight to `main` (Sveltia's simple workflow), with no drafts or pull requests.

The loader of the site (`src/lib/server/content.ts`, `src/lib/content/*`) stays as it is, except for the fillers: `src/content/<section>/<slug>/index.md` with its `assets/` is already a "page bundle", which Sveltia handles natively. The 16 pages and the 14 images stay where they are, with the same URLs.

## 1. The CMS: `static/admin/`

**`static/admin/index.html`**: a minimal page with `<meta name="robots" content="noindex">` and the Sveltia script from unpkg, **with the version pinned** (`@sveltia/cms@<version>`, chosen when implementing). `config.yml` is loaded relative to the page, so it also works under `BASE_PATH`. Add `Disallow: /admin/` to `static/robots.txt`.

**`static/admin/config.yml`**, general part:

```yaml
backend:
  name: github
  repo: BitPhilology/bit-philology-website
  branch: main
  base_url: <URL of the Worker>       # from step 5
media_folder: src/content             # required; the collections use their own assets folder
slug:
  encoding: ascii
  clean_accents: true
  maxlength: 60                       # the rule of the script: a-z, 0-9, hyphens, about 60 characters
output:
  omit_empty_optional_fields: true    # "an empty field counts as missing": it is not written
```

Every page collection has `folder: src/content/<section>`, `path: '{{slug}}/index'`, `extension: md`, `format: yaml-frontmatter`, `media_folder: assets`, `public_folder: assets`, `slug: { template: '{{title}}', editable: [create] }` (the slug no longer changes after the page is created, so the URLs stay stable) and `sortable_fields: [date, title]`.

### Collections and fields

The fields are those of `PAGE_FIELDS` and `docs/templates/page.md`, but each type shows **only the fields it uses** (the "Used by" column of `docs/CONTENT.md`, `categories.ts`, `details.ts`). The comments of the template become the `hint` of each field.

| Collection | Files | `type` (a `hidden` field) | Its own fields |
| --- | --- | --- | --- |
| About | `about/*`, `filter: {field: type, value: about}` | `about` | `subtitle`, `excerpt`, `advisory-board` |
| Team (singleton) | `about/team/index.md` | `team` | `subtitle`, `excerpt`, `members` |
| Events | `events/*` | `event` | `subtitle`, `venue`, `location` |
| Publications | `publications/*` | `publication` | `authors`, `venue`, `location`, `publication-type`, `doi`, `download-link` |
| Artifacts | `artifacts/*` | `artifact` | `subtitle`, `authors`, `kind`, `excerpt` |
| Home images | `home-image-fillers/*` | `home-image-filler` | `accent`, `position`, `image`, `alt`, `caption` |

Fields shared by every page: `title`, `keywords`, `date`, `position`, `hidden-from-home`, `body`.

| Field | Widget | Rule carried into the CMS |
| --- | --- | --- |
| `title` | `string`, required | the build fails without a title |
| `subtitle`, `venue`, `location`, `authors`, `publication-type`, `kind`, `doi` | `string`, optional | |
| `excerpt` | `text` | empty: the first paragraph |
| `keywords` | `list` of strings | |
| `date` | `string` with `pattern: ^\d{4}(-\d{2}-\d{2})?$` | `YYYY-MM-DD` or `YYYY` (a date widget does not accept a bare year) |
| `position` (pages) | `number`, `value_type: int`, optional | 1 is the first tile, -1 the last; 0 is still refused by the build |
| `position` (fillers) | `number`, `value_type: int`, `min: 1`, required | uniqueness is still checked by the build |
| `hidden-from-home` | `boolean`, default `false` | |
| `download-link` | `string` | |
| `members` | `list` with `name`\*, `role`\*, `affiliation`, `photo` (`image`), `external-url` | \* required, as in `toMembers` |
| `advisory-board` | `list` with `name`\*, `affiliation`, `external-url` | as in `toBoardMembers` |
| `accent` | `select`: about, event, publication, artifact | |
| `image` and `alt` (fillers) | `image` and `string`, required | "exactly one image, with alt text" |
| `body` | `richtext` with **`modes: [raw]`** | see below |

**The body is raw Markdown only.** Sveltia's visual editor rewrites the Markdown (list markers, italics, hard line breaks `\` turned into soft ones), and its documentation does not say what it does with notes `[^label]`, HTML comments, image titles, `[no-lead]` and `{{team}}`: all things the site uses. In `raw` mode the text stays byte for byte, as on HedgeDoc, and the image button uploads the file into `assets/` and inserts `![](assets/file.png)`. The visual editor can be turned on later, after a round-trip test on one page.

`slug` and `tags` are no longer fields: the slug is the name of the folder, and `tags` only served HedgeDoc.

## 2. Migrating the files (a throwaway script, not committed)

A temporary Node script rewrites the front matter of every `src/content/**/index.md` with the `yaml` library already in the project, leaving **the body untouched**:

- it removes the comment blocks of the template, `slug`, `tags`, `source`, `importedAt` and the empty fields;
- it orders the fields as in `config.yml` (Sveltia saves them in that order, so the first save from the CMS gives no spurious diff);
- `photo: ./assets/x` becomes `assets/x` (the form Sveltia writes; `resolveAsset` resolves both; the `picsum.photos` placeholder stays a URL);
- fillers: the image of the body moves into the front matter (`image`, `alt`, and `caption` when there is one), and the body is left empty.

**Non-empty values that the site does not show today and that would be removed** (confirm with a grep before removing them): `venue: Universität Bern` and `publication-type: poster` on `about/about-bit-philology`, `publication-type: poster` on `about/stay-in-touch`, `authors` on the event. Everything else is kept; the links to the HedgeDoc notes remain in the git history.

## 3. Code of the site

- `src/lib/content/fillers.ts`: `toFiller` reads `data.image` and `data.alt` (same validations and error messages) instead of `soleImage(body)`; remove `soleImage` from `src/lib/content/markdown.ts` if nothing else uses it. Update the call in `src/lib/server/content.ts` and the comments that mention "the import script".
- Nothing else: `toPost`, `toMembers`, `toBoardMembers`, `renderBody` and `resolveAsset` already read the new format.

## 4. Removals and documentation

- Delete `scripts/syncFromHedgeDoc.js`, `src/content/contents.yaml`, `docs/templates/` and the `syncFromHedgeDoc` script of `package.json`. The `yaml` dependency stays (the loader uses it).
- `CLAUDE.md`: rewrite the **Content** section (structure, fields per type, the rules of `position`, `hidden-from-home`, the credits page and the fillers, and "to add a field: `config.yml`, the loader and `docs/CONTENT.md`"); remove HedgeDoc, the list and the import; update the table of commands.
- `docs/CONTENT.md`: rewrite it for the editors of the CMS (signing in; creating, editing and deleting a page; images, notes, markers, the Home page).
- `docs/ARCHITECTURE.md` and `README.md`: update the passages on HedgeDoc, `contents.yaml`, the templates and the fillers.
- Leave the dated session summaries as they are (history).

## 5. OAuth sign-in (manual steps for the maintainer)

1. Deploy [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) on Cloudflare Workers.
2. Register a GitHub OAuth App in the BitPhilology organisation, with the callback `<URL of the Worker>/callback`; set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` and `ALLOWED_DOMAINS` (the GitHub Pages domain and the future `bitphilology.dh.unibe.ch`) as variables of the Worker.
3. Set `base_url` in `config.yml`.
4. Give the editors write access to the repository.

Until the Worker exists, the CMS can be tried locally ("Work with Local Repository", in a Chromium browser) or with "Sign In with Token".

## Verification

1. **No regression**: run `npm run build` before the migration and keep a copy of `build/`; after steps 2 and 3, build again and compare with `diff -r`: the HTML must be identical (apart from `admin/` and `robots.txt`).
2. `npm run check`, `npm run build` and `BASE_PATH=/bit-philology-website npm run build`.
3. `npm run dev`, then open `/admin/index.html` in Chrome with "Work with Local Repository":
   - all 16 entries appear in the right collection, with their photos and images previewed;
   - open and save, without changes, one page of each type: `git diff` must be empty (if it is not, fix the order of the fields or the output options);
   - create a test publication with an accented title and an image: the folder is `publications/<slug>/index.md`, the image is in `assets/`, and the page shows on the site; then delete it;
   - check that `media_folder: assets` also works for the Team singleton; otherwise use the absolute path `/src/content/about/team/assets`, which `resolveAsset` already resolves.
4. After step 5: sign in with OAuth on the published site, make a test edit, and check the commit on `main` and the deployment.
