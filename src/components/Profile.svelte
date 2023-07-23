<script lang="ts">
	import { signIn, signOut, getSessionToken } from '$lib/myanimelist/auth/client';
	import UserProfile from '$lib/myanimelist/svelte/UserProfile.svelte';
</script>

<div class="flex flex-col justify-center items-center my-4 w-full gap-4 text-white">
	{#await getSessionToken()}
		Loading...
	{:then sessionToken}
		{#if sessionToken == null}
			<button
				on:click={() => signIn()}
				class="bg-blue-500 px-10 py-3 hover:bg-blue-600 rounded-lg text-white text-center"
			>
				Login
			</button>
		{:else}
			<button
				on:click={() => signOut()}
				class="bg-indigo-500 px-10 py-3 hover:bg-indigo-600 rounded-lg text-white text-center"
			>
				Logout
			</button>
			<UserProfile accessToken={sessionToken.accessToken} />
		{/if}
	{:catch err}
		<code class="text-red-500 italic">
			<pre>{JSON.stringify(err, null, 2)}</pre>
		</code>
	{/await}
</div>
