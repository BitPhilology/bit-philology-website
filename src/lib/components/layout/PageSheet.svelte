<!--
	Page sheet (Figma "Page Sheet"): the posts of a category, shown next to the dock when its item is
	tapped. Full width above the dock on phones; from lg, where the dock is at the top, a popover
	below the item. It starts directly with the rows. A non-modal dialog: it takes the focus when it
	opens; its dock item, Escape, a click outside or a navigation close it (NavDock). Ready for
	pagination: it lists the `posts` it is given.
-->
<script lang="ts">
	import arrowRight from 'pixelarticons/svg/arrow-right.svg?raw';
	import type { Attachment } from 'svelte/attachments';
	import { resolve } from '$app/paths';
	import type { DOCK } from '$lib/categories';
	import Icon from '$lib/components/Icon.svelte';
	import type { PostLink } from '$lib/content/types';
	import { TEXT } from '$lib/styles/text';

	interface Props {
		id: string;
		entry: (typeof DOCK)[number];
		posts: PostLink[];
	}

	let { id, entry, posts }: Props = $props();

	// Take the focus when the sheet opens, without scrolling: it is already in view next to the dock.
	const focusOnOpen: Attachment<HTMLElement> = (sheet) => sheet.focus({ preventScroll: true });
</script>

<div
	{@attach focusOnOpen}
	{id}
	role="dialog"
	aria-label={entry.dockLabel}
	tabindex="-1"
	class="z-10 border border-(--cat-darker) bg-surface-white max-lg:fixed max-lg:inset-x-0 max-lg:bottom-16 lg:absolute lg:inset-x-0 lg:top-full lg:mt-0.5"
>
	<!-- A line between the rows only: the border of the sheet closes the first and the last one. -->
	<ul class="max-h-96 divide-y divide-(--cat-darker) overflow-y-auto">
		{#each posts as post (post.href)}
			<li>
				<a
					href={resolve(post.href)}
					class={['flex min-h-13 items-center gap-3 px-4 py-3 text-(--cat-darker) no-underline', TEXT['body/strong']]}
				>
					<span class="flex-1">{post.title}</span>
					<Icon svg={arrowRight} class="shrink-0" />
				</a>
			</li>
		{:else}
			<li class={['px-4 py-3 text-(--cat-darker)', TEXT['body/body']]}>No posts yet.</li>
		{/each}
	</ul>
</div>
