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
    {
        id: "background_explosion_badge",
        name: "* Background Explosion *",
        description: "Watched 10 or more action-packed anime",
        icon: badgeIconText("💥"),
        canHaveBadge: (animeList) => {
            return Enumerable.from(animeList)
                .where(x => x.node.genres.some(genre => genre.id === ANIME_GENRES.Action.ID))
                .count() >= 10
        }
    },
    {
        id: "where_is_the_guild_badge",
        name: "Where is the guild?",
        description: "Watched 10 or more Adventure anime",
        icon: badgeIconText("🗺️"),
        canHaveBadge: (animeList) => {
            return Enumerable.from(animeList)
                .where(x => x.node.genres.some(genre => genre.id === ANIME_GENRES.Adventure.ID))
                .count() >= 10
        }
    },
    {
        id: "am_i_in_love_badge",
        name: "Am I in love?",
        description: "Watched 10 or more Romance anime",
        icon: badgeIconText("❤️"),
        canHaveBadge: (animeList) => {
            return Enumerable.from(animeList)
                .where(x => x.node.genres.some(genre => genre.id === ANIME_GENRES.Romance.ID))
                .count() >= 10
        }
    },
    {
        id: "twelve_episodes_to_kiss_badge",
        name: "12 episodes to kiss",
        description: "Watched 50 or more Romance anime",
        styles: {
            border: "2px solid magenta"
        },
        icon: badgeIconText("💋"),
        canHaveBadge: (animeList) => {
            return Enumerable.from(animeList)
                .where(x => x.node.genres.some(genre => genre.id === ANIME_GENRES.Romance.ID))
                .count() >= 50
        }
    },
    {
        id: "lets_enter_the_dungeon_badge",
        name: "Let's enter the Dungeon",
        description: "Watched 10 or more Fantasy anime",
        icon: badgeIconText("🗡️"),
        canHaveBadge: (animeList) => {
            return Enumerable.from(animeList)
                .where(x => x.node.genres.some(genre => genre.id === ANIME_GENRES.Fantasy.ID))
                .count() >= 10
        }
    },
    {
        id: "truck_kun_badge",
        name: "Truck-kun?",
        description: "Watched 10 or more Isekai or Reincarnation anime anime",
        icon: badgeIconText("🚛"),
        canHaveBadge: (animeList) => {
            return Enumerable.from(animeList)
                .where(x => x.node.genres.some(genre => {
                    return genre.id === ANIME_GENRES.Isekai.ID || genre.id === ANIME_GENRES.Reincarnation.ID
                }))
                .count() >= 10
        }
    },
    {
        id: "good_taste_badge",
        name: "Good Taste",
        description: "Watched 20 or more award winning anime",
        icon: badgeIconText("🪙"),
        styles: {
            border: "2px solid #d69200",
            background: "linear-gradient(205deg, rgba(173,90,0,1) 45%, rgba(255,231,0,1) 100%)",
            color: "black",
        },
        canHaveBadge: (animeList) => {
            return Enumerable.from(animeList)
                .where(x => x.node.genres.some(genre => genre.id === ANIME_GENRES.AwardWinning.ID))
                .count() >= 20
        }
    },
] as AnimeBadge[]

export default genresBadges;