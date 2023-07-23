<script lang="ts">
	import { getUser } from '../auth/client';

	export let accessToken: string;
</script>

{#await getUser({ accessToken })}
	<slot name="loading">
		<span class="text-white">Loading...</span>
	</slot>
{:then user}
	<slot {user} name="user">
		<div class="flex flex-col gap-2 justify-center items-center">
			<img
				src={user.picture}
				alt={user.name}
				class="shadow-md rounded-lg border border-gray-200/50 overflow-hidden aspect-square object-cover"
			/>
			<span class="text-2xl font-bold font-mono text-white">{user.name}</span>
		</div>
	</slot>
{:catch error}
	<slot name="error">
		<div class="text-red-500 italic">{JSON.stringify(error, null, 2)}</div>
	</slot>
{/await}
