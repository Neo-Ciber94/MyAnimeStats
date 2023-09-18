import type { AnimeObjectWithStatus } from "../myanimelist/common/types";

/**
 * Max allowed level.
 */
export const MAX_LEVEL = 100;

/**
 * Calculate the level using the user total episodes watched.
 * @param animeList All the anime watched.
 */
export function calculateLevel(animeList: AnimeObjectWithStatus[]) {
    const episodesWatched = animeList.reduce((count, anime) => count + anime.list_status.num_episodes_watched, 0);
    const level = levelForEpisodesWatched(episodesWatched);
    const episodesRequiredForNextLevel = level >= MAX_LEVEL ? 0 : episodesWatchedForLevel(level + 1);
    const episodesUntilNextLevel = level >= MAX_LEVEL ? 0 : episodesRequiredForNextLevel - episodesWatched;

    return {
        level,
        episodesWatched,
        episodesRequiredForNextLevel,
        episodesUntilNextLevel
    }
}

const LEVEL_FACTOR = 10;

// episodes = (factor * level ^ 2) / 4
function episodesWatchedForLevel(level: number): number {
    const episodes = (LEVEL_FACTOR * Math.pow(level, 2)) / 4
    return Math.max(1, Math.floor(episodes));
}

// level = sqrt(4 * episodes / factor);
function levelForEpisodesWatched(episodes: number): number {
    const approximatedLevel = Math.sqrt((4 * episodes) / LEVEL_FACTOR);
    return Math.max(1, Math.floor(approximatedLevel))
}