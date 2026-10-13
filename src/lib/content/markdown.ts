// Small markdown helpers for the loader. They split a file into its front matter and its body, and
// extract plain text; they do not render.

const FRONT_MATTER = /^---[ \t]*\r?\n(?:([\s\S]*?)\r?\n)?---[ \t]*(?:\r?\n|$)/;

/** A markdown image: ![alt](url "optional title"); the title may start on the next line. */
const IMAGE = /!\[([^\]]*)\]\(\s*(<[^>\n]*>|[^\s)]+)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g;

/** Splits a markdown file into its front matter (raw YAML) and its body. */
export function splitFrontMatter(markdown: string) {
	const match = markdown.match(FRONT_MATTER);
	return { frontMatter: match?.[1] ?? '', body: match ? markdown.slice(match[0].length) : markdown };
}

/** The first paragraph of a body that holds text, as plain text. */
export function firstParagraph(body: string): string {
	for (const block of body.split(/\n[ \t]*\n/)) {
		const trimmed = block.trim();
		// Headings, footnote definitions, lists, quotes and code are not a lead paragraph.
		if (!trimmed || /^(#|\[\^|[-*+] |\d+\. |>|```|~~~|<!--)/.test(trimmed)) continue;
		const text = toPlainText(trimmed.replace(/^\[no-lead\]\s*/, ''));
		if (text) return text;
	}
	return '';
}

/** Plain text of a markdown fragment. Deleted text (~~…~~), images and footnote references go. */
export function toPlainText(markdown: string): string {
	return markdown
		.replace(/~~[\s\S]*?~~/g, '')
		.replace(IMAGE, '')
		.replace(/\[\^[^\]]+\]/g, '')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]+>/g, '')
		.replace(/(\*\*|__|\*|`)/g, '')
		.replace(/(^|[^\w])_([^_]+)_(?=[^\w]|$)/g, '$1$2')
		.replace(/\s+/g, ' ')
		.trim();
}
