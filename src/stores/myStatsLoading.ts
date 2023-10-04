import { writable } from 'svelte/store';

const myStatsLoadingStore = writable(false);

export default {
	...myStatsLoadingStore
};
