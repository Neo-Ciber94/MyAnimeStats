import Enumerable from "linq";
import ANIME_GENRES from "@/types/generated/animeGenres.generated";
import type { AnimeBadge } from "./AnimeBadge";
import { badgeEmoji as badgeIconText } from "./utils";
import jotaroSvg from "./svg/jotaro.svg";
import narutoSvg from "./svg/naruto.svg";

const badges = Object.freeze([
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
            border: "2px solid #0c001f"
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
        id: "lgtb_badge",
        name: "LGBT",
        description: "Watched 10 boys love and girls love anime",
        icon: badgeIconText("🏳️‍🌈"),
        styles: {
            border: "2px solid transparent",
            borderImageSlice: 1,
            borderImage: "linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%)",
        },
        canHaveBadge(animeList) {
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
        styles: {
            border: "2px solid #00a2ff",
            background: "linear-gradient(231deg, rgba(0,1,70,1) 34%, rgba(0,0,0,1) 100%)",
            color: "white"
        },
        icon: narutoSvg,
        canHaveBadge(animeList) {
            return Enumerable.from(animeList)
                .where(x => x.node.genres.some(genre => genre.id === ANIME_GENRES.Shounen.ID))
                .count() >= 50
        }
    },
    {
        id: "jojo_fan_badge",
        name: "Yare Yare Daze",
        description: "Watched over 5 parts JoJo's Bizarre Adventure",
        styles: {
            border: "2px solid #696969"
        },
        icon: size => jotaroSvg(size + 8),
        canHaveBadge() {
            return true;
        }
    }
] as AnimeBadge[]);

export default badges;

