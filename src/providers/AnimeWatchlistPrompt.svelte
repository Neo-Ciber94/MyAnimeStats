<script lang="ts">
	import AlertDialog from '$components/AlertDialog.svelte';
	import { useAnimeListQuery } from '@/hooks/useAnimeListQuery';
	import { AnimeHelper } from '@/lib/myanimelist/common/helper';
	import type { AnimeObject } from '@/lib/myanimelist/common/types';
	import { getResponseError } from '@/lib/utils/getResponseError';
	import { Button, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import cookie from 'cookie';
	import { COOKIE_ANIME_WATCHLIST } from '@/common/constants';
	import cx from '@/lib/utils/cx';

	const animeQuery = useAnimeListQuery('/api/anime/watchlist');
	let selectedAnime: Record<number, AnimeObject> = {};
	let open = false;

	onMount(async () => {
		// To protect users of this prompt showing each time they enter
		if (!navigator.cookieEnabled) {
			return;
		}

		const cookies = cookie.parse(document.cookie);

		if (cookies[COOKIE_ANIME_WATCHLIST] == null) {
			$animeQuery.refetch();
			open = true;
		}
	});

	function toggleAnime(anime: AnimeObject) {
		if (selectedAnime[anime.node.id]) {
			delete selectedAnime[anime.node.id];
			selectedAnime = { ...selectedAnime };
		} else {
			selectedAnime = {
				...selectedAnime,
				[anime.node.id]: anime
			};
		}
	}

	async function saveWatchlist() {
		const animeList = Object.values(selectedAnime);
		const res = await fetch('/api/anime/watchlist', {
			method: 'POST',
			body: JSON.stringify(animeList)
		});

		if (!res.ok) {
			const msg = await getResponseError(res);
			toast.error(msg);
		} else {
			toast.success('Your watchlist has been updated');
			open = false;
		}
	}

	function onClose() {
		open = false;
	}
</script>

<AlertDialog
	isOpen={open}
	on:close={onClose}
	dialogClass="bg-gray-900 rounded-lg border-2 border-violet-500 p-4 w-full max-w-screen-xl mx-1 sm:mx-4"
>
	{#if $animeQuery.isLoading}
		<div class="flex flex-row justify-center items-center">
			<Spinner bg="violet" />
		</div>
	{:else}
		<div class="text-white text-base sm:text-xl mt-4 mb-2">What are you watching this season?</div>

		<div
			class="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2 max-h-[400px] overflow-auto pr-4"
		>
			{#each $animeQuery.data as anime (anime.node.id)}
				{@const isSelected = selectedAnime[anime.node.id] != null}

				<div>
					<button
						class={cx(
							'rounded-lg overflow-hidden border-4 border-violet-500 transition duration-200',
							{
								'border-pink-500 scale-90': isSelected
							}
						)}
						on:click={() => toggleAnime(anime)}
					>
						<img
							alt={anime.node.title}
							src={AnimeHelper.getImage(anime, { large: false })}
							width={200}
							height={200}
							class={cx('w-full h-[150px] object-cover border-violet-500', {
								grayscale: isSelected
							})}
						/>
					</button>
					<!-- <div class="p-1 text-center text-xs mt-1 text-white">
						{anime.node.title}
					</div> -->
				</div>
			{/each}
		</div>

		<div class="mt-4 flex flex-row gap-4">
			<Button on:click={saveWatchlist} color="purple">Confirm</Button>
			<Button on:click={onClose} color="red">Cancel</Button>
		</div>
	{/if}
</AlertDialog>
