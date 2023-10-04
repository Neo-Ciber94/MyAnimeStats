import type { AnimeBadge } from './AnimeBadge';
import genresBadges from './common/genresBadges';
import customBadges from './common/customBadges';
import { dev } from '$app/environment';

const badges = Object.freeze([...genresBadges, ...customBadges] as AnimeBadge[]);

// Ensure the badges ids are unique
if (dev) {
	console.log(`🥇 ${badges.length} badges found`);

	const keys = new Set<string>();
	for (const badge of badges) {
		if (keys.has(badge.id)) {
			throw new Error(`Badge with id '${badge.id}' already exists`);
		}

		keys.add(badge.id);
	}
}

export default badges;
