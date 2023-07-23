export type Nsfw = 'white' | 'gray' | 'black';

export type AiringStatus = 'finished_airing' | 'currently_airing' | 'not_yet_aired'

export type MediaType = "unknown" | "tv" | "ova" | "movie" | "special" | "ona" | "music";

export type Genre = {
    id: number,
    name: string
}

export type MainPicture = {
    medium: string;
    large: string;
};

export type AnimeNode = {
    node: {
        id: number;
        title: string;
        main_picture: MainPicture;
        media_type: MediaType;
        status: AiringStatus;
        nsfw: Nsfw;
        genres: Genre[];
        mean: number;
    };
};

export type AnimeApiResponse = {
    data: AnimeNode[];
    paging: {
        next: string;
    };
    season: {
        year: number;
        season: string;
    };
};
