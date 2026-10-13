// Renders the markdown body of a post at build time (server only, with unified: remark, then
// rehype) into blocks: one block per top-level element, in the editor's order, which the page
// shows as the rows of its grid. A paragraph, heading, list… is a block of HTML with the notes it
// refers to (src/lib/server/notes.ts); an image alone in its paragraph is a figure, whose title is
// the caption; a marker such as {{team}} is an embed. Body headings start at h2 and get ids, which
// the page index links to.
import type { Element, ElementContent, Root as HastRoot } from 'hast';
import { toHtml } from 'hast-util-to-html';
import type {
	Heading as MdastHeading,
	Image,
	Root as MdastRoot,
	Nodes,
	Paragraph,
	PhrasingContent,
	RootContent
} from 'mdast';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { siteUrl } from '$lib/content/links';
import { findMarkers, markerName } from '$lib/content/markers';
import type { BodyBlock, Heading, Note, RenderedBody } from '$lib/content/types';
import { EMBEDS, isEmbedName, type EmbedName } from '$lib/embeds';
import { LEAD_CLASSES, MARKDOWN_CLASSES } from '$lib/styles/markdown';
import { pairNotes, type NoteSource } from './notes';

// Raw HTML in the markdown is dropped (remark-rehype's default), so the output is safe for {@html}.
// rehype-slug gives the headings ids, so that the page index and links can point to a section.
const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeSlug).freeze();

// The lead paragraph is marked on the markdown tree and becomes a <p> with the lead classes.
const LEAD = 'bp-lead';
const NO_LEAD = '[no-lead]';
// Top-level nodes that render nothing: link reference definitions and raw HTML.
const SILENT = new Set<RootContent['type']>(['definition', 'html']);

interface Options {
	/** The markdown file, for error messages. */
	file: string;
	/** Its front matter, where the embeds find their data. */
	data: Record<string, unknown>;
	/** Turns a relative image path (./assets/…) into its built URL. */
	resolveAsset: (src: string) => string;
}

/** A top-level node of the body, sorted into the block it becomes. */
type Planned =
	| { kind: 'html'; node: RootContent; notes: NoteSource[] }
	| { kind: 'figure'; image: Image }
	| { kind: 'embed'; name: EmbedName };

export function renderBody(markdown: string, { file, data, resolveAsset }: Options): RenderedBody {
	const root = processor.parse(markdown);
	const notes = pairNotes(root, file);
	normalizeHeadings(root);
	markLead(root);
	const plan = planBlocks(root, notes, file);
	const embedData = parseEmbedData(data, plan, file, resolveAsset);
	const elements = renderHtml(
		plan.flatMap((item) => (item.kind === 'html' ? [item.node] : [])),
		resolveAsset
	);

	const blocks = plan.flatMap((item): BodyBlock[] => {
		if (item.kind === 'embed') return [{ kind: 'embed', name: item.name, data: embedData.get(item.name) }];
		if (item.kind === 'figure') return figureBlock(item.image, file, resolveAsset);
		const element = elements.get(item.node);
		if (!element) return [];
		return [{ kind: 'html', html: toHtml(element), notes: item.notes.map((note) => renderNote(note, resolveAsset)) }];
	});
	const headings = [...elements.values()]
		.filter((element) => element.tagName === 'h2')
		.map((element): Heading => ({ id: String(element.properties.id), text: textOf(element) }));
	return { blocks, headings };
}

/**
 * Body headings start at h2, under the page's h1 (the title): the highest level the editor used
 * becomes h2 and the others keep their distance from it, down to h6. Editors often use #### for
 * sections; on the page they are h2, so the outline has no gaps.
 */
function normalizeHeadings(root: MdastRoot) {
	const headings: MdastHeading[] = [];
	const collect = (node: Nodes) => {
		if (node.type === 'heading') headings.push(node);
		else if ('children' in node) node.children.forEach(collect);
	};
	collect(root);
	if (!headings.length) return;
	const shift = 2 - Math.min(...headings.map(({ depth }) => depth));
	for (const heading of headings) heading.depth = Math.min(6, heading.depth + shift) as MdastHeading['depth'];
}

