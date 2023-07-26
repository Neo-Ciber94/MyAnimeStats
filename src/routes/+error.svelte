<script lang="ts">
	import { page } from '$app/stores';
</script>

{#if $page.error}
	<div class="flex flex-row justify-center w-full p-4 text-pink-500 text-3xl font-normal gap-4">
		<span>{$page.error.message}</span>
		<span class="opacity-50">|</span>
		<span>{$page.status}</span>
	</div>
{/if}
