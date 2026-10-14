<!--
	Publication header (Figma "Page Header" of the Publications frames): the title in heading/h1 at
	every breakpoint, the authors (card/authors), the venue and date (body/body), then the DOI in
	the code style and a Download pill, at the two ends of one line. Missing fields leave their line
	out; the DOI line appears when there is a DOI or a download link.
-->
<script lang="ts">
	import Pill from '$lib/components/ui/Pill.svelte';
	import { doiUrl, publicationVenue } from '$lib/content/details';
	import type { Post } from '$lib/content/types';
	import { TEXT } from '$lib/styles/text';

	let { post }: { post: Post } = $props();

	const venue = $derived(publicationVenue(post));
	const doi = $derived(post.doi && doiUrl(post.doi));
</script>

<header class="flex flex-col gap-3">
	<h1 class={TEXT['heading/h1']}>{post.title}</h1>
	{#if post.authors}<p class={TEXT['card/authors']}>{post.authors}</p>{/if}
	{#if venue}<p class={TEXT['body/body']}>{venue}</p>{/if}
	{#if doi || post.downloadLink}
		<div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
			{#if doi}
				<!-- A DOI URL is longer than a phone is wide: it may break anywhere. -->
				<p class={['min-w-0 wrap-anywhere', TEXT['code/code']]}>
					DOI: <a href={doi}>{doi}</a>
				</p>
			{/if}
			{#if post.downloadLink}<Pill label="Download" href={post.downloadLink} />{/if}
		</div>
	{/if}
</header>
