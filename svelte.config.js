import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build'
		}),
		// The path the site is served under: empty at the root of a domain (the production site,
		// https://bitphilology.dh.unibe.ch/), "/<repository>" on a GitHub Pages project site.
		// Set BASE_PATH to build for a base path; never hardcode it.
		paths: {
			base: process.env.BASE_PATH ?? ''
		},
		prerender: {
			entries: ['*']
		}
	}
};

export default config;
