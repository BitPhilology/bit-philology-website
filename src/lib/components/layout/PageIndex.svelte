<!--
	Page index: column 1 of a post page at xl (no Figma frame draws it). Two navigations built by
	pageIndex(): "On this page", the headings of the body, and "In <Category>", every post of the
	same category, the current one in bold with aria-current. Labels are not headings, so the page's
	h1 stays its first heading. `class` places it in the grid.
-->
<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import type { IndexList } from '$lib/navigation/pageIndex';
	import { TEXT } from '$lib/styles/text';

	let { lists, class: className }: { lists: IndexList[]; class?: ClassValue } = $props();

	const id = $props.id();
</script>

<div class={['flex flex-col gap-8', className]}>
	{#each lists as list, index (list.label)}
		<nav aria-labelledby="{id}-{index}" class="flex flex-col gap-2">
			<p id="{id}-{index}" class={TEXT['pixel/metadata']}>{list.label}</p>
			<ul class="flex flex-col gap-2">
				{#each list.links as link (link.href)}
					<li>
						<a
							href={link.href}
							aria-current={link.current ? 'page' : undefined}
							class={['no-underline hover:underline', link.current ? TEXT['body/strong'] : TEXT['body/body']]}
						>
							{link.title}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/each}
</div>
