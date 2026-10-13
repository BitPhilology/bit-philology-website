# Bit Philology — session summary, 13–14 October 2026

- **Date of the summary:** 2026-10-14
- **Model used in this session:** Claude Opus 5.5, in Claude Code (VS Code)
- **Previous summary:** [2026-10-06 ai-assisted-session-summary.md](2026-10-06%20ai-assisted-session-summary.md). Its open points are followed up in section 8.

This document covers one session, from the evening of 13 October to the night of 14 October, in which the content of the website moved from HedgeDoc to Sveltia CMS and the content manager went online. Section 1 fills the gap since the previous summary: it is rebuilt from the git history, so it lists what changed, not the conversations.

---

## 1. 6–13 October — before the session (from the git history)

- **Content** (`a569d8b`, `00e098f`, `c86157b`, `fa6d07c`, `73d2fc1`): two About pages were added, "Zenodo Community" and "Mailing list", the second renamed "Stay in touch" the same day; Home images were added; the pages were imported again from HedgeDoc on 6 and 13 October.
- **Custom domain** (`644d078`, `aec6761`): the site is served at https://bitphilology.dh.unibe.ch/. The workflow no longer passes `BASE_PATH` to the build, and `README.md`, `CLAUDE.md` and `svelte.config.js` say so. The code still works under a base path.
- **The plan of the migration** (`eb84192`, 9 October) was written as a to-do, `docs/todo/2026-10-09 migration-to-sveltia-cms.md`, with two decisions already taken: sign-in through an OAuth client on Cloudflare Workers, and publishing straight to `main`.

## 2. Before starting: the plan and the sign-in

The maintainer first asked two questions, without any code.

- **Can the plan be run as it is?** Almost. Five points were corrected: the counts were out of date (17 files and 15 images, not 16 and 14); `base_url` was a placeholder, with nothing said about what to write until the Worker existed; two of the checks need a browser, so they are the maintainer's and not the assistant's; Sveltia writes a bare year in quotes, so the migration had to do the same; the reference build has to be made first, and the plan did not say whether to commit.
- **Is the Worker the only way to sign in from outside?** No. Sveltia also takes a personal access token, with nothing to install, and any OAuth client made for Netlify or Decap CMS, Netlify's own included. What it cannot do with GitHub is a sign-in without a server (PKCE). The Worker stayed the goal, and the site started with the token.

## 3. The migration (13 October)

The source of Sveltia CMS was read at the version that the site pins (0.236.0), to learn the exact form of the files it writes and what its options do. Most differences from the plan come from that reading.

- **The CMS**: `static/admin/index.html` loads the script from unpkg, with the version pinned; `static/admin/config.yml` describes one collection per type of page (About, Events, Publications, Artifacts, Home images) and the single pages. It is valid against the schema that Sveltia ships. `static/robots.txt` disallows `/admin/`.
- **The files**: a throwaway script, not committed, rewrote the 17 files (10 pages and 7 Home images) as Sveltia would, with the same YAML library and options: the fields in the order of `config.yml`, no comments, no empty optional fields, `hidden-from-home` always written, a bare year in quotes. It removed `slug`, `tags`, `source`, `importedAt` and four values that no page showed. In the Home images, the image, its description and its caption moved from the body to the front matter (`image`, `alt`, `caption`). The bodies of the pages were not touched.
- **The loader**: `toFiller` reads `image` and `alt`, and `soleImage` is gone. Nothing else in the site changed.
- **Removed**: `scripts/syncFromHedgeDoc.js`, `src/content/contents.yaml`, `docs/templates/` and the two npm scripts.
- **Docs**: the Content section of `CLAUDE.md` and the whole of `docs/CONTENT.md` were rewritten; `docs/ARCHITECTURE.md` and `README.md` were updated.
- **Checks**: a build was kept from before the migration. After it, the rendered markup of the 16 HTML pages was identical; the data embedded in the pages had lost only the four removed values. Later the real CMS confirmed the form of the files: the first page it created was written exactly as predicted, and the pages that the maintainer edited kept their front matter byte for byte.

Three things in the plan could not hold. `public_folder: assets` makes Sveltia write `/assets/<file>`, which the loader cannot resolve: it is `./assets`, the form the pages already had, so no link was rewritten. The global `media_folder`, which Sveltia requires, is `src/content/assets` and not `src/content`, so that an image uploaded from the Assets page is one the loader can resolve. And a page cannot be "opened and saved without changes": Sveltia has no Save without a change.

## 4. What the browser showed

The assistant cannot open a browser, so the maintainer tried the CMS on the local repository ("Work with Local Repository") and reported what he saw.

- **`/admin/` was "Not found" on the dev server.** The dev server does not serve the `index.html` of a folder of `static/`; GitHub Pages and the preview server do. The `adminPage` plugin of `vite.config.ts` now sends `/admin/` to the file, under a base path too.
- **Images could not be uploaded.** In the raw Markdown mode the image button of Sveltia only writes an empty `![]()`, and a dropped or pasted file is ignored. The plan said otherwise, and so did the first version of the new `docs/CONTENT.md`. See section 6.
- **An uploaded image was broken on the site.** Its file name had spaces: the CMS wrote them as `%20` in the link, as Markdown requires, and the loader compared the encoded link with the real name. `resolveAsset` now also looks the file up under the decoded name, and new uploads are renamed like a slug (`slugify_filename`).
- **An image was shown as code in the visual editor.** Its title was on the next line, a habit from HedgeDoc; the editor reads an image only when it is on one line. The image was put on one line.
- **A hidden section was shown as text.** The visual editor does not know HTML comments: it shows what they hide. The maintainer removed the commented-out section from the About page.
- **The preview lists every field**, the two about the Home page too. It is Sveltia's own preview, not the page of the site. Left as it is.
- **The groups of the sidebar** ("Collections" first, then "Files") cannot be renamed or reordered. The alternative, a "Pages" collection at the top of the list, was not wanted.

## 5. Changes to the forms

Asked by the maintainer while trying the CMS:

- **The advisory board only on the About page.** A collection gives the same fields to all its pages, so "Stay in touch" offered an advisory board too. About Bit Philology became a single page of its own, like Team, and only it has the field.
- **No "Text of the card".** No page used the `excerpt` field: it was removed from the CMS and from the loader. A card shows the first paragraph of the page, as before.
- **The Text before the two fields about the Home page.** The body is not in the front matter, so the files do not change.
- **Three keywords at most** (`max: 3`). The limit is in the CMS only.

## 6. The visual editor

The plan wanted raw Markdown only, because a visual editor rewrites the text and the site relies on notes (`[^label]`), markers (`{{team}}`), `[no-lead]` and hard line breaks. Since the raw mode cannot upload an image, the visual editor was first added as a second mode and then made the one the text opens in (`modes: [rich_text, raw]`). Before the site went online with it, two saves from the visual editor were compared with a copy of the files:

- **About Bit Philology**: `*italic*` became `_italic_` and some blank lines moved. The notes, `{{advisory-board}}`, an HTML comment, the lists and the headings came back intact.
- **The event page**: its 11 hard line breaks (`\`) came back intact.

Both built pages were the same as before. Opening a page in the visual editor does not change it: the editor keeps the Markdown as it is until the text is edited.

## 7. Online, and the sign-in with GitHub (14 October)

- **Online**: the work was committed on the branch `sveltia-cms`, merged into `main` and pushed by the maintainer (`7513056`). The CMS is at https://bitphilology.dh.unibe.ch/admin/.
- **The Worker**: the maintainer deployed Sveltia CMS Authenticator on Cloudflare Workers as `bp-sveltia-cms-auth`, registered a GitHub OAuth App and set the three variables of the Worker. Two pieces of advice given for the OAuth App: register it under the organisation, so that it needs no approval, and untick "Expire user access tokens", because the Authenticator cannot renew a sign-in.
- **Checked from outside**: a sign-in request from the domain of the site is sent on to GitHub, and the same request from another domain is refused.
- **`config.yml`** (`c90834b`): `base_url` is the address of the Worker; `auth_scope: public_repo` asks an editor for access to public repositories only, since the repository is public; the sign-in with a token stays as a fallback.
- **Tried on the published site**: the maintainer created and deleted a test event with a pasted image (`6e0b1d3`, `90dfb95`, two commits made by the CMS, each followed by a deployment).

The to-do of the migration was deleted once it was done: the plan can be read in the git history, as of `c90834b`. The other to-do of the folder was checked and brought up to date, and a new one lists the open issues of the repository.

## 8. Open points

- **Editors**: give the colleagues write access to the repository. `docs/CONTENT.md` tells them how to sign in.
- **The size of the images**: the CMS uploads an image as it is (a test screenshot was 4.5 MB). Sveltia can shrink and convert images when they are uploaded; to be decided.
- **`docs/credits-note.md`** is the draft of the Credits note for HedgeDoc. The page now lives in `src/content/about/credits/`, so the draft can be deleted. The Credits page does not mention Sveltia CMS yet.
- **The Cloudflare dashboard** lists the Worker with "No active routes", although it answers at its `workers.dev` address. To check: the Production switch under Domains.
- **Updating Sveltia CMS**: the version is pinned. After changing it, check in the CMS that a save still changes only what was edited.
- **Text styles as utilities**: [docs/todo/2026-10-06 text-styles-as-utilities.md](todo/2026-10-06%20text-styles-as-utilities.md) is still to do.
- **The open issues on GitHub**: seven small points, listed in [docs/todo/2026-10-14 open-issues.md](todo/2026-10-14%20open-issues.md).
- **From the previous summaries**: the photo of Tommaso Elli on the Team page is still a placeholder; the fit of the Home images and the style of long publication titles are still to be decided. Closed since then: the authors of the four publications are written, the Credits page exists, and the event note on HedgeDoc no longer matters.

## 9. Notes on the way of working

- **Every save from the CMS is a commit on `main`.** Run `git pull` before starting to work and before pushing. This replaces the earlier rule that imported pages are edited on HedgeDoc.
- **What the assistant could not see.** Everything about the interface of the CMS came from its source and had to be confirmed in the browser by the maintainer. The one claim taken from the plan without a check, uploading an image in the raw mode, was wrong and had already been written in the guide. Such claims are to be marked as not checked until someone has seen them.
- **Reading the source of the pinned version paid off**: the files were written in the right form at the first attempt, and the problem with `public_folder` was found before any file was written.
- **Keep a copy before a test that lets a tool rewrite the content.** The two saves from the visual editor were judged by comparing the files with such a copy.
- **Git**: the assistant never pushes and commits only when asked; the maintainer made every commit. Its attempts to delete the four old files were refused by the permission system, so the maintainer deleted them.
