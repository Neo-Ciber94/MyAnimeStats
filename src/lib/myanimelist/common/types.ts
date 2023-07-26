import type { AnimeSeason } from "./helpers";

export type Nsfw = 'white' | 'gray' | 'black';

export type AiringStatus = 'finished_airing' | 'currently_airing' | 'not_yet_aired'

export type MediaType = "unknown" | "tv" | "ova" | "movie" | "special" | "ona" | "music";

export type WatchStatus = 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch'

export type AnimeStudio = {
    id: number,
    name: string;
}

export type Genre = {
    id: number,
    name: string
}

export type MainPicture = {
    medium: string;
    large: string;
};

export type MyListStatus = {
    status: WatchStatus,
    score: number,
    num_episodes_watched: number,
    is_rewatching: boolean,
    start_date?: string;
    finish_date?: string;
    priority: number,
    rewatch_value: number;
    tags: string[];
    updated_at: string
}

export type AnimeNode = {
    node: {
        id: number;
        title: string;
        main_picture: MainPicture;
        media_type: MediaType;
        status: AiringStatus;
        nsfw?: Nsfw;
        genres: Genre[];
        mean: number;
        alternative_titles?: {
            synonyms?: string[];
            en?: string,
            ja?: string
        },
        start_date?: string;
        end_date?: string;
        synopsis?: string;
        rank?: number;
        popularity?: number;
        num_list_users: number;
        num_scoring_users: number;
        num_episodes: number;
        start_season?: {
            year: number,
            season: AnimeSeason
        },
        studios: AnimeStudio[],
        my_list_status?: MyListStatus
    };
};

export type AnimeApiResponse = {
    data: AnimeNode[];
    paging: {
        next?: string;
        previous?: string;
    };
    season: {
        year: number;
        season: string;
    };
};