function isMarkerParagraph(node: Paragraph) {
	const [only] = node.children;
	return node.children.length === 1 && only.type === 'text' && markerName(only.value) !== null;
}

/** The image of a paragraph that holds only an image (and spaces): a figure. */
function figureImage(node: Paragraph): Image | undefined {
	const content = node.children.filter((child) => child.type !== 'text' || child.value.trim());
	return content.length === 1 && content[0].type === 'image' ? content[0] : undefined;
}

/** The first paragraph is the lead, unless it starts with [no-lead] (which is removed). */
function markLead(root: MdastRoot) {
	const first = root.children[0];
	if (first?.type !== 'paragraph' || isMarkerParagraph(first) || figureImage(first)) return;
	const head = first.children[0];
	if (head?.type === 'text' && head.value.startsWith(NO_LEAD)) {
		head.value = head.value.slice(NO_LEAD.length).trimStart();
		return;
	}
	first.data = { ...first.data, hName: LEAD };
}

/** Sorts the top-level nodes into blocks. Fails on unknown, repeated or misplaced markers. */
function planBlocks(root: MdastRoot, notes: Map<RootContent, NoteSource[]>, file: string): Planned[] {
	const plan: Planned[] = [];
	for (const node of root.children) {
		if (node.type === 'paragraph' && isMarkerParagraph(node)) {
			plan.push({ kind: 'embed', name: embedName(node, plan, file) });
			continue;
		}
		// A marker left here sits inside a paragraph with other text, or in a list, a quote or a table.
		const [stray] = markersIn(node);
		if (stray) throw new Error(`${file}: ${stray} must be a paragraph of its own, with a blank line before and after.`);
		const image = node.type === 'paragraph' ? figureImage(node) : undefined;
		if (image) plan.push({ kind: 'figure', image });
		else if (!SILENT.has(node.type)) plan.push({ kind: 'html', node, notes: notes.get(node) ?? [] });
	}
	return plan;
}

/** The embed of a marker paragraph. Fails on a marker that is not in the registry or used twice. */
function embedName(node: Paragraph, plan: Planned[], file: string): EmbedName {
	const [text] = node.children;
	const name = (text.type === 'text' && markerName(text.value)) || '';
	if (!isEmbedName(name)) {
		const known = Object.keys(EMBEDS).map((key) => `{{${key}}}`).join(', ');
		throw new Error(`${file}: unknown marker {{${name}}}. The markers are ${known}.`);
	}
	if (plan.some((item) => item.kind === 'embed' && item.name === name)) {
		throw new Error(`${file}: the marker {{${name}}} appears twice; use it once.`);
	}
	return name;
}

/** The markers in the text of a markdown tree; code is not text, so markers in code are ignored. */
function markersIn(node: Nodes): string[] {
	if (node.type === 'text') return findMarkers(node.value);
	return 'children' in node ? node.children.flatMap(markersIn) : [];
}

/**
 * The data of every embed whose field is in the front matter, validated. A field without its
 * marker is not shown (a warning); a marker without its field is an error. An empty field, as in
 * the page template, counts as missing.
 */
function parseEmbedData(
	data: Record<string, unknown>,
	plan: Planned[],
	file: string,
	resolveAsset: (src: string) => string
) {
	const used = plan.flatMap((item) => (item.kind === 'embed' ? [item.name] : []));
	const parsed = new Map<EmbedName, unknown>();
	for (const [name, { field, parse }] of Object.entries(EMBEDS) as [EmbedName, (typeof EMBEDS)[EmbedName]][]) {
		if (data[field] == null) {
			if (used.includes(name)) throw new Error(`${file}: {{${name}}} needs the "${field}" list in the front matter.`);
			continue;
		}
		parsed.set(name, parse(data[field], { file, field, resolveAsset }));
		if (!used.includes(name)) {
			console.warn(`${file}: "${field}" is in the front matter, but {{${name}}} is not in the body, so the list is not shown.`);
		}
	}
	return parsed;
}

