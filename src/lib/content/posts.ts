// Turns the front matter and body of a markdown file into a Post, and orders posts.
import { isPostType } from '$lib/categories';
import { flag, list, text } from './fields';
import { siteUrl } from './links';
import { firstParagraph, toPlainText } from './markdown';
import type { Post } from './types';

type FrontMatter = Record<string, unknown>;

// A link of the front matter: a path of the site gets the base path of the deployment.
const link = (value: unknown) => {
	const url = text(value);
	return url && siteUrl(url);
};

// Titles may hold markdown (e.g. *born-digital*); cards and lists show them as plain text.
const plain = (value: unknown) => {
	const raw = text(value);
	return raw && toPlainText(raw);
};

/**
 * A post from its folder (relative to src/content), front matter and body. Fails the build when a
 * required field is missing: `title`, the page's h1. Every other field may be missing.
 */
export function toPost(path: string, data: FrontMatter, body: string): Post {
	// `about` is the fallback type: the CMS sets the type of every page it creates.
	const type = isPostType(data.type) ? data.type : 'about';
	const title = plain(data.title);
	const file = `src/content/${path}/index.md`;
	if (!title) throw new Error(`${file}: the front matter has no "title"; every page needs one.`);
	return {
		type,
		path,
		href: `/${path}/`,
		title,
		subtitle: plain(data.subtitle),
		date: text(data.date),
		excerpt: firstParagraph(body),
		position: toPosition(data.position, file),
		hiddenFromHome: flag(data['hidden-from-home']),
		authors: text(data.authors),
		venue: text(data.venue),
		location: text(data.location),
		publicationType: text(data['publication-type']),
		keywords: list(data.keywords),
		kind: text(data.kind),
		doi: text(data.doi),
		downloadLink: link(data['download-link'])
	};
}

/** Newest first; posts without a date last. Dates are `YYYY-MM-DD` or `YYYY`, so they sort as text. */
export function byDate(a: Post, b: Post): number {
	return (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title);
}

/**
 * The `position` of a post in the Home grid: a whole number, counted from the start (1 is the first
 * tile) or, when negative, from the end (-1 is the last). An empty or missing field is no position.
 * Anything else fails the build.
 */
function toPosition(value: unknown, file: string): number | undefined {
	if (value == null || value === '') return undefined;
	if (typeof value === 'number' && Number.isInteger(value) && value !== 0) return value;
	throw new Error(
		`${file}: "position" must be a whole number other than 0, such as 2 or -1, or be left empty (found ${JSON.stringify(value)}).`
	);
}

/** Long publication titles use the smaller heading style on cards, as in the Figma Home frames. */
export const LONG_TITLE = 40;
