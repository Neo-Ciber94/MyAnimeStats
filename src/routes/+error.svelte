<script lang="ts">
	import { page } from '$app/stores';
</script>

{#if $page.error}
	<div
		class="flex flex-col justify-center w-full h-[45vh] items-center
		p-4 text-pink-500 font-normal gap-1 sm:gap-4 text-center"
	>
		<div class="text-[max(10vw,30px)] sm:text-8xl !leading-[1.2em] border-b-2 border-b-pink-400">
			{$page.status}
		</div>
		<div class="text-[max(6vw,20px)] sm:text-4xl">{$page.error.message}</div>
	</div>
{/if}
