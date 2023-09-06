/* eslint-disable @typescript-eslint/no-namespace */

import ANIME_GENRES from "@/types/generated/animeGenres.generated";
import type { AiringStatus, AnimeObject, AnimeRelationType, MediaType, RankingType, Rating, SourceType, WatchStatus } from "./types";

export namespace AnimeHelper {
    export function mediaTypeToString(mediaType: MediaType) {
        switch (mediaType) {
            case 'unknown':
                return 'Unknown';
            case 'tv':
                return 'TV';
            case 'ova':
                return 'OVA';
            case 'movie':
                return 'Movie';
            case 'special':
                return 'Special';
            case 'ona':
                return 'ONA';
            case 'music':
                return 'Music';
            default:
                return null;
        }
    }

    export function ratingToString(rating: Rating) {
        switch (rating) {
            case 'g':
                return 'G - All Ages';
            case 'pg':
                return 'PG - Children';
            case 'pg_13':
                return 'PG-13 - Teens 13 and Older';
            case 'r':
                return 'R - 17+ (violence & profanity)';
            case 'r+':
                return 'R+ - Profanity & Mild Nudity';
            case 'rx':
                return 'Rx - Hentai';
            default:
                return null;
        }
    }

    export function airingStatusToString(airingStatus: AiringStatus): string | null {
        switch (airingStatus) {
            case 'finished_airing':
                return 'Finished Airing';
            case 'currently_airing':
                return 'Currently Airing';
            case 'not_yet_aired':
                return 'Not Airing';
            default:
                return null;
        }
    }

    export function watchStatusToString(watchStatus: WatchStatus): string | null {
        switch (watchStatus) {
            case 'watching':
                return 'Watching';
            case 'completed':
                return 'Completed';
            case 'on_hold':
                return 'On Hold';
            case 'dropped':
                return 'Dropped';
            case 'plan_to_watch':
                return 'Plan to Watch';
            default:
                return null;
        }
    }

    export function rankingTypeToString(rankingType: RankingType): string | null {
        switch (rankingType) {
            case 'all':
                return 'All';
            case 'airing':
                return 'Airing';
            case 'upcoming':
                return 'Upcoming';
            case 'tv':
                return 'TV';
            case 'ova':
                return 'OVA';
            case 'movie':
                return 'Movie';
            case 'special':
                return 'Special';
            case 'bypopularity':
                return 'By Popularity';
            case 'favorite':
                return 'Favorite';
            default:
                return null;
        }
    }

    export function sourceTypeToString(sourceType: SourceType): string | null {
        switch (sourceType) {
            case 'other':
                return 'Other';
            case 'original':
                return 'Original';
            case 'manga':
                return 'Manga';
            case '4_koma_manga':
                return '4-Koma Manga';
            case 'web_manga':
                return 'Web Manga';
            case 'digital_manga':
                return 'Digital Manga';
            case 'novel':
                return 'Novel';
            case 'light_novel':
                return 'Light Novel';
            case 'visual_novel':
                return 'Visual Novel';
            case 'game':
                return 'Game';
            case 'card_game':
                return 'Card Game';
            case 'book':
                return 'Book';
            case 'picture_book':
                return 'Picture Book';
            case 'radio':
                return 'Radio';
            case 'music':
                return 'Music';
            default:
                return null;
        }
    }

    export function animeRelationTypeToString(animeRelationType: AnimeRelationType): string | null {
        switch (animeRelationType) {
            case 'sequel':
                return 'Sequel';
            case 'prequel':
                return 'Prequel';
            case 'alternative_setting':
                return 'Alternative Setting';
            case 'alternative_version':
                return 'Alternative Version';
            case 'side_story':
                return 'Side Story';
            case 'parent_story':
                return 'Parent Story';
            case 'summary':
                return 'Summary';
            case 'full_story':
                return 'Full Story';
            default:
                return null;
        }
    }

    export function hasGenre(anime: AnimeObject, genreId: number) {
        const genres = anime.node.genres || []; // we don't trust anything returned by the API.
        return genres.some((x) => x.id === genreId);
    }

    export function shouldCensor(anime: AnimeObject) {
        return anime.node.nsfw === 'black' || hasGenre(anime, ANIME_GENRES.Hentai.ID);
    }
}