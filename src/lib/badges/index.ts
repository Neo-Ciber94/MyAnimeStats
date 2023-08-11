import Enumerable from "linq";
import ANIME_GENRES from "@/types/generated/animeGenres.generated";
import type { AnimeBadge } from "./AnimeBadge";
import { badgeEmoji } from "./utils";

const badges = Object.freeze([
    {
        id: "casual_enjoyer_badge",
        name: "Casual Enjoyer",
        description: "Watched over 10 anime",
        icon: badgeEmoji("🍥"),
        canHaveBadge: (_, animeList) => animeList.length >= 10
    },
    {
        id: "otaku_badge",
        name: "Otaku",
        description: "Watched over 100 anime",
        icon: badgeEmoji("🍙"),
        canHaveBadge: (_, animeList) => animeList.length >= 100
    },
    {
        id: "weeb_badge",
        name: "Weeb",
        description: "Watched over 500 anime",
        icon: badgeEmoji("🍚"),
        canHaveBadge: (_, animeList) => animeList.length >= 500
    },
    {
        id: "lgtb_badge",
        name: "LGBT",
        description: "Watched 10 boys and girls love anime",
        icon: badgeEmoji("🏳️‍🌈"),
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
        id: "protagonist_badge",
        name: "Protagonist",
        description: "Watched over 50 shounen anime",
        icon: badgeEmoji("❤️‍🔥"),
        canHaveBadge(_, animeList) {
            return Enumerable.from(animeList)
                .where(x => x.node.genres.some(genre => genre.id === ANIME_GENRES.Shounen.ID))
                .count() >= 50
        }
    }
] satisfies AnimeBadge[]);

export default badges;