/**
 * Renders the HTML blocks in one pass, so that heading ids stay unique, and returns the element of
 * each top-level node. Every top-level node gives one top-level element, found by its source position.
 */
function renderHtml(nodes: RootContent[], resolveAsset: (src: string) => string): Map<RootContent, Element> {
	const hast = processor.runSync({ type: 'root', children: nodes }) as HastRoot;
	decorate(hast, resolveAsset);
	const byOffset = new Map(
		hast.children.flatMap((child) => (child.type === 'element' ? [[child.position?.start.offset, child] as const] : []))
	);
	const elements = new Map<RootContent, Element>();
	for (const node of nodes) {
		const element = byOffset.get(node.position?.start.offset);
		if (element) elements.set(node, element);
	}
	return elements;
}

/** A figure from an image alone in its paragraph; none when its URL is unsafe. */
function figureBlock({ url, alt, title }: Image, file: string, resolveAsset: (src: string) => string): BodyBlock[] {
	if (!isSafeUrl(url)) return [];
	if (!alt?.trim()) console.warn(`${file}: the image ${url} has no alt text; describe it for screen readers.`);
	return [{ kind: 'figure', src: resolveAsset(url), alt: alt?.trim() ?? '', caption: title?.trim() || undefined }];
}

/** A note's text as inline HTML. Its paragraphs run together, with line breaks: a note is one paragraph on the page. */
function renderNote({ id, label, definition }: NoteSource, resolveAsset: (src: string) => string): Note {
	const paragraphs = definition.children.filter((child): child is Paragraph => child.type === 'paragraph');
	const children = paragraphs.flatMap(({ children }, index): PhrasingContent[] =>
		index ? [{ type: 'break' }, ...children] : children
	);
	const hast = processor.runSync({ type: 'root', children: [{ type: 'paragraph', children }] }) as HastRoot;
	decorate(hast, resolveAsset);
	const paragraph = hast.children.find((child): child is Element => child.type === 'element');
	return { id, label, html: paragraph ? toHtml(paragraph.children) : '' };
}

/**
 * Adds the classes of MARKDOWN_CLASSES (LEAD_CLASSES for the lead), resolves the image paths and
 * the links to pages of the site, and drops the links and images whose URL has an unsafe scheme
 * (javascript:, data:, …), since the HTML is injected as it is.
 */
function decorate(node: HastRoot | Element, resolveAsset: (src: string) => string) {
	for (const child of node.children) {
		if (child.type !== 'element') continue;
		if (child.tagName === LEAD) {
			child.tagName = 'p';
			child.properties.className = LEAD_CLASSES.split(' ');
		} else {
			const classes = MARKDOWN_CLASSES[child.tagName];
			if (classes) child.properties.className = [...classList(child.properties.className), ...classes.split(' ')];
		}
		for (const attribute of ['href', 'src']) {
			const url = child.properties[attribute];
			if (typeof url === 'string' && !isSafeUrl(url)) delete child.properties[attribute];
		}
		// A link to a page of the site, written as /about/team/, gets the base path of the deployment.
		if (typeof child.properties.href === 'string') child.properties.href = siteUrl(child.properties.href);
		if (child.tagName === 'img' && typeof child.properties.src === 'string') {
			child.properties.src = resolveAsset(child.properties.src);
		}
		decorate(child, resolveAsset);
	}
}

/** Relative URLs, fragments and the http, https, mailto and tel schemes. */
function isSafeUrl(url: string) {
	const scheme = url.trim().match(/^([a-z][a-z\d+.-]*):/i)?.[1].toLowerCase();
	return !scheme || ['http', 'https', 'mailto', 'tel'].includes(scheme);
}

function classList(value: unknown): string[] {
	if (Array.isArray(value)) return value.map(String);
	return typeof value === 'string' ? value.split(' ') : [];
}

/** The text of an element, e.g. of a heading for the page index. */
function textOf(node: Element | ElementContent): string {
	if (node.type === 'text') return node.value;
	return 'children' in node ? node.children.map(textOf).join('') : '';
}
