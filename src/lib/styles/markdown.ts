// The classes of the elements of a rendered markdown body, by tag name, added at build time by
// src/lib/server/markdown.ts. They are the Figma text styles of TEXT; the colour comes from the
// page (--cat-darker). The vertical rhythm between blocks is the gap of the page grid.
import { TEXT } from './text';

export const MARKDOWN_CLASSES: Partial<Record<string, string>> = {
	h2: `${TEXT['heading/h2']} scroll-mt-4`,
	h3: `${TEXT['heading/h3']} scroll-mt-4`,
	h4: TEXT['heading/h4'],
	h5: TEXT['heading/h5'],
	h6: TEXT['heading/h6'],
	p: TEXT['body/body'],
	ul: `${TEXT['body/body']} list-disc space-y-3 pl-6 [&_ol]:mt-1 [&_ol]:space-y-1 [&_ul]:mt-1 [&_ul]:space-y-1`,
	ol: `${TEXT['body/body']} list-decimal space-y-3 pl-6 [&_ol]:mt-1 [&_ol]:space-y-1 [&_ul]:mt-1 [&_ul]:space-y-1`,
	blockquote: `${TEXT['body/blockquote']} border-l-2 border-(--cat-main) pl-4`,
	pre: 'overflow-x-auto bg-surface-subtle p-4',
	code: TEXT['code/code'],
	a: 'underline underline-offset-2',
	strong: 'font-bold',
	del: 'line-through',
	hr: 'border-(--cat-darker)',
	img: 'max-w-full'
};

/** The lead paragraph, the first paragraph of a body (unless it starts with [no-lead]). */
export const LEAD_CLASSES = TEXT['body/lead-paragraph'];
