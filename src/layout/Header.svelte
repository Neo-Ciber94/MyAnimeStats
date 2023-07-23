<script lang="ts">
	import Logo from './Logo.svelte';
	import session from '../stores/sessionStore';
	import { Avatar, Spinner } from 'flowbite-svelte';
</script>

<header>
	<div class="flex flex-row gap-2 justify-between shadow-lg px-4 py-8 bg-gray-950">
		<Logo />

		<div class="ml-auto">
			<div class="flex flex-row items-center gap-3">
				{#if $session.loading}
					<Spinner />
				{:else if $session.user}
					<span class="text-white font-bold text-xl">{$session.user.name}</span>
					<Avatar src={$session.user.picture} class="object-cover" />
				{/if}
			</div>
		</div>
	</div>
</header>
