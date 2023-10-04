import type { AnimeObject } from '@/lib/myanimelist/common/types';
import { getResponseError } from '@/lib/utils/getResponseError';
import { createInfiniteQuery, useQueryClient } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';
import { z } from 'zod';

const apiResponseSchema = z.object({
	data: z.array(
		z.object({
			node: z.record(z.unknown())
		})
	),
	next: z.string().nullish()
});

export type AnimeApiResponse = {
	data: AnimeObject[];
	next?: string | null;
};

type AnimeError = {
	message: string;
};

type QueryValue = string | number | boolean | null | undefined;
type QueryObject = Record<string, QueryValue>;

type UseAnimeListQueryOptions = {
	returnEmptyOn404?: boolean;
};

export function useAnimeListQuery<Q extends QueryObject = QueryObject>(
	path: string,
	options?: UseAnimeListQueryOptions
) {
	let query: Q | undefined = undefined;
	const queryClient = useQueryClient();
	const animeQuery = createInfiniteQuery<AnimeApiResponse, AnimeError>({
		queryKey: [path, query],
		enabled: false,
		queryFn: async ({ signal, pageParam: offset }) => {
			return await fetchAnimeList(path, query, {
				signal,
				offset,
				returnEmptyOn404: options?.returnEmptyOn404
			});
		},
		getNextPageParam(lastPage) {
			if (!lastPage.next) {
				return null;
			}

			const { searchParams } = new URL(lastPage.next, window.location.href);
			const offset = searchParams.get('offset');
			return offset == null ? null : Number(offset);
		}
	});

	async function cancel() {
		await queryClient.cancelQueries({ queryKey: [path] });
	}

	return derived(animeQuery, ($animeQuery) => {
		const animeList = ($animeQuery.data?.pages || []).flatMap((x) => x.data);

		async function fetchNextPage() {
			if (!$animeQuery.hasNextPage) {
				return false;
			}

			await $animeQuery.fetchNextPage();
			return true;
		}

		async function refetch(q?: Q | undefined) {
			query = q;
			return await $animeQuery.refetch();
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
		};
	});
}

type FetchAnimeListOptions = {
	signal?: AbortSignal | undefined;
	returnEmptyOn404?: boolean;
	offset?: number;
};

async function fetchAnimeList(
	path: string,
	query: QueryObject | undefined,
	options: FetchAnimeListOptions
) {
	const { signal, offset, returnEmptyOn404 = false } = options;
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

	if (res.status === 404 && returnEmptyOn404) {
		return {
			data: [],
			next: null
		};
	}

	if (!res.ok) {
		const msg = await getResponseError(res);
		throw new Error(msg || 'Something went wrong');
	}

	const json = apiResponseSchema.parse(await res.json());
	return json as AnimeApiResponse;
}
