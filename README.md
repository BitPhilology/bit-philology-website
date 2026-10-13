# Bit Philology — website

The website of **Bit Philology**, a Swiss National Science Foundation Starting Grant project (2025–2030) on the textual scholarship of born-digital literary archives. The project is conducted at the Digital Humanities Center, part of the Walter Benjamin Kolleg at the University of Bern.

- Live site: https://bitphilology.dh.unibe.ch/ (see [Where the site is served](#where-the-site-is-served))

The site is static: the pages are written as notes on HedgeDoc, copied into this repository as Markdown, and built into HTML with SvelteKit.

## Documentation

| File | For | What it covers |
| --- | --- | --- |
| [docs/CONTENT.md](docs/CONTENT.md) | people who write the pages | Adding, updating and removing pages; the settings of a note; images, notes, the Home page |
| [docs/templates/](docs/templates/) | people who write the pages | The templates of the notes: a page, and an image of the Home grid |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | developers | How the code turns the content into pages: loader, components, theming, text styles |
| [CLAUDE.md](CLAUDE.md) | developers and the AI coding assistant | The rules of the repository: stack, CSS layers, design tokens, content and import rules |

## Stack

- [SvelteKit 2](https://svelte.dev/docs/kit) with Svelte 5 (runes) and TypeScript, built by Vite
- `@sveltejs/adapter-static`: every route is prerendered into `build/`
- Tailwind CSS v4 through `@tailwindcss/vite`
- Fonts self-hosted with Fontsource (Mona Sans, Bitcount Prop Single, JetBrains Mono); icons from `pixelarticons`
- Markdown rendered at build time with unified (remark and rehype)
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
| `npm run syncFromHedgeDoc` | Copies the pages from HedgeDoc into `src/content` (see [Content](#content)) |

Before pushing, run `npm run check` and `npm run build`: the build fails, naming the file, when a page has a problem (a missing title, a wrong position, a misplaced marker).

### Where things are

```
src/content/      the pages, as Markdown, and contents.yaml, the list of the HedgeDoc notes
src/lib/          the code: content loader, components, templates, styles
src/routes/       the routes: Home, and one page per post
scripts/          syncFromHedgeDoc.js, the import script
docs/             the documentation and the templates of the notes
static/           files copied as they are into the site (robots.txt)
.github/workflows/deploy.yml   the deployment to GitHub Pages
```

## Content

The pages are not written in this repository. Each page is a note on the HedgeDoc server of the University of Bern (https://pad.dsl.unibe.ch); [`src/content/contents.yaml`](src/content/contents.yaml) lists the notes, and one command copies them here, with their images:

```sh
npm run syncFromHedgeDoc
```

To add a page, paste the link of its published note under `new` in `contents.yaml` and run the command; the changes it makes to `src/content` are then committed and pushed like any other change. The whole procedure, with the settings of a note and the options of the command, is in [docs/CONTENT.md](docs/CONTENT.md).

HedgeDoc may only be reachable from the network of the University of Bern (or its VPN). The import is always run by hand: the deployment does not contact HedgeDoc, it publishes what is in the repository.

## Deployment

The site is published on **GitHub Pages** by a GitHub Actions workflow, [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. A push to `main` starts the workflow. It can also be started by hand: on GitHub, **Actions → Deploy to GitHub Pages → Run workflow**.
2. The `build` job checks out the repository, installs the dependencies with `npm ci` on Node 24, runs `npm run build` and uploads the `build/` folder.
3. The `deploy` job publishes that folder on GitHub Pages. The whole run takes about a minute; its result is in the **Actions** tab.

So publishing a change means: commit, push to `main`, wait for the green tick.

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
