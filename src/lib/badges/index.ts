import Enumerable from "linq";
import type { AnimeNodeWithStatus } from "../myanimelist/common/types";
import type { User } from "../myanimelist/common/user";
import ANIME_GENRES from "@/types/generated/animeGenres.generated";

/**
 * Represents a badge to give to an user.
 */
export interface AnimeBadge {
    /**
     * Name of the badge.
     */
    name: string;

    /**
     * A description to show for the badge.
     */
    description: string;

    /**
     * The foreground color for the badge.
     */
    fgColor: string;

    /**
     * The background color for the badge.
     */
    bgColor: string;

    /**
     * Check if the badge can be shown if the condition is meet.
     * @param user The user.
     * @param animeList The user anime list. 
     * @returns `true` if can show the badge for the user.
     */
    canHaveBadge: (user: User, animeList: AnimeNodeWithStatus[]) => boolean;
}

const badges = Object.freeze([
    {
        name: "🍥 Casual Enjoyer",
        description: "Watched over 10 anime",
        bgColor: "rgba(0, 0, 0, 0.5)",
        fgColor: "rgba(255, 255, 255, 1)",
        canHaveBadge(_, animeList) {
            return animeList.length >= 10;
        }
    },
    {
        name: "🍙 Otaku",
        description: "Watched over 100 anime",
        bgColor: "rgba(0, 0, 0, 0.5)",
        fgColor: "rgba(255, 255, 255, 1)",
        canHaveBadge(_, animeList) {
            return animeList.length >= 100;
        }
    },
    {
        name: "🍚 Weeb",
        description: "Watched over 500 anime",
        bgColor: "rgba(0, 0, 0, 0.5)",
        fgColor: "rgba(255, 255, 255, 1)",
        canHaveBadge(_, animeList) {
            return animeList.length >= 500;
        }
    },
    {
        name: "🏳️‍🌈 LGBT",
        description: "Watched 10 boys and girls love anime",
        bgColor: "rgba(0, 0, 0, 0.5)",
        fgColor: "rgba(255, 255, 255, 1)",
        canHaveBadge(_, animeList) {
            const boysLoveCount = Enumerable.from(animeList)
                .where(x => x.node.genres.some(genre => genre.id === ANIME_GENRES.BoysLove.ID))
                .count();

            const girlLoveCount = Enumerable.from(animeList)
                .where(x => x.node.genres.some(genre => genre.id === ANIME_GENRES.GirlsLove.ID))
                .count();

            return boysLoveCount >= 10 && girlLoveCount >= 10;
        }
    },
    {
        name: "❤️‍🔥 Protagonist",
        description: "Watched over 50 shounen anime",
        bgColor: "rgba(255, 0, 0, 0.5)",
        fgColor: "rgba(255, 255, 255, 1)",
        canHaveBadge(_, animeList) {
            return Enumerable.from(animeList)
                .where(x => x.node.genres.some(genre => genre.id === ANIME_GENRES.Shounen.ID))
                .count() >= 50
        }
    }
] satisfies AnimeBadge[]);

export default badges;