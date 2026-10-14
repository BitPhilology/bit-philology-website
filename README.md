# Bit Philology — website

The website of **Bit Philology**, a Swiss National Science Foundation Starting Grant project (2025–2030) on the textual scholarship of born-digital literary archives. The project is conducted at the Digital Humanities Center, part of the Walter Benjamin Kolleg at the University of Bern.

- Live site: https://bitphilology.dh.unibe.ch/ (see [Where the site is served](#where-the-site-is-served))

The site is static: the pages are Markdown files in this repository, edited in the browser with a content manager ([Sveltia CMS](https://sveltiacms.app), at `/admin/`), and built into HTML with SvelteKit.

## Documentation

| File | For | What it covers |
| --- | --- | --- |
| [docs/CONTENT.md](docs/CONTENT.md) | people who write the pages | Signing in to the content manager; creating, editing and deleting pages; the fields; images, notes, the Home page |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | developers | How the code turns the content into pages: loader, components, theming, text styles |
| [CLAUDE.md](CLAUDE.md) | developers and the AI coding assistant | The rules of the repository: stack, CSS layers, design tokens, the content and the configuration of the content manager |

## Stack

- [SvelteKit 2](https://svelte.dev/docs/kit) with Svelte 5 (runes) and TypeScript, built by Vite
- `@sveltejs/adapter-static`: every route is prerendered into `build/`
- Tailwind CSS v4 through `@tailwindcss/vite`
- Fonts self-hosted with Fontsource (Mona Sans, Bitcount Prop Single, JetBrains Mono); icons from `pixelarticons`
- Markdown rendered at build time with unified (remark and rehype)
- Content edited with Sveltia CMS: two static files in `static/admin/`, and a small sign-in service on Cloudflare Workers
- Design source: the Figma file linked in [CLAUDE.md](CLAUDE.md)

## Working on the site

You need [Node.js](https://nodejs.org) 24 (LTS) and npm.

```sh
git clone https://github.com/BitPhilology/bit-philology-website.git
cd bit-philology-website
npm install
npm run dev          # start the development server
npm run dev -- --open   # …and open the site in a new browser tab
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server, with live reload |
| `npm run check` | Checks the types and the Svelte components |
| `npm run build` | Builds the production site into `build/` |
| `npm run preview` | Serves the built site locally, to check it before publishing |

The editors publish through the content manager, and each of their saves is a commit on `main`: run `git pull` before you start working and before you push.

Before pushing, run `npm run check` and `npm run build`: the build fails, naming the file, when a page has a problem (a missing title, a wrong position, a misplaced marker).

### Where things are

```
src/content/      the pages, as Markdown, each with its images
src/lib/          the code: content loader, components, templates, styles
src/routes/       the routes: Home, and one page per post
docs/             the documentation
static/           files copied as they are into the site: robots.txt, the icons of the site, and admin/, the content manager
.github/workflows/deploy.yml   the deployment to GitHub Pages
```

## Content

The pages are the Markdown files of [`src/content`](src/content): one folder per page, with its text in `index.md` and its images in `assets/`. This repository is their only source.

They are edited with [Sveltia CMS](https://sveltiacms.app), a content manager that runs in the browser, at https://bitphilology.dh.unibe.ch/admin/. An editor signs in with a GitHub account that can write to this repository, fills in a form and saves. The sign-in goes through [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth), a small service on Cloudflare Workers that is set up outside this repository (see [CLAUDE.md](CLAUDE.md#the-cms-staticadmin)). Each save is a commit on `main`, made by the browser through the GitHub API, and it starts the deployment like any other push. There are no drafts and no pull requests.

The content manager is two static files, in [`static/admin/`](static/admin):

- `index.html` loads the Sveltia CMS script, with its version pinned;
- `config.yml` describes the repository, the sections of the website and the fields of each type of page.

To try it on your computer without signing in, run `npm run dev`, open http://localhost:5173/admin/ in Chrome or Edge, press **Work with Local Repository** and pick the folder of the repository: the content manager then edits the local files, and commits nothing.

The guide for the editors, with the fields and the way of signing in, is [docs/CONTENT.md](docs/CONTENT.md); the rules of the files and of the configuration are in [CLAUDE.md](CLAUDE.md#content).

## Deployment

The site is published on **GitHub Pages** by a GitHub Actions workflow, [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. A push to `main` starts the workflow. It can also be started by hand: on GitHub, **Actions → Deploy to GitHub Pages → Run workflow**. Two kinds of push do not start it:
   - a push that only changes files that are not part of the site: `docs/`, `CLAUDE.md`, `README.md`, `LICENSE`, `.vscode/` and `.mcp.json` (the `paths-ignore` list of the workflow);
   - a push whose last commit has `[skip ci]` in its message, for a change that can wait for the next deployment.
2. The `build` job checks out the repository, installs the dependencies with `npm ci` on Node 24, runs `npm run build` and uploads the `build/` folder.
3. The `deploy` job publishes that folder on GitHub Pages. The whole run takes about a minute; its result is in the **Actions** tab.

So publishing a change means: commit, push to `main`, wait for the green tick. A save in the content manager is such a commit.

Two things to know:

- **Repository setting.** Under **Settings → Pages → Build and deployment**, the source must be **GitHub Actions**. With "Deploy from a branch", GitHub also publishes the files of the repository themselves (the README, rendered by Jekyll), and that version replaces the real site.
- **A failed build publishes nothing.** If `npm run build` fails in the workflow, the site stays as it was. Run the build locally first to see the same error.

### Where the site is served

The site is served at https://bitphilology.dh.unibe.ch/, the custom domain of the GitHub Pages site. The old address, https://bitphilology.github.io/bit-philology-website/, redirects to it.

The domain is set up outside the code, following the [GitHub documentation on custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site):

- The IT service of the university keeps a DNS record of type `CNAME` for `bitphilology.dh.unibe.ch` that points to `bitphilology.github.io`.
- The domain is entered under **Settings → Pages → Custom domain**, where **Enforce HTTPS** can also be ticked. With a deployment through GitHub Actions the domain is kept in the settings of the repository, so no `CNAME` file is needed in `static/`.

### Base path

With the custom domain the site is at the root of its domain, so the workflow builds it without a base path. The code does not depend on that: the base path is never written in it. The build reads it from the `BASE_PATH` environment variable (`kit.paths.base` in [`svelte.config.js`](svelte.config.js), empty by default), and every link and asset of the site follows it.

To check that the site still works under a base path, build it with one on your computer:

```sh
BASE_PATH=/bit-philology-website npm run build
BASE_PATH=/bit-philology-website npm run preview   # then open http://localhost:4173/bit-philology-website/
```

If the custom domain is ever removed, GitHub Pages serves the site under `/bit-philology-website` again, and the workflow has to pass that path to the build. Add this to the "Build site" step of [`deploy.yml`](.github/workflows/deploy.yml):

```yaml
env:
  BASE_PATH: ${{ steps.pages.outputs.base_path }}
```

GitHub Pages reports an empty path for a site at the root of its domain, so this setting also works with the custom domain.

## Recreating the project

The project was created with the Svelte CLI, [`sv`](https://github.com/sveltejs/cli):

```sh
npx sv@0.15.3 create --template minimal --types ts --install npm .
```

and then extended with `@sveltejs/adapter-static`, Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`), the Fontsource fonts, `pixelarticons`, the unified packages for Markdown and `yaml`. The exact versions are in [`package.json`](package.json).

## License

The repository is released under the Creative Commons Attribution-ShareAlike 4.0 International license: see [LICENSE](LICENSE).
