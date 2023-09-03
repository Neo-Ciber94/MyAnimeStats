import type { AnimeNodeWithStatus } from "$lib/myanimelist/common/types";
import type { calculatedStatsSchema } from "$lib/types";
import type { z } from "zod";
import ANIME_GENRES from "@/types/generated/animeGenres.generated";
import Enumerable from "linq";
import { PERSONAL_STATS } from "@/common/constants";

type PersonalStats = z.infer<typeof calculatedStatsSchema>;

export function calculatePersonalStats(animeList: AnimeNodeWithStatus[]): PersonalStats {
    return {
        strength: calculateStrength(animeList).value,
        charisma: calculateCharisma(animeList).value,
        intelligence: calculateIntelligence(animeList).value,
        vitality: calculateVitality(animeList).value,
    }
}

function calculateStrength(animeList: AnimeNodeWithStatus[]) {
    const max = PERSONAL_STATS.MAX_STRENGTH;

    const STRENGTH_GENRES = [
        ANIME_GENRES.Shounen,
        ANIME_GENRES.Isekai,
        ANIME_GENRES.Reincarnation,
        ANIME_GENRES.Ecchi,
        ANIME_GENRES.Harem,
        ANIME_GENRES.Action,
        ANIME_GENRES.Horror,
        ANIME_GENRES.ReverseHarem,
        ANIME_GENRES.MahouShoujo,
        ANIME_GENRES.SuperPower,
    ];

    const matches = animeList.filter(({ node }) => {
        return node.genres.some(x => STRENGTH_GENRES
            .map(genre => genre.ID as number)
            .includes(x.id))
    });

    const watchedCount = matches.length;
    const averageScore = Enumerable.from(matches).average(x => x.list_status.score);
    const genreAnimeCount = Enumerable.from(STRENGTH_GENRES).sum(x => x.Count);
    const watchPercentage = watchedCount / genreAnimeCount;

    // There are over 9000 anime for strength
    const watchFactor = Math.min(1, watchPercentage + (watchedCount > 100 ? 0.5 : 0));
    const result = (((averageScore / 10) * max) + (watchFactor * max)) / (2 * max);

    const value = Math.floor(result * max);
    return { value, max }
}

function calculateCharisma(animeList: AnimeNodeWithStatus[]) {
    const max = PERSONAL_STATS.MAX_CHARISMA;

    const CHARISMA_GENRES = [
        ANIME_GENRES.Shoujo,
        ANIME_GENRES.Comedy,
        ANIME_GENRES.Romance,
        ANIME_GENRES.Music,
        ANIME_GENRES.Pets,
        ANIME_GENRES.Josei,
        ANIME_GENRES.Showbiz,
    ];

    const matches = animeList.filter(({ node }) => {
        return node.genres.some(x => CHARISMA_GENRES
            .map(genre => genre.ID as number)
            .includes(x.id))
    });

    const watchedCount = matches.length;
    const averageScore = Enumerable.from(matches).average(x => x.list_status.score);
    const genreAnimeCount = Enumerable.from(CHARISMA_GENRES).sum(x => x.Count);
    const watchPercentage = watchedCount / genreAnimeCount;

    // There are over 13,000 anime for charisma
    const watchFactor = Math.min(1, watchPercentage + (watchedCount > 30 ? 0.45 : 0));
    const result = (((averageScore / 10) * max) + (watchFactor * max)) / (2 * max)

    const value = Math.floor(result * max);
    return { value, max }
}

function calculateIntelligence(animeList: AnimeNodeWithStatus[]) {
    const max = PERSONAL_STATS.MAX_INTELLIGENCE;

    const INTELLIGENCE_GENRES = [
        ANIME_GENRES.Seinen,
        ANIME_GENRES.SliceofLife,
        ANIME_GENRES.Drama,
        ANIME_GENRES.AvantGarde,
        ANIME_GENRES.Mystery,
        ANIME_GENRES.SciFi,
        ANIME_GENRES.Suspense,
        ANIME_GENRES.Educational,
        ANIME_GENRES.Psychological,
        ANIME_GENRES.Mythology,
        ANIME_GENRES.Medical,
    ];

    const matches = animeList.filter(({ node }) => {
        return node.genres.some(x => INTELLIGENCE_GENRES
            .map(genre => genre.ID as number)
            .includes(x.id))
    });

    const watchedCount = matches.length;
    const averageScore = Enumerable.from(matches).average(x => x.list_status.score);
    const genreAnimeCount = Enumerable.from(INTELLIGENCE_GENRES).sum(x => x.Count);
    const watchPercentage = watchedCount / genreAnimeCount;

    // There are over 11,000 anime for charisma
    const watchFactor = Math.min(1, watchPercentage + (watchedCount > 60 ? 0.35 : 0));
    const result = (((averageScore / 10) * max) + (watchFactor * max)) / (2 * max);

    const value = Math.floor(result * max);
    return { value, max }
}

function calculateVitality(animeList: AnimeNodeWithStatus[]) {
    const max = PERSONAL_STATS.MAX_VITALITY;

    const VITALITY_GENRES = [
        ANIME_GENRES.Sports,
        ANIME_GENRES.Mecha,
        ANIME_GENRES.Adventure,
        ANIME_GENRES.BoysLove,
        ANIME_GENRES.GirlsLove,
        ANIME_GENRES.IdolsFemale,
        ANIME_GENRES.IdolsMale,
        ANIME_GENRES.TeamSports,
        ANIME_GENRES.CombatSports,
    ];

    const matches = animeList.filter(({ node }) => {
        return node.genres.some(x => VITALITY_GENRES
            .map(genre => genre.ID as number)
            .includes(x.id))
    });

    const watchedCount = matches.length;
    const averageScore = Enumerable.from(matches).average(x => x.list_status.score);
    const genreAnimeCount = Enumerable.from(VITALITY_GENRES).sum(x => x.Count);
    const watchPercentage = watchedCount / genreAnimeCount;

    // If watched over 500 anime add a bonus
    const bonus = animeList.length > 500 ? 50 : 0;

    // There are over 6000 anime for charisma
    const watchFactor = Math.min(1, watchPercentage + (watchedCount > 50 ? 0.42 : 0));
    const result = (((averageScore / 10) * max) + (watchFactor * max)) / (2 * max);
    const value = Math.floor(Math.min(max, ((result * max) + bonus)));

    return { value, max }
}