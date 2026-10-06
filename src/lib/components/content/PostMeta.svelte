<!--
	Post meta (Figma "Post" › Post Meta): the bottom row of a post card, the icon of the post type in
	an icon pill on the left and the pills on the right. It sits above the fade of long text and
	lets the pointer through to the link that covers the card. When the pills do not fit, the last one is cut
	with an ellipsis.
-->
<script lang="ts">
	import Pill from '$lib/components/ui/Pill.svelte';

	interface Props {
		/** The icon of the post type. */
		icon: string;
		/** The name of the post type, which the icon stands for. */
		label: string;
		pills: string[];
	}

	let { icon, label, pills }: Props = $props();
</script>

<div class="pointer-events-none relative flex shrink-0 items-center justify-between gap-2">
	<Pill variant="icon" {icon} {label} />
	{#if pills.length}
		<ul class="flex min-w-0 gap-2 overflow-hidden">
			{#each pills as pill, index (index)}
				<li class="shrink-0 last:min-w-0 last:shrink"><Pill label={pill} /></li>
			{/each}
		</ul>
	{/if}
</div>
