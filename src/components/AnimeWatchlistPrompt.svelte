<script context="module" lang="ts">
	type WatchListStatus = 'watching' | 'plan_to_watch';

	type WatchListAnime = {
		anime: AnimeObject;
		status?: WatchListStatus;
	};
</script>

<script lang="ts">
	import AlertDialog from '$components/AlertDialog.svelte';
	import { useAnimeListQuery } from '@/hooks/useAnimeListQuery';
	import { AnimeHelper } from '@/lib/myanimelist/common/helper';
	import type { AnimeObject } from '@/lib/myanimelist/common/types';
	import { getResponseError } from '@/lib/utils/getResponseError';
	import { Button, Spinner, Tooltip } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import cookie from 'cookie';
	import { COOKIE_ANIME_WATCHLIST, PLACEHOLDER_IMAGE } from '@/common/constants';
	import cx from '@/lib/utils/cx';
	import session from '$stores/session';
	import { setCookie } from '@/lib/utils/cookies';
	import { ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { env } from '$env/dynamic/public';

	const animeQuery = useAnimeListQuery('/api/anime/watchlist');
	let selectedAnime: Record<number, WatchListAnime> = {};
	let loading = false;
	let open = false;

	onMount(async () => {
		// FIXME: We cannot bulk update anime, so this action may limit our API calls,
		// for now we hide this
		// To protect users of this prompt showing each time they enter
		if (
			!navigator.cookieEnabled ||
			$session.user == null ||
			env.PUBLIC_SHOW_WATCHLIST_REMINDER == null
		) {
			return;
		}

		const cookies = cookie.parse(document.cookie);

		if (cookies[COOKIE_ANIME_WATCHLIST] == null) {
			$animeQuery.refetch();
			open = true;

			// By default we delay the message by 3min if is closed
			setCookie(COOKIE_ANIME_WATCHLIST, '3m', {
				maxAge: 60 * 3,
				path: '/'
			});
		}
	});

	function toggleAnime(anime: AnimeObject) {
		if (selectedAnime[anime.node.id]) {
			delete selectedAnime[anime.node.id];
			selectedAnime = { ...selectedAnime };
		} else {
			selectedAnime = {
				...selectedAnime,
				[anime.node.id]: { anime }
			};
		}
	}

	function selectStatus(anime: AnimeObject, status: WatchListStatus) {
		selectedAnime = {
			...selectedAnime,
			[anime.node.id]: { anime, status }
		};
	}

	async function saveWatchlist() {
		try {
			loading = true;
			const watchList = Object.values(selectedAnime).map((x) => ({
				animeId: x.anime.node.id,
				status: x.status
			}));

			const res = await fetch('/api/anime/watchlist', {
				method: 'POST',
				body: JSON.stringify({ watchList })
			});

			if (!res.ok) {
				const msg = await getResponseError(res);
				toast.error(msg);
			} else {
				toast.success('Your watchlist has been updated');
				open = false;
			}
		} finally {
			loading = false;
		}
	}

	function handleLater() {
		try {
			open = false;
			setCookie(COOKIE_ANIME_WATCHLIST, '1d', {
				maxAge: 60 * 60 * 24,
				path: '/'
			});
		} catch (err) {
			console.error(err);
		}
	}

	function onClose() {
		open = false;
	}

	function handleImgError(event: Event & { currentTarget: EventTarget & Element }) {
		const el = event.currentTarget as HTMLImageElement;
		el.src = PLACEHOLDER_IMAGE;
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
				{@const status = selectedAnime[anime.node.id]?.status}

				<div class="relative">
					<Tooltip
						arrow={false}
						triggeredBy={`#anime-watchlist-${anime.node.id}`}
						class="bg-black/70 backdrop-blur-md text-center border-2 border-violet-500 z-30"
					>
						{anime.node.title}
					</Tooltip>

					{#if isSelected}
						<a
							href={`/anime/${anime.node.id}`}
							target="_blank"
							class="absolute
							p-[2px]
							top-0
							right-0
							z-20
							bg-pink-200
							backdrop-blur-md
							rounded-full
							overflow-hidden"
						>
							<ExclamationCircleSolid class="outline-none text-pink-500 bg-blend-exclusion" />
						</a>
					{/if}

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
							id={`anime-watchlist-${anime.node.id}`}
							alt={anime.node.title}
							src={AnimeHelper.getImage(anime, { large: false })}
							width={200}
							height={200}
							on:error={handleImgError}
							class={cx('w-full h-[150px] object-cover border-violet-500', {
								grayscale: isSelected
							})}
						/>
					</button>

					<!-- <div class="p-1 text-center text-xs mt-1 text-white">
						{anime.node.title}
					</div> -->

					<div
						class={cx(
							'max-h-0 opacity-0 overflow-hidden mb-3 transition-all duration-300 flex flex-col gap-2 -mt-4 z-10 relative shadow-lg',
							{
								'max-h-64 opacity-100': isSelected
							}
						)}
					>
						<button
							disabled={status === 'watching'}
							class={cx(
								'text-xs text-white bg-violet-500 hover:bg-violet-600 p-1 rounded-lg shadow',
								{
									'!bg-violet-800': status === 'watching',
									' hidden': status === 'plan_to_watch'
								}
							)}
							on:click={() => selectStatus(anime, 'watching')}
						>
							Watching
						</button>

						<button
							disabled={status === 'plan_to_watch'}
							class={cx('text-xs text-white bg-pink-500 hover:bg-pink-600 p-1 rounded-lg shadow', {
								'!bg-pink-800': status === 'plan_to_watch',
								' hidden': status === 'watching'
							})}
							on:click={() => selectStatus(anime, 'plan_to_watch')}
						>
							Plan to watch
						</button>
						{#if status}
							<button
								class="text-xs text-white bg-red-600 hover:bg-red-700 p-1 rounded-lg"
								on:click={() => toggleAnime(anime)}
							>
								Remove
							</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-4 flex flex-row gap-4">
			<Button
				on:click={saveWatchlist}
				disabled={loading}
				color="purple"
				class="flex flex-row gap-2"
			>
				{#if loading}
					<Spinner size="5" />
				{/if}
				<span>Confirm</span>
			</Button>
			<Button on:click={handleLater} disabled={loading} color="red">Later</Button>
		</div>
	{/if}
</AlertDialog>
