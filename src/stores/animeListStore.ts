import type { AnimeNode } from "$lib/myanimelist/common/types";
import { writable } from "svelte/store";

const CACHE_DURATION_MS = 1000 * 60 * 60 * 4; // 4 hours

export interface AnimeListState {
    loading: boolean;
    animeList: AnimeNode[]
}

const animeListStore = writable<AnimeListState>({
    loading: true,
    animeList: []
})