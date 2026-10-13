# To do: the open issues of the repository

- **Status:** to do, not started
- **Added:** 2026-10-14

The seven issues open on [GitHub](https://github.com/BitPhilology/bit-philology-website/issues), all written by Elena Spadini on 6 and 7 October 2026, each with what the repository looks like today. Close the issue on GitHub when its point is done.

1. **[#1](https://github.com/BitPhilology/bit-philology-website/issues/1) Order of the About menu.** Wanted: About, Team, Credits. Today the list follows the dates, newest first (`getSheets` in `src/lib/server/content.ts`): Credits, Stay in touch, Zenodo Community, About Bit Philology, Team. To decide: where the two newer pages go.
2. **[#2](https://github.com/BitPhilology/bit-philology-website/issues/2) Footer.** Set the four footer tiles apart from the content of a page, for example on a publication (`PageShell.svelte`). To decide: how.
3. **[#3](https://github.com/BitPhilology/bit-philology-website/issues/3) "Events" or "Our events"?** A question about the label of the navigation (`dockLabel` in `src/lib/categories.ts`). To decide.
4. **[#4](https://github.com/BitPhilology/bit-philology-website/issues/4) "Paper", not "oral communication".** Probably done: the template is gone, the hint of "Type of publication" in the CMS says "Poster, Paper, Article", and the pages use "Paper". The words are still on the old page `src/routes/outputs/+page.svelte`.
5. **[#6](https://github.com/BitPhilology/bit-philology-website/issues/6) Authors with initials.** "E. Spadini", not "Elena Spadini". One publication still has full names, "Archivi letterari nativi digitali…": edit it in the CMS.
6. **[#8](https://github.com/BitPhilology/bit-philology-website/issues/8) Team photos of the same size.** Today the photo of the Principal Investigator is larger, 120 px against 96 px, as in Figma (`SIZE_BY_ROLE` in `src/lib/content/team.ts`).
7. **[#9](https://github.com/BitPhilology/bit-philology-website/issues/9) Favicon.** `src/lib/assets/favicon.svg` is still the Svelte logo.

Points 2 and 6 change the design: Figma is its source of truth, so they are decided there first.
