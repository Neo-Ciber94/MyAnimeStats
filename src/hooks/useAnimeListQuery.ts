import type { AnimeObject } from "@/lib/myanimelist/common/types";
import { getResponseError } from "@/lib/utils/getResponseError";
import { createInfiniteQuery, useQueryClient } from "@tanstack/svelte-query";
import { onMount } from "svelte";
import { derived } from "svelte/store";

type ApiResponse = {
    data: AnimeObject[];
    next: string;
};

type AnimeError = {
    message: string;
};

export function useAnimeListQuery(search: string) {
    const queryClient = useQueryClient();
    const animeQuery = createInfiniteQuery<ApiResponse, AnimeError>({
        queryKey: ['anime', search],
        enabled: false,
        queryFn: async ({ signal }) => await fetchAnimeList({
            search,
            signal,
        }),
        getNextPageParam(lastPage) {
            return lastPage.next
        }
    });

    onMount(() => {
        animeQuery.subscribe($animeQuery => {
            $animeQuery.refetch();
        });
    });

    async function cancel() {
        await queryClient.cancelQueries({ queryKey: ['anime'] })
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

        return {
            data: animeList,
            isLoading: $animeQuery.isLoading,
            isError: $animeQuery.isError,
            error: $animeQuery.error,
            hasNext: $animeQuery.hasNextPage,
            fetchNextPage,
            cancel
        }
    })
}

type AnimeQuery = {
    search: string | null | undefined,
    signal: AbortSignal | undefined
}

async function fetchAnimeList({ search, signal }: AnimeQuery) {
    const url = new URL('/api/anime', window.location.origin);

    if (search) {
        url.searchParams.set('q', search);
    }

    const res = await fetch(url, { signal });

    if (!res.ok) {
        const msg = await getResponseError(res);
        throw new Error(msg || 'Something went wrong');
    }

    const json = (await res.json()) as ApiResponse;
    return json;
}