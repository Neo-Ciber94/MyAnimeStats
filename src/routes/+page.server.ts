import { MALClient } from "@/lib/myanimelist/api";
import type { PageServerLoad } from "./$types";
import { PUBLIC_MY_ANIME_LIST_CLIENT_ID } from "$env/static/public";
import { getCurrentAnimeSeason, type AiringStatus } from "@/lib/myanimelist/common/types";
import { invariant } from "@/lib/utils/invariant";
import ANIME_GENRES from "@/types/generated/animeGenres.generated";
import { getServerSession } from "@/lib/myanimelist/svelte/auth";
import { shuffleArray } from "@/lib/utils/helpers";

export const load: PageServerLoad = async (event) => {
    const authenticated = await getServerSession(event.cookies);
    const accessToken = authenticated?.accessToken;

    const suggestedAnimeList = await getSuggestedAnimeList({ limit: 100, accessToken });
    const seasonalAnimeList = await getCurrentSeasonAnimeList({ limit: 100 });
    return { seasonalAnimeList, suggestedAnimeList }
};

async function getCurrentSeasonAnimeList({ limit }: { limit: number }) {
    const malClient = new MALClient({
        clientId: PUBLIC_MY_ANIME_LIST_CLIENT_ID
    });

    const { season, year } = getCurrentAnimeSeason();
    const result = await malClient.getSeasonalAnime({
        season,
        year,
        limit,
        fields: ['start_season', 'status', 'start_date', 'genres', 'broadcast'],
        sort: 'anime_num_list_users',
        nsfw: true
    });

    const AVAILABLE_STATUSES = ['currently_airing', 'finished_airing'] as AiringStatus[];

    const animeList = result.data.filter(({ node }) => {
        invariant(node.start_season, "start season not defined");

        return node.start_season.season == season
            && node.start_date != null
            && AVAILABLE_STATUSES.includes(node.status)
            && node.broadcast?.start_time != null
            && !node.genres.some(x => x.id === ANIME_GENRES.Hentai.ID)
    });

    return animeList;
}

async function getSuggestedAnimeList({ limit, accessToken }: { limit: number, accessToken?: string }) {
    if (accessToken == null) {
        return null;
    }

    const malClient = new MALClient({ accessToken });
    const suggestions = await malClient.getSuggestedAnime({
        limit,
        fields: ['start_date', 'rank']
    });

    const data = shuffleArray(suggestions.data);
    return data;
}    