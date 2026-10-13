// The content model: what the loader (src/lib/server/content.ts) reads from src/content.
import type { Pathname } from '$app/types';
import type { Category, PostType } from '$lib/categories';

/** A post: src/content/<section>/<slug>/index.md, any type except home-image-filler. */
export interface Post {
	type: PostType;
	/** Folder relative to src/content, e.g. "events/digital-forensics-in-the-humanities". */
	path: string;
	/**
	 * The path of the post page inside the site: the folder path, with a trailing slash. Links go
	 * through resolve() from $app/paths, which adds the base path of the deployment.
	 */
	href: Pathname;
	title: string;
	subtitle?: string;
	/** `YYYY-MM-DD`, or `YYYY`. */
	date?: string;
	/** The first paragraph of the body, as plain text: the text of the card of About, Team and Artifact pages. */
	excerpt: string;
	/**
	 * Where the card sits in the Home grid (the `position` field): 1 is the first tile, -1 the last.
	 * Without it the post follows its date, newest first.
	 */
	position?: number;
	/** A post with `hidden-from-home: true` has no card on Home. */
	hiddenFromHome: boolean;
	/** Publications and artifacts, e.g. "E. Spadini, E. Barchielli". */
	authors?: string;
	/** Publication venue, or where an event takes place. */
	venue?: string;
	/** Events: where it takes place, when it differs from `venue`. */
	location?: string;
	/** Publications, e.g. "poster". */
	publicationType?: string;
	/** Artifacts: shown as pills. */
	keywords: string[];
	/** Artifacts: what kind of object it is, shown as the first pill. */
	kind?: string;
	/** Publications: the DOI, as `10.5281/zenodo.…` or as a URL. */
	doi?: string;
	/** Publications: the file to download (the `download-link` field). */
	downloadLink?: string;
}

/** The categories an image filler can take its colour from. */
export type FillerAccent = Exclude<Category, 'home'>;

/** A Home image filler: src/content/home-image-fillers/<slug>/index.md, whose front matter names one image. */
export interface ImageFillerContent {
	/** The markdown file, for error messages. */
	file: string;
	accent: FillerAccent;
	/** 1-based index in the final Home grid; 1 is the first tile (the logo filler). */
	position: number;
	image: { src: string; alt: string };
}

/** A post in the list of the dock's page sheet. */
export interface PostLink {
	title: string;
	/** The path of the page inside the site, as `Post.href`. */
	href: Pathname;
}

/** The sizes of a Team Member, after the Figma "Size" property: the photo is 120, 96 or 60 px wide. */
export type MemberSize = 'large' | 'medium' | 'small';

/** A person in the member list of the Team page: an entry of `members`. */
export interface Member {
	name: string;
	role: string;
	affiliation?: string;
	/** The image URL: a file of the page's assets/ folder, resolved to its built URL, or a remote image. */
	photo?: string;
	/** The size of the card (the `size` field); medium when the field is missing. */
	size: MemberSize;
	/** The member's page elsewhere (the `external-url` field), linked from the name. */
	externalURL?: string;
}

/** A person in the advisory board list of the About page: an entry of `advisory-board`. */
export interface BoardMember {
	name: string;
	affiliation?: string;
	/** The member's page elsewhere (the `external-url` field), linked from the icon after the name. */
	externalURL?: string;
}

/**
 * A sidenote: a footnote of the body ([^label] in the text, [^label]: … as its own paragraph). It is
 * shown beside the block that first refers to it from lg, and right after that block below lg.
 */
export interface Note {
	/** The id of the note, which its references link to: "sidenote-01". */
	id: string;
	/** The number on the reference and on the note: "01". */
	label: string;
	/** The note text, as inline HTML. */
	html: string;
}

/**
 * A block of a rendered body: one top-level element of the markdown, shown as one row of the page
 * grid (src/lib/styles/grid.ts). `html` is a paragraph, a heading, a list…, with the notes it refers
 * to; `figure` an image alone in its paragraph, with its title as the caption; `embed` a component
 * that a marker such as {{team}} places (src/lib/embeds.ts).
 */
export type BodyBlock =
	| { kind: 'html'; html: string; notes: Note[] }
	| { kind: 'figure'; src: string; alt: string; caption?: string }
	| { kind: 'embed'; name: string; data: unknown };

/** A heading of the body (h2), for the page index. */
export interface Heading {
	id: string;
	text: string;
}

/** The body of a post, rendered at build time by src/lib/server/markdown.ts. */
export interface RenderedBody {
	/** The blocks in the editor's order; the first paragraph is the lead, unless it starts with [no-lead]. */
	blocks: BodyBlock[];
	headings: Heading[];
}

/** What a post page gets: the post, its rendered body and the posts of its category. */
export interface PostPage {
	post: Post;
	body: RenderedBody;
	/** Every post of the same category, newest first (Team is listed under About). */
	section: PostLink[];
}
