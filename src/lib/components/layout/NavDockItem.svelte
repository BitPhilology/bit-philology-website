<!--
	Navigation dock item (Figma "Navigation Dock" › Cell): one entry of the dock, in its own category
	colours. Entries with a sheet are buttons that open and close their PageSheet; Home is a link. The active
	item gets the tinted background and the dithered cap, in the darker colour like the icons;
	another item gets the tint alone, without the dither, under the pointer or the keyboard focus.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import type { DOCK } from '$lib/categories';
	import IconLabel from '$lib/components/ui/IconLabel.svelte';
	import Dither from '$lib/components/ui/Dither.svelte';
	import CategoryTheme from '$lib/components/content/CategoryTheme.svelte';
	import type { PostLink } from '$lib/content/types';
	import { TEXT } from '$lib/styles/text';
	import PageSheet from './PageSheet.svelte';

	interface Props {
		entry: (typeof DOCK)[number];
		active: boolean;
		open: boolean;
		posts: PostLink[];
		ontoggle: (button: HTMLElement) => void;
	}

	let { entry, active, open, posts, ontoggle }: Props = $props();

	const sheetId = $props.id();
	// Phone and wide cells are 54 px below the cap (the dock is 64 px), compact ones 38 px (48 px).
	const CELL =
		'flex h-13.5 w-full flex-col items-center justify-center gap-0.5 lg:flex-row lg:gap-2.5 max-lg:group-data-compact/dock:h-9.5 motion-safe:transition-all motion-safe:duration-200';
	// The tint of an item under the pointer or the keyboard focus. Tailwind's hover variant only
	// applies on devices that can hover, so a tap leaves no tint behind.
	const TINT =
		'hover:bg-(--cat-lighter) has-focus-visible:bg-(--cat-lighter) motion-safe:transition-colors motion-safe:duration-150';
</script>

{#snippet content()}
	<IconLabel
		icon={entry.icon}
		label={entry.dockLabel}
		class="contents"
		iconClass="text-(--cat-darker)"
		labelClass={[
			TEXT['pixel/metadata'],
			'text-(--cat-darker) lg:text-sm max-lg:group-data-compact/dock:sr-only',
			active && 'font-bold'
		]}
	/>
{/snippet}

<li class="relative min-w-0 flex-1">
	<CategoryTheme category={entry.category}>
		<div class={[active ? 'bg-(--cat-lighter)' : TINT]}>
			{#if active}<Dither class="bg-(--cat-darker)" />{:else}<span aria-hidden="true" class="block h-2"></span>{/if}
			{#if entry.sheet}
				<button
					type="button"
					class={CELL}
					aria-current={active ? 'page' : undefined}
					aria-haspopup="dialog"
					aria-expanded={open}
					aria-controls={sheetId}
					onclick={(event) => ontoggle(event.currentTarget)}
				>
					{@render content()}
				</button>
			{:else}
				<a href={resolve(entry.route)} class={[CELL, 'no-underline']} aria-current={active ? 'page' : undefined}>
					{@render content()}
				</a>
			{/if}
		</div>
		{#if open}
			<PageSheet id={sheetId} {entry} {posts} />
		{/if}
	</CategoryTheme>
</li>
