import Enumerable from "linq";
import ANIME_GENRES from "@/types/generated/animeGenres.generated";
import type { AnimeBadge } from "../AnimeBadge";
import { badgeIconText, hadWatchedAnime } from "../utils";
import jotaroSvg from "../icons/jotaro";
import narutoSvg from "../icons/naruto";
import vinlandSagaThorfinn from "../icons/vinlandSagaThorfinn";
import onePieceWhitebeardFlag from "../icons/onePieceWhitebeardFlag";
import fujoshi from "../icons/fujoshi";
import lesbianIcon from "../icons/lesbianIcon";
import onePieceFlag from "../icons/onePieceFlag";

const customBadges = [
    {
        id: "lgtb_badge",
        name: "LGBT",
        description: "Watched 10 boys love and 10 girls love anime",
        icon: badgeIconText("🏳️‍🌈"),
        styles: {
            px: 10,
            border: "2px solid transparent",
            borderImageSlice: 1,
            borderImage: "linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%)",
        },
        canHaveBadge(animeList) {
            const boysLoveCount = Enumerable.from(animeList)
                .where(x => hadWatchedAnime(x))
                .where(x => x.node.genres.some(genre => genre.id === ANIME_GENRES.BoysLove.ID))
                .count();

            const girlLoveCount = Enumerable.from(animeList)
                .where(x => hadWatchedAnime(x))
                .where(x => x.node.genres.some(genre => genre.id === ANIME_GENRES.GirlsLove.ID))
                .count();

            return boysLoveCount >= 10 && girlLoveCount >= 10;
        }
    },
    {
        id: "protagonist_badge",
        name: "Protagonist",
        description: "Watched over 100 Shounen anime",
        styles: {
            border: "2px solid #00a2ff",
            background: "linear-gradient(231deg, rgba(0,1,70,1) 34%, rgba(0,0,0,1) 100%)",
            color: "white"
        },
        icon: narutoSvg,
        canHaveBadge(animeList) {
            return Enumerable.from(animeList)
                .where(x => hadWatchedAnime(x))
                .where(x => x.node.genres.some(genre => genre.id === ANIME_GENRES.Shounen.ID))
                .count() >= 100
        }
    },
    {
        id: "fujoshi_badge",
        name: "Fujoshi",
        description: "Watched 20 or more Boys Love anime",
        icon: fujoshi,
        styles: {
            px: 10,
            background: "linear-gradient(90deg, rgba(0,0,0,1) 45%, rgba(255,255,255,1) 45%)",
            border: "2px solid white",
            color: "black"
        },
        canHaveBadge(animeList) {
            return Enumerable.from(animeList)
                .where(x => hadWatchedAnime(x))
                .where(x => x.node.genres.some(genre => genre.id === ANIME_GENRES.BoysLove.ID))
                .count() >= 20
        }
    },
    {
        id: "does_she_love_her_badge",
        name: "Does she love her?",
        description: "Watched 20 or more Girls Love anime",
        icon: lesbianIcon,
        styles: {
            border: "2px solid #ff8ce4",
            background: "#f4dcfc",
            color: "black",
        },
        canHaveBadge(animeList) {
            return Enumerable.from(animeList)
                .where(x => hadWatchedAnime(x))
                .where(x => x.node.genres.some(genre => genre.id === ANIME_GENRES.GirlsLove.ID))
                .count() >= 20
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
        canHaveBadge(animeList) {
            const jojoBizarreAdventureIds = [
                14719, // JoJo no Kimyou na Bouken (TV)
                20899, // JoJo no Kimyou na Bouken Part 3: Stardust Crusaders
                26055, // JoJo no Kimyou na Bouken Part 3: Stardust Crusaders 2nd Season
                31933, // JoJo no Kimyou na Bouken Part 4: Diamond wa Kudakenai
                37991, // JoJo no Kimyou na Bouken Part 5: Ougon no Kaze
                48661, // JoJo no Kimyou na Bouken Part 6: Stone Ocean
                51367, // JoJo no Kimyou na Bouken Part 6: Stone Ocean Part 2
            ] as const;

            return jojoBizarreAdventureIds
                .every(animeId => {
                    return animeList.some(({ node, list_status }) => node.id === animeId && list_status.status === 'completed');
                })
        }
    },
    {
        id: "genre_master_badge",
        name: "Genre Master",
        description: "Watched anime from 50 different genres",
        icon: badgeIconText("アニメ"),
        styles: {
            border: "2px solid transparent",
            borderImage: "linear-gradient(231deg, rgba(0,0,0,1) 34%, rgba(255,255,255,1) 100%)",
            borderImageSlice: 1,
        },
        canHaveBadge: (animeList) => {
            const uniqueGenres = new Set();
            animeList.forEach(anime => {
                anime.node.genres.forEach(genre => uniqueGenres.add(genre.name));
            });
            return uniqueGenres.size >= 50;
        }
    },
    {
        id: "vinland_saga_badge",
        name: "You had no enemies",
        description: "Completed Vinland Saga season 1 and 2",
        icon: size => vinlandSagaThorfinn(size + 5),
        styles: {
            border: "2px solid orange",
            background: "linear-gradient(125deg, rgba(73,13,0,1) 34%, rgba(226,56,0,1) 100%)"
        },
        canHaveBadge(animeList) {
            const vinlandSagaIds = [
                37521, // Vinland Saga
                49387, // Vinland Saga Season 2
            ] as const;

            return vinlandSagaIds.every(animeId => {
                return animeList.some(({ node, list_status }) => node.id === animeId && list_status.status === 'completed');
            })
        }
    },
    {
        id: "one_piece_is_real_badge",
        name: "The One Piece is Real!",
        description: "Watched over 485 or more episodes of One Piece",
        styles: {
            background: "linear-gradient(205deg, rgba(108,0,0,1) 47%, rgba(255,255,255,1) 100%)",
            border: "2px solid white"
        },
        icon: onePieceWhitebeardFlag,
        canHaveBadge(animeList) {
            const onePiceAnimeId = 21; // https://myanimelist.net/anime/21/One_Piece
            const onePieceAnime = animeList.find(anime => anime.node.id === onePiceAnimeId);

            if (!onePieceAnime) {
                return false;
            }

            return onePieceAnime.list_status.num_episodes_watched >= 485;
        }
    },
    {
        id: "pirate_king_badge",
        name: "The Pirate King",
        description: "Watched over 1000 or more episodes of One Piece",
        styles: {
            background: "#910007",
            border: "2px solid #fffea6"
        },
        icon: onePieceFlag,
        canHaveBadge(animeList) {
            const onePiceAnimeId = 21; // https://myanimelist.net/anime/21/One_Piece
            const onePieceAnime = animeList.find(anime => anime.node.id === onePiceAnimeId);

            if (!onePieceAnime) {
                return false;
            }

            return onePieceAnime.list_status.num_episodes_watched >= 1000;
        }
    },
    {
        id: "watashi_wa_desu_badge",
        name: (user) => /*html*/`<span>Watashi wa <b class="text-violet-500">${user.name}</b> desu</span>`,
        description: "Watched over 6000 episodes of anime",
        icon: badgeIconText("私は", "text-amber-400"),
        styles: {
            background: "radial-gradient(circle, rgba(15,0,19,1) 45%, rgba(66,0,92,1) 100%)",
            border: "2px solid #7b42f5"
        },
        canHaveBadge(animeList) {
            return Enumerable.from(animeList)
                .select(({ list_status }) => list_status.num_episodes_watched)
                .sum() > 6000
        }
    },
] as AnimeBadge[]

export default customBadges;

