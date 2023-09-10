<script lang="ts">
	import AlertDialog from '$components/AlertDialog.svelte';
	import { useAnimeListQuery } from '@/hooks/useAnimeListQuery';
	import { AnimeHelper } from '@/lib/myanimelist/common/helper';
	import type { AnimeObject } from '@/lib/myanimelist/common/types';
	import { getResponseError } from '@/lib/utils/getResponseError';
	import { Button, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	const animeQuery = useAnimeListQuery('/anime/watchlist');
	const selectedAnime = new Map<number, AnimeObject>();
	let open = false;

    onMount(() => {
        
    })

	function toggleAnime(anime: AnimeObject) {
		if (selectedAnime.has(anime.node.id)) {
			selectedAnime.delete(anime.node.id);
		} else {
			selectedAnime.set(anime.node.id, anime);
		}
	}

	async function saveWatchlist() {
		const animeList = Array.from(selectedAnime.values());
		const res = await fetch('/anime/watchlist', {
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
	dialogClass="bg-gray-900 rounded-lg border-2 border-violet-500 p-4"
>
	{#if $animeQuery.isLoading}
		<div class="flex flex-row justify-center items-center">
			<Spinner bg="violet" />
		</div>
	{:else}
		<div class="flex gap-2 flex-row flex-wrap justify-center">
			{#each $animeQuery.data as anime (anime.node.id)}
				<button class="rounded-md p-2" on:click={() => toggleAnime(anime)}>
					<img
						alt={anime.node.title}
						src={AnimeHelper.getImage(anime)}
						width={80}
						height={80}
						class="object-cover"
					/>
				</button>
			{/each}
		</div>

		<div class="mt-4 flex flex-row gap-4">
			<Button on:click={saveWatchlist} color="purple">Confirm</Button>
			<Button on:click={onClose} color="red">Cancel</Button>
		</div>
	{/if}
</AlertDialog>
