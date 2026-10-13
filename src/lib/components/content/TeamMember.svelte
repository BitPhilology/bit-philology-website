<!--
	Team member (Figma "Team Member"): a member's photo, name, role and affiliation on the subtle
	surface, in the member list of the Team page. `size` follows the Figma "Size" property and only
	changes the photo: 120, 96 or 60 px. The photo takes the category colour, as in Figma: the image's
	luminosity over a --cat-darker disc. The name links to the member's page when there is one.
-->
<script lang="ts">
	import externalLink from 'pixelarticons/svg/external-link.svg?raw';
	import Icon from '$lib/components/Icon.svelte';
	import type { Member, MemberSize } from '$lib/content/types';
	import { TEXT } from '$lib/styles/text';

	let { member, size }: { member: Member; size: MemberSize } = $props();

	const PHOTO: Record<MemberSize, { class: string; pixels: number }> = {
		large: { class: 'size-30', pixels: 120 },
		medium: { class: 'size-24', pixels: 96 },
		small: { class: 'size-15', pixels: 60 }
	};
	const photo = $derived(PHOTO[size]);
</script>

<div class="flex items-center gap-3 bg-surface-subtle p-3 text-text-neutral-on-light-bg">
	<span class={['isolate shrink-0 overflow-hidden rounded-full bg-(--cat-darker)', photo.class]}>
		{#if member.photo}
			<img
				src={member.photo}
				alt="Portrait of {member.name}"
				width={photo.pixels}
				height={photo.pixels}
				loading="lazy"
				decoding="async"
				class="size-full object-cover mix-blend-luminosity"
			/>
		{/if}
	</span>
	<div class="flex min-w-0 flex-col gap-1">
		<!-- The icon is inline, so it follows the last word when a long name wraps. -->
		<svelte:element this={member.externalURL ? 'a' : 'p'} href={member.externalURL} class={TEXT['heading/h3']}>
			{member.name}
			{#if member.externalURL}
				<Icon svg={externalLink} label="(external link)" class="ml-1 inline-block align-top" />
			{/if}
		</svelte:element>
		<p class={TEXT['body/body']}>{member.role}</p>
		{#if member.affiliation}<p class={TEXT['pixel/metadata']}>{member.affiliation}</p>{/if}
	</div>
</div>
