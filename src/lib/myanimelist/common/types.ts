export type MainPicture = {
    medium: string;
    large: string;
};

export type AnimeNode = {
    node: {
        id: number;
        title: string;
        main_picture: MainPicture;
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
