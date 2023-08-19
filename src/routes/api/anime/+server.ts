import { MALClient } from "@/lib/myanimelist/api";
import type { RequestHandler } from "./$types";
import { PUBLIC_MY_ANIME_LIST_CLIENT_ID } from "$env/static/public";
import { getCurrentAnimeSeason, type AiringStatus } from "@/lib/myanimelist/common/types";
import ANIME_GENRES from "@/types/generated/animeGenres.generated";
import { error } from "@sveltejs/kit";

const LIMIT = 100;

export const GET: RequestHandler = async ({ request }) => {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const offset = parseNumberOrNull(searchParams.get('offset')) ?? 0;

    const malClient = new MALClient({
        clientId: PUBLIC_MY_ANIME_LIST_CLIENT_ID
    })

    const length = q.trim().length;

    if (length > 0 && length < 3) {
        throw error(400, 'Expected a search of 3 or more characters')
    }

    if (length === 0) {
        const { season, year } = getCurrentAnimeSeason();
        const result = await malClient.getSeasonalAnime({
            season,
            year,
            limit: LIMIT,
            offset,
            sort: 'anime_num_list_users',
            fields: ["nsfw", "genres", "status", "mean", 'start_season', 'broadcast'],
            nsfw: true
        });

        const AVAILABLE_STATUSES = ['currently_airing', 'finished_airing'] as AiringStatus[];
        const animeList = result.data.filter(({ node }) => {
            if (!node.start_season) {
                return false;
            }

            return node.start_season.season === season
                && node.start_season.year === year
                && node.broadcast?.start_time != null
                && AVAILABLE_STATUSES.includes(node.status)
                && !node.genres.some(x => x.id === ANIME_GENRES.Hentai.ID)
        });

        return Response.json({ data: animeList, next: null });
    }

    const result = await malClient.getAnimeList({
        q,
        limit: LIMIT,
        offset,
        fields: ["nsfw", "genres", "status", "mean", 'start_season', 'broadcast'],
        nsfw: true
    })

    const animeList = result.data.filter(({ node }) => {
        return !node.genres?.some(x => x.id === ANIME_GENRES.Hentai.ID)
    });

    return Response.json({ data: animeList, next: null });
}

function parseNumberOrNull(s: string | null): number | null {
    if (s == null) {
        return null;
    }

    const value = Number(s);
    return Number.isNaN(value) ? null : value;
}