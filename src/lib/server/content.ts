// Reads every markdown file of src/content at build time (server only: the parsing never reaches
// the browser). Posts and Home image fillers are kept apart, so fillers only ever reach the Home grid.
import { parseDocument } from 'yaml';
import { categoryOf, type Category } from '$lib/categories';
import { toFiller } from '$lib/content/fillers';
import { siteUrl } from '$lib/content/links';
import { splitFrontMatter } from '$lib/content/markdown';
import { byDate, toPost } from '$lib/content/posts';
import type { ImageFillerContent, Post, PostLink, PostPage } from '$lib/content/types';
import { renderBody } from './markdown';

const CONTENT = '/src/content/';

const files = import.meta.glob<string>('/src/content/**/index.md', { eager: true, query: '?raw', import: 'default' });
// The images of the pages (the assets/ folder of each page), as built asset URLs.
const assets = import.meta.glob<string>('/src/content/**/assets/*', { eager: true, query: '?url', import: 'default' });

/** A post with what its page needs: the front matter and the markdown body. */
interface Source {
	post: Post;
	file: string;
	folder: string;
	data: Record<string, unknown>;
	body: string;
}

const sources = new Map<string, Source>();
const fillers: ImageFillerContent[] = [];

for (const [path, markdown] of Object.entries(files)) {
	const folder = path.slice(CONTENT.length, -'/index.md'.length);
	const file = path.slice(1);
	const { frontMatter, body } = splitFrontMatter(markdown);
	const yaml = parseDocument(frontMatter);
	if (yaml.errors.length) throw new Error(`Invalid front matter in ${file}: ${yaml.errors[0].message}`);
	const data = (yaml.toJS() ?? {}) as Record<string, unknown>;

	if (data.type === 'home-image-filler') {
		fillers.push(toFiller(path, data, (src) => resolveAsset(folder, src)));
	} else {
		sources.set(folder, { post: toPost(folder, data, body), file, folder, data, body });
	}
}
const posts = [...sources.values()].map(({ post }) => post).sort(byDate);

/**
 * The built URL of an image of a page, written as the CMS writes it: ./assets/photo.jpg, a file of
 * the page's own folder, or /src/content/assets/photo.jpg, a file of the shared folder. A URL with a
 * scheme, such as a placeholder image, stays as it is; a path of the site, such as a file of
 * static/, gets the base path of the deployment.
 *
 * The name of a file may hold spaces or accents. A link of the text then has them encoded
 * (photo%20one.jpg), and a URL encodes the ones written as they are, so the file is looked up under
 * the decoded path as well.
 */
function resolveAsset(folder: string, src: string): string {
	if (/^[a-z][a-z\d+.-]*:/i.test(src)) return src;
	const { pathname } = new URL(src, `file://${CONTENT}${folder}/`);
	return assets[pathname] ?? assets[decodePath(pathname)] ?? siteUrl(src);
}

/** "photo%20one.jpg" → "photo one.jpg"; a path that is not a valid encoding stays as it is. */
function decodePath(path: string): string {
	try {
		return decodeURIComponent(path);
	} catch {
		return path;
	}
}

/** Every post, newest first. */
export function getPosts(): Post[] {
	return posts;
}

/** Every Home image filler. */
export function getFillers(): ImageFillerContent[] {
	return fillers;
}

export function getPost(path: string): Post | undefined {
	return sources.get(path)?.post;
}

/** A post page: the post, its body rendered as blocks, and the posts of its category for the page index. */
export function getPage(path: string): PostPage | undefined {
	const source = sources.get(path);
	if (!source) return undefined;
	const { post, file, folder, data, body } = source;
	return {
		post,
		body: renderBody(body, { file, data, resolveAsset: (src) => resolveAsset(folder, src) }),
		section: getSheets()[categoryOf(post.type)] ?? []
	};
}

/** The posts of each dock category, newest first, for the page sheet. Team is listed under About. */
export function getSheets(): Partial<Record<Category, PostLink[]>> {
	const sheets: Partial<Record<Category, PostLink[]>> = {};
	for (const { type, title, href } of posts) (sheets[categoryOf(type)] ??= []).push({ title, href });
	return sheets;
}
