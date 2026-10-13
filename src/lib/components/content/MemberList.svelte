<!--
	Member list (Figma "Members" in the Team frames): a column of Team Member cards, one per entry of a
	front matter list. The size of each card is the member's own (the `size` field). Placed in the
	body by the {{team}} marker (src/lib/embeds.ts).
-->
<script lang="ts">
	import type { Member } from '$lib/content/types';
	import TeamMember from './TeamMember.svelte';

	let { data }: { data: Member[] } = $props();
</script>

<ul class="flex flex-col gap-4">
	{#each data as member, index (index)}
		<li><TeamMember {member} size={member.size} /></li>
	{/each}
</ul>
