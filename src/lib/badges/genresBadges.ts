import Enumerable from "linq";
import type { AnimeBadge } from "./AnimeBadge";
import { badgeIconText } from "./utils";
import ANIME_GENRES from "@/types/generated/animeGenres.generated";

const genresBadges = [
    {
        id: "casual_enjoyer_badge",
        name: "Casual Enjoyer",
        description: "Watched over 10 anime",
        icon: badgeIconText("🍥"),
        canHaveBadge: (animeList) => animeList.length >= 10
    },
    {
        id: "otaku_badge",
        name: "Otaku",
        description: "Watched over 100 anime",
        styles: {
            border: "2px solid #3e0070",
        },
        icon: badgeIconText("🍙"),
        canHaveBadge: (animeList) => animeList.length >= 100
    },
    {
        id: "weeb_badge",
        name: "Weeb",
        description: "Watched over 500 anime",
        styles: {
            border: "2px solid #a80000"
        },
        icon: badgeIconText("🍚"),
        canHaveBadge: (animeList) => animeList.length >= 500
    },
    {
        id: "it_is_funny_badge",
        name: "It is funny",
        description: "Watched 10 or more comedy anime",
        icon: badgeIconText("😂"),
        canHaveBadge: (animeList) => {
            return Enumerable.from(animeList)
                .where(x => x.node.genres.some(genre => genre.id === ANIME_GENRES.Comedy.ID))
                .count() >= 10
        }
    },
] as AnimeBadge[]

export default genresBadges;