import type { AnimeBadge } from "./AnimeBadge";
import genresBadges from "./genresBadges";
import customBadges from "./customBadges";

const badges = Object.freeze([
    ...genresBadges,
    ...customBadges,
] as AnimeBadge[]);

export default badges;

