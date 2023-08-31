import type { AnimeObject } from "@/lib/myanimelist/common/types";
import { getResponseError } from "@/lib/utils/getResponseError";
import { createInfiniteQuery, useQueryClient } from "@tanstack/svelte-query";
import { derived } from "svelte/store";

type ApiResponse = {
    data: AnimeObject[];
    next: string;
};

type AnimeError = {
    message: string;
};

type QueryValue = string | number | boolean | null | undefined;
type QueryObject = Record<string, QueryValue>;

export function useAnimeListQuery<Q extends QueryObject = QueryObject>(path: string) {
    let query: Q | undefined = undefined;
    const queryClient = useQueryClient();
    const animeQuery = createInfiniteQuery<ApiResponse, AnimeError>({
        queryKey: [path, query],
        enabled: false,
        queryFn: async ({ signal, pageParam: offset }) => {
            return await fetchAnimeList(path, query, {
                signal,
                offset
            })
        },
        getNextPageParam(lastPage) {
            if (!lastPage.next) {
                return null;
            }

            const { searchParams } = new URL(lastPage.next, window.location.href);
            const offset = searchParams.get('offset');
            return offset == null ? null : Number(offset);
        },
    });

    async function cancel() {
        await queryClient.cancelQueries({ queryKey: [path] })
    }

    return derived(animeQuery, $animeQuery => {
        const animeList = ($animeQuery.data?.pages || []).flatMap(x => x.data);

        async function fetchNextPage() {
            if (!$animeQuery.hasNextPage) {
                return false;
            }

            await $animeQuery.fetchNextPage();
            return true;
        }

        async function refetch(q: Q | undefined) {
            query = q;
            await $animeQuery.refetch();
        }

        return {
            data: animeList,
            isLoading: $animeQuery.isLoading,
            isFetching: $animeQuery.isFetching,
            isError: $animeQuery.isError,
            error: $animeQuery.error,
            hasNext: $animeQuery.hasNextPage,
            remove: $animeQuery.remove,
            refetch,
            fetchNextPage,
            cancel
        }
    })
}

type FetchAnimeListOptions = {
    signal?: AbortSignal | undefined,
    offset?: number
}

async function fetchAnimeList(path: string, query: QueryObject | undefined, options: FetchAnimeListOptions) {
    const { signal, offset } = options;
    const url = new URL(path, window.location.origin);

    if (offset) {
        url.searchParams.set('offset', String(offset));
    }

    if (query) {
        for (const [key, value] of Object.entries(query)) {
            if (value) {
                url.searchParams.set(key, String(value));
            }
        }
    }

    const res = await fetch(url, { signal });

    if (!res.ok) {
        const msg = await getResponseError(res);
        throw new Error(msg || 'Something went wrong');
    }

    const json = (await res.json()) as ApiResponse;
    return json;
}