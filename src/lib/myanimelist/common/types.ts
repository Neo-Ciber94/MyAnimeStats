import dayjs from "dayjs";

export type Nsfw = 'white' | 'gray' | 'black';

export type AiringStatus = 'finished_airing' | 'currently_airing' | 'not_yet_aired'

export type MediaType = "unknown" | "tv" | "ova" | "movie" | "special" | "ona" | "music";

export type WatchStatus = 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch'

export type RankingType = 'all'
    | 'airing'
    | 'upcoming'
    | 'tv'
    | 'ova'
    | 'movie'
    | 'special'
    | 'bypopularity'
    | 'favorite';

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

export type AnimeNodeWithRanking = AnimeNode & {
    ranking: {
        rank: number,
        previous_rank?: number
    }
}

export type AnimeNodeWithStatus = AnimeNode & {
    status: MyListStatus
}

export type AnimeApiResponse<T extends AnimeNode = AnimeNode> = {
    data: T[];
    paging: {
        next?: string;
        previous?: string;
    };
};

export type AnimeRankingApiResponse = AnimeApiResponse<AnimeNodeWithRanking>;

export type AnimeStatusApiResponse = AnimeApiResponse<AnimeNodeWithStatus>;


// https://myanimelist.net/apiconfig/references/api/v2#operation/anime_season_year_season_get
export type AnimeSeason = 'winter' | 'spring' | 'summer' | 'fall';

export function getCurrentAnimeSeason() {
    const now = dayjs();
    const month = now.month();
    const year = now.year();

    let season: AnimeSeason;

    if ([0, 1, 2].includes(month)) {
        season = 'winter';
    } else if ([3, 4, 5].includes(month)) {
        season = 'spring'
    } else if ([6, 7, 8].includes(month)) {
        season = 'summer'
    } else {
        season = 'fall';
    }

    return { season, year }
}

export function seasonToNumber(season: AnimeSeason) {
    switch (season) {
        case 'winter':
            return 1;
        case 'spring':
            return 2;
        case 'summer':
            return 3;
        case 'fall':
            return 4;
        default:
            throw new Error(`Invalid season: ${season}`);
    }
}