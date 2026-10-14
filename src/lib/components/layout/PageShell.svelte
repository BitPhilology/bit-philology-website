<!--
	Page shell (the "Body (grid)" of the About, Events, Artifacts, Publications and Team frames): the
	layout of every post page, in the post's category colours. The meta row, the page index (xl
	only), then the article: the header (a snippet, the type's header) and the body (children), whose
	blocks are rows of the grid with their notes beside them. The footer tiles follow in their own
	grid, set apart from the article by its bottom padding (96 px); on a page shorter than the
	viewport a spacer grows between them, so the footer sits at the bottom. The columns of each breakpoint
	are in src/lib/styles/grid.ts.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { POST_TYPES, categoryOf } from '$lib/categories';
	import CategoryTheme from '$lib/components/content/CategoryTheme.svelte';
	import PostMetaRow from '$lib/components/content/PostMetaRow.svelte';
	import type { PostPage } from '$lib/content/types';
	import { pageIndex } from '$lib/navigation/pageIndex';
	import { GRID } from '$lib/styles/grid';
	import Container from './Container.svelte';
	import Footer from './Footer.svelte';
	import PageIndex from './PageIndex.svelte';
	import TileGrid from './TileGrid.svelte';

	let { page, header, children }: { page: PostPage; header: Snippet; children: Snippet } = $props();

	const category = $derived(categoryOf(page.post.type));
	const pills = $derived(POST_TYPES[page.post.type].page.pills(page.post));
	const index = $derived(pageIndex(page.post, page.body.headings, page.section));
</script>

<CategoryTheme {category}>
	<main class="flex grow flex-col bg-surface-light-background">
		<Container class={[GRID.page, 'pt-8 pb-4 text-(--cat-darker)']}>
			<div class={GRID.meta}><PostMetaRow {category} {pills} /></div>
			<!-- <PageIndex lists={index} class={GRID.index} /> -->
			<article class={[GRID.article, 'pb-24']}>
				<div class={GRID.header}>{@render header()}</div>
				{@render children()}
			</article>
		</Container>
		<!-- Takes the height left in the viewport, if any, so that the footer sits at its bottom. -->
		<div class="grow"></div>
		<Container class="pb-4">
			<TileGrid>
				<Footer />
			</TileGrid>
		</Container>
	</main>
</CategoryTheme>
