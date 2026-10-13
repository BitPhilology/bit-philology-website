// The member list of the Team page: the front matter parser.
import { isRecord, text } from './fields';
import { siteUrl } from './links';
import type { Member, MemberSize } from './types';

// The sizes that the `size` field of a member can take, and the one of a member without it.
const SIZES: MemberSize[] = ['large', 'medium', 'small'];
const DEFAULT_SIZE: MemberSize = 'medium';

interface Context {
	file: string;
	field: string;
	/** Turns the photo path of the front matter (./assets/…) into its built URL. */
	resolveAsset: (src: string) => string;
}

/**
 * A member list from its front matter field. Fails the build when an entry lacks a name or a role,
 * or has a size that is not one of SIZES.
 */
export function toMembers(value: unknown, { file, field, resolveAsset }: Context): Member[] {
	if (!Array.isArray(value)) throw new Error(`${file}: "${field}" must be a list of members.`);
	const problems: string[] = [];
	const members = value.map((entry, index): Member => {
		const data = isRecord(entry) ? entry : {};
		const name = text(data.name);
		const role = text(data.role);
		const which = `entry ${index + 1}${name ? ` (${name})` : ''}`;
		if (!name) problems.push(`${which} has no name`);
		if (!role) problems.push(`${which} has no role`);
		const size = (text(data.size) ?? DEFAULT_SIZE) as MemberSize;
		if (!SIZES.includes(size)) {
			problems.push(`${which} has the size ${JSON.stringify(data.size)}, which is not one of ${SIZES.join(', ')}`);
		}
		const photo = text(data.photo);
		const externalURL = text(data['external-url']);
		return {
			name: name ?? '',
			role: role ?? '',
			affiliation: text(data.affiliation),
			photo: photo && resolveAsset(photo),
			size,
			externalURL: externalURL && siteUrl(externalURL)
		};
	});
	if (problems.length) throw new Error(`Invalid "${field}" in ${file}: ${problems.join('; ')}.`);
	return members;
}
