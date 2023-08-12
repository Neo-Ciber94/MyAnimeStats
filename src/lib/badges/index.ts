import type { AnimeBadge } from "./AnimeBadge";
import genresBadges from "./genresBadges";
import defaultBadges from "./baseBadges";

const badges = Object.freeze([
    ...defaultBadges,
    ...genresBadges
] as AnimeBadge[]);

export default badges;

