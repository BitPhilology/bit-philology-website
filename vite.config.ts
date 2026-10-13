import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';

/**
 * The content manager is a static page, static/admin/index.html, which GitHub Pages serves at
 * /admin/. The dev server only serves a file of static/ under its own name, so /admin/ would be
 * the "Not found" page of the site: this sends it to the file, under a base path too.
 */
function adminPage(): Plugin {
	const admin = `${process.env.BASE_PATH ?? ''}/admin`;
	return {
		name: 'admin-page',
		configureServer(server) {
			server.middlewares.use((req, _res, next) => {
				const [path, query] = (req.url ?? '').split('?');
				if (path === admin || path === `${admin}/`) {
					req.url = `${admin}/index.html${query ? `?${query}` : ''}`;
				}
				next();
			});
		}
	};
}

export default defineConfig({
	// adminPage comes first, so that its rewrite runs before SvelteKit looks for the file.
	plugins: [adminPage(), tailwindcss(), sveltekit()],
	server: { allowedHosts: ['.trycloudflare.com', '.ngrok-free.app'] }
});
