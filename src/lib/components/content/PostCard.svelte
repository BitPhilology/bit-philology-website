<!--
	Post card (Figma "Post"): the tile of a post on Home, and later on the category pages. A shared
	shell (the meta row at the bottom, and the fade of long text) around a body that the registry
	picks: stacked (title over a description) or two-column (publications). The title links to the post,
	and its link covers the whole card (CardLink). Under the pointer or the keyboard focus the card
	comes forward: it grows by 5% around its centre, above its neighbours, without moving them.
-->
<script lang="ts">
	import { POST_TYPES, categoryOf } from '$lib/categories';
	import Tile from '$lib/components/ui/Tile.svelte';
	import type { Post } from '$lib/content/types';
	import CategoryTheme from './CategoryTheme.svelte';
	import PostBody from './PostBody.svelte';
	import PostMeta from './PostMeta.svelte';
	import PublicationBody from './PublicationBody.svelte';

	let { post }: { post: Post } = $props();

	const BODIES = { stacked: PostBody, 'two-column': PublicationBody };
	const entry = $derived(POST_TYPES[post.type]);
	const Body = $derived(BODIES[entry.card.body]);
	// Only for those who have not asked for reduced motion; Tailwind's hover variant only applies on
	// devices that can hover.
	const ZOOM =
		'motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:z-10 motion-safe:hover:scale-105 motion-safe:has-focus-visible:z-10 motion-safe:has-focus-visible:scale-105';
</script>

<CategoryTheme category={categoryOf(post.type)}>
	<Tile element="article" surface="card" class={['flex flex-col gap-3', ZOOM]}>
		<Body {post} />
		{#if entry.card.fade}
			<div
				aria-hidden="true"
				class="pointer-events-none absolute inset-x-0 bottom-0 h-34 bg-linear-to-b from-surface-light-background/0 to-surface-light-background to-75%"
			></div>
		{/if}
		<PostMeta icon={entry.icon} label={entry.label} pills={entry.card.pills(post)} />
	</Tile>
</CategoryTheme>
