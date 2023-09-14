<script lang="ts">
	import Logo from './Logo.svelte';
	import session from '../stores/session';
	import { Avatar, Button, Dropdown, DropdownItem, Spinner } from 'flowbite-svelte';
	import { signIn, signOut } from '$lib/myanimelist/auth/client';
	import NavSearchBar from './NavSearchBar.svelte';
	import { page } from '$app/stores';
	import elementEmphasis, { ELEMENT_EMPHASIS_IDS } from '$stores/elementEmphasis';
	import cx from '@/lib/utils/cx';
	import { AnimeHelper } from '@/lib/myanimelist/common/helper';
	const { season, year } = AnimeHelper.getCurrentAnimeSeason();
	
	function handleSignIn() {
		signIn();
	}

	function handleLogout() {
		signOut();
		//session.destroy();
	}
</script>

<header>
	<div class="h-full md:h-28 pt-2 flex flex-col gap-2 shadow-lg justify-center bg-gray-950">
		<div class="flex flex-row flex-wrap justify-between items-center px-10 h-2/3">
			<Logo />
			<div class="flex flex-row gap-8 items-center">
				{#if $page.url.pathname !== '/anime'}
					<NavSearchBar class="md:flex hidden" />
				{/if}

				<div>
					{#if $session.loading}
						<Spinner bg="transparent" />
					{:else if $session.user}
						<div id="user-avatar" class="flex flex-row gap-2 items-center cursor-pointer">
							<span class="text-white font-bold text-sm md:text-xl">{$session.user.name}</span>
							<Avatar src={$session.user.picture} class="object-cover aspect-square" />
						</div>

						<Dropdown triggeredBy="#user-avatar" headerClass="z-[100]" class="min-w-[150px] gap-2">
							<DropdownItem class="flex flex-row items-center gap-3" on:click={handleLogout}>
								<svg
									class="w-[14px] h-[14px] text-gray-800 dark:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 16 16"
								>
									<path
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3"
									/>
								</svg>
								<span>Sign out</span>
							</DropdownItem>
						</Dropdown>
					{:else}
						<Button color="purple" on:click={handleSignIn}>Login</Button>
					{/if}
				</div>
			</div>
		</div>

		<div class="block md:hidden mb-2">
			<NavSearchBar />
		</div>

		<div
			class="flex flex-row items-center justify-center xs:justify-start flex-wrap
				text-base gap-5 px-10 bg-violet-800 py-2"
		>
			<a
				href="/anime"
				class={cx(
					'relative group text-white hover:text-pink-400 transition duration-300',
					`after:h-[2px] after:transition-all after:duration-300 after:mx-auto after:w-0 hover:after:w-full 
						after:absolute after:bg-pink-500 after:bottom-0 after:left-0 after:right-0`,
					$page.url.pathname === '/anime' && 'text-pink-400 after:w-full'
				)}
				>Anime
			</a>

			<a
				data-sveltekit-reload={$page.route.id === '/anime/season/[year]/[season]' ? true : 'off'}
				href={`/anime/season/${year}/${season}`}
				class={cx(
					'relative text-white hover:text-pink-400 transition duration-300',
					`after:h-[2px] after:transition-all after:duration-300 after:mx-auto after:w-0 hover:after:w-full 
						after:absolute after:bg-pink-500 after:bottom-0 after:left-0 after:right-0`,
					$page.url.pathname.startsWith('/anime/season') && 'text-pink-400 after:w-full'
				)}
			>
				Season
			</a>

			{#if $session.user}
				<a
					id={ELEMENT_EMPHASIS_IDS.myStatsLink}
					href="/mystats"
					class={cx(
						'relative inline-flex text-white hover:text-pink-400 transition duration-300',
						`after:h-[2px] after:transition-all after:duration-300 after:mx-auto after:w-0 hover:after:w-full 
							after:absolute after:bg-pink-500 after:bottom-0 after:left-0 after:right-0`,
						$page.url.pathname === '/mystats' && '!text-pink-400 after:w-full'
					)}
				>
					<span class="text-red-500">My</span>
					<span>Stats</span>
				</a>

				<a
					id={ELEMENT_EMPHASIS_IDS.myListLink}
					href="/mylist/@me"
					on:click={() => elementEmphasis.removeEmphasis(ELEMENT_EMPHASIS_IDS.myListLink)}
					class={cx(
						'relative inline-flex text-white hover:text-pink-400 transition duration-300',
						`after:h-[2px] after:transition-all after:duration-300 after:mx-auto after:w-0 hover:after:w-full 
							after:absolute after:bg-pink-500 after:bottom-0 after:left-0 after:right-0`,
						$page.url.pathname === '/mylist/@me' && '!text-pink-400 after:w-full'
					)}
				>
					<span class="text-red-500">My</span>
					<span>List</span>
				</a>
			{/if}
		</div>
	</div>
</header>

<style>
	:global(#user-avatar + div[role='tooltip']) {
		z-index: 50;
	}
</style>
