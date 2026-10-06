<!--
	Colophon (Figma "Colophon"): the project statement, the first tile of the footer, with the link
	to the credits page in its bottom right corner. `credits` is the path of that page inside the
	site; without it (the page does not exist yet) the link is left out.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import Tile from '$lib/components/ui/Tile.svelte';
	import { COLOPHON } from '$lib/config/footer';
	import { TEXT } from '$lib/styles/text';

	let { credits }: { credits?: Pathname } = $props();
</script>

<Tile
	surface="tinted"
	class={['flex items-center justify-center px-12 text-center text-category-artifact-darker']}
>
	<p>{COLOPHON}</p>
	{#if credits}<a href={resolve(credits)} class="absolute right-5 bottom-5 hover:underline">Credits</a>{/if}
</Tile>
