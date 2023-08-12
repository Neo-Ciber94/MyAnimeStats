import type { AnimeBadge } from "./AnimeBadge";
import genresBadges from "./common/genresBadges";
import customBadges from "./common/customBadges";

const badges = Object.freeze([
    ...genresBadges,
    ...customBadges,
] as AnimeBadge[]);

export default badges;

