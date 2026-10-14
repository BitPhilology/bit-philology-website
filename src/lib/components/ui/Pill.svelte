<!--
	Pill (Figma "Pill"): a small outlined label in the current category colour, used in the meta row
	of posts. `variant` mirrors the Figma "Type" property; every variant is 26 px high. The icon pill
	of a post card shows the icon of the post type. With `href` a pill is a link, such as the
	Download button of a publication. A label wider than its row (a long venue on a phone) is cut
	with an ellipsis.
-->
<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { TEXT } from '$lib/styles/text';

	type Variant = 'text' | 'icon-text' | 'icon';

	interface Props {
		variant?: Variant;
		/** The text; for the icon variant, the accessible name. */
		label: string;
		icon?: string;
		href?: string;
	}

	let { variant = 'text', label, icon, href }: Props = $props();

	const VARIANTS: Record<Variant, string> = {
		text: 'h-6.5 px-2',
		'icon-text': 'gap-1 px-2 py-1',
		icon: ''
	};
	// An icon pill has no text: its name goes on the link or, without a link, on the icon.
	const iconOnly = $derived(variant === 'icon');
</script>

<svelte:element
	this={href ? 'a' : 'span'}
	{href}
	aria-label={iconOnly && href ? label : undefined}
	class={[
		'inline-flex max-w-full shrink-0 items-center justify-center border border-(--cat-darker) bg-surface-white whitespace-nowrap text-(--cat-darker) no-underline',
		TEXT['pixel/metadata'],
		VARIANTS[variant]
	]}
>
	{#if icon && variant !== 'text'}<Icon svg={icon} label={iconOnly && !href ? label : undefined} />{/if}
	{#if !iconOnly}<span class="min-w-0 truncate">{label}</span>{/if}
</svelte:element>
