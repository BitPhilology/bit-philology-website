// Turns a Home image filler file into its data, and fails the build when the file is invalid.
import { text } from './fields';
import type { FillerAccent, ImageFillerContent } from './types';

const ACCENTS: FillerAccent[] = ['about', 'event', 'publication', 'artifact'];

/**
 * A filler from its file and front matter. `resolveImage` turns the path of the `image` field
 * (./assets/…, a file of the filler's folder) into a URL.
 */
export function toFiller(
	file: string,
	data: Record<string, unknown>,
	resolveImage: (src: string) => string
): ImageFillerContent {
	const problems: string[] = [];
	const accent = data.accent as FillerAccent;
	if (!ACCENTS.includes(accent)) {
		problems.push(`accent must be one of ${ACCENTS.join(', ')} (found ${JSON.stringify(data.accent)})`);
	}
	const position = data.position;
	if (typeof position !== 'number' || !Number.isInteger(position)) {
		problems.push(`position must be a whole number (found ${JSON.stringify(position)})`);
	}
	const src = text(data.image);
	if (!src) problems.push('the front matter has no "image"');
	const alt = text(data.alt);
	if (!alt) problems.push('the image has no alt text');

	if (problems.length || !src || !alt) {
		throw new Error(`Invalid Home image filler ${file}: ${problems.join('; ')}.`);
	}
	return { file, accent, position: position as number, image: { src: resolveImage(src), alt } };
}
