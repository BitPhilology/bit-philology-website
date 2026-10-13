// The fixed content of the footer tiles (Figma "Footer": Colophon and Partner Logo).
import digitalHumanities from '$lib/assets/partners/digital-humanities.png';
import snsf from '$lib/assets/partners/snsf.png';
import wbKolleg from '$lib/assets/partners/wb-kolleg.png';

export const COLOPHON =
	'Bit Philology is a SNSF Starting Grant project running from 2025 to 2030. It is conducted at the Digital Humanities Center, part of the Walter Benjamin Kolleg at the University of Bern.';

/**
 * The credits page, src/content/about/credits/index.md (the About page titled "Credits"): the
 * Colophon links to it when it exists.
 */
export const CREDITS_PATH = 'about/credits';

/** Figma "Partner Logo": the `partner` variant names, with the logo widths of the Figma frames. */
export const PARTNERS = [
	{
		partner: 'Digital Humanities',
		name: 'Digital Humanities, University of Bern',
		href: 'https://www.dh.unibe.ch/',
		logo: digitalHumanities,
		width: 'w-40'
	},
	{
		partner: 'WB Kolleg',
		name: 'Walter Benjamin Kolleg, University of Bern',
		href: 'https://www.wbkolleg.unibe.ch/',
		logo: wbKolleg,
		width: 'w-30'
	},
	{
		partner: 'SNSF',
		name: 'Swiss National Science Foundation',
		href: 'https://www.snf.ch/',
		logo: snsf,
		width: 'w-60'
	}
] as const;

export type Partner = (typeof PARTNERS)[number];
