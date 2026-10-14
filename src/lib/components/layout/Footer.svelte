<!--
	Footer (Figma "Footer"): the colophon and the partner logo tiles. It has no grid of its own
	(display: contents), so its tiles flow in the surrounding TileGrid: after the posts on Home, alone
	on other pages. The URL of the credits page comes from the root layout's load data.
-->
<script lang="ts">
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import Colophon from "$lib/components/content/Colophon.svelte";
  import PartnerLogo from "$lib/components/content/PartnerLogo.svelte";
  import { PARTNERS } from "$lib/config/footer";
</script>

<footer class="contents">
  <Colophon credits={page.data.credits} />
  {#each PARTNERS as partner (partner.partner)}
    <PartnerLogo {partner} />
  {/each}
  <p class="col-span-full text-center text-xs">
    © 2026 Bit Philology, University of Bern. Unless otherwise stated, content
    is licensed under
    <a
      href="https://creativecommons.org/licenses/by-sa/4.0/"
      rel="license noopener"
      target="_blank">CC BY-SA 4.0</a
    >. {#if page.data.credits}
      See <a href={resolve(page.data.credits)}>Credits</a>.{/if}
  </p>
</footer>
