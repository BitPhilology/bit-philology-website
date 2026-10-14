<script lang="ts">
	import '../app.css';
	// Mona Sans: weight axis only. If the width axis is ever needed, switch to standard.css and standard-italic.css.
	import '@fontsource-variable/mona-sans/wght.css';
	import '@fontsource-variable/mona-sans/wght-italic.css';
	// Bitcount Prop Single: all axes, custom ones included.
	import '@fontsource-variable/bitcount-prop-single/full.css';
	// JetBrains Mono: weight axis only.
	import '@fontsource-variable/jetbrains-mono/wght.css';
	import { asset } from '$app/paths';
	import CategoryTheme from '$lib/components/content/CategoryTheme.svelte';
	import NavDock from '$lib/components/layout/NavDock.svelte';
	import TopStroke from '$lib/components/layout/TopStroke.svelte';
	import { activeCategory } from '$lib/navigation/activeCategory';

	let { data, children } = $props();

	const category = $derived(activeCategory());
</script>

<!-- The icons of the site and its web app manifest are files of static/, so they go through asset(). -->
<svelte:head>
	<link rel="icon" type="image/png" href={asset('/favicon-96x96.png')} sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href={asset('/favicon.svg')} />
	<link rel="shortcut icon" href={asset('/favicon.ico')} />
	<link rel="apple-touch-icon" sizes="180x180" href={asset('/apple-touch-icon.png')} />
	<meta name="apple-mobile-web-app-title" content="Bit Philology" />
	<link rel="manifest" href={asset('/site.webmanifest')} />
</svelte:head>

<!-- The page theme: the active category colours the top stroke, the dock and the focus rings. -->
<CategoryTheme {category}>
	<TopStroke />
	<!-- Before the page in the markup, so the keyboard and screen readers reach the navigation first. -->
	<NavDock sheets={data.sheets} active={category} />
	<!-- The padding keeps the page clear of the fixed dock: its end below lg, its start from lg. The
	     wrapper is at least as tall as the viewport, padding included, so a short page can grow into it
	     and keep its footer at the bottom (PageShell). -->
	<div class="flex min-h-dvh flex-col max-lg:pb-16 lg:pt-16">
		{@render children()}
	</div>
</CategoryTheme>
