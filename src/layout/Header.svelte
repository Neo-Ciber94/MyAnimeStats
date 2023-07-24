<script lang="ts">
	import Logo from './Logo.svelte';
	import session from '../stores/sessionStore';
	import { Avatar, Button, Dropdown, DropdownItem, Spinner } from 'flowbite-svelte';
	import { signIn, signOut } from '$lib/myanimelist/auth/client';
</script>

<header>
	<div class="flex flex-row gap-2 justify-between shadow-lg px-20 py-8 bg-gray-950">
		<Logo />

		<div class="flex flex-row items-center ml-10 gap-5">
			<a href="/stats" class="text-white text-xl hover:text-violet-400 transition duration-300">Stats</a>
			<a href="/anime" class="text-white text-xl hover:text-violet-400 transition duration-300">Anime</a>
		</div>

		<div class="ml-auto">
			<div>
				{#if $session.loading}
					<Spinner bg="transparent" />
				{:else if $session.user}
					<div id="user-avatar" class="flex flex-row gap-2 items-center cursor-pointer">
						<span class="text-white font-bold text-xl">{$session.user.name}</span>
						<Avatar src={$session.user.picture} class="object-cover" />
					</div>

					<Dropdown triggeredBy="#user-avatar" containerClass="z-40" class="min-w-[150px] gap-2">
						<DropdownItem class="flex flex-row items-center gap-3" on:click={() => signOut()}>
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
					<Button color="purple" on:click={() => signIn()}>Login</Button>
				{/if}
			</div>
		</div>
	</div>
</header>
