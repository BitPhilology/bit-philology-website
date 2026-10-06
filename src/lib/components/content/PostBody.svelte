<!--
	Stacked post body (Figma "Post" › Body): the title, which links to the post, over a description
	line. The default body of PostCard; the registry says which description a post type shows and
	whether the body starts at the top (About, Team) or is centred (Event, Artifact).
-->
<script lang="ts">
	import { POST_TYPES } from '$lib/categories';
	import type { Post } from '$lib/content/types';
	import { TEXT } from '$lib/styles/text';
	import CardLink from './CardLink.svelte';

	let { post }: { post: Post } = $props();

	const card = $derived(POST_TYPES[post.type].card);
	const description = $derived(card.description(post));
	const ALIGN = { top: '', center: 'justify-center pt-3' };
	const DESCRIPTION_STYLES = {
		subtitle: TEXT['card/subtitle'],
		authors: TEXT['card/authors'],
		body: TEXT['body/body']
	};
</script>

<div class={['flex min-h-0 flex-1 flex-col gap-3 overflow-hidden text-(--cat-darker)', ALIGN[card.align]]}>
	<h2 class={TEXT['card/title']}><CardLink href={post.href}>{post.title}</CardLink></h2>
	{#if description}
		<p class={DESCRIPTION_STYLES[description.style]}>{description.text}</p>
	{/if}
</div>
