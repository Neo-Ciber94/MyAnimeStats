<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';

	// replaced dynamically

	// @ts-ignore
	let buildDate = __DATE__;

	// @ts-ignore
	let reloadSW = __RELOAD_SW__;

	const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
		onRegistered(registration) {
			if (reloadSW) {
				registration &&
					setInterval(() => {
						console.log('Checking for sw update');
						registration.update();
					}, 20000 /* 20s for testing purposes */);
			} else {
				console.log(`SW Registered: ${registration}`);
			}
		},
		onRegisterError(error) {
			console.log('SW registration error', error);
		}
	});
	const close = () => {
		offlineReady.set(false);
		needRefresh.set(false);
	};

	$: toast = $offlineReady || $needRefresh;
</script>

{#if toast}
	<div
		class="fixed right-0 mx-auto sm:mx-0 left-0 max-w-fit bottom-4 sm:right-4 sm:left-auto shadow-md border-2 border-violet-500
		bg-gray-900/90 backdrop-blur-md text-white z-50 p-4 rounded-lg
		text-sm sm:text-base"
		role="alert"
	>
		<div class="">
			{#if $offlineReady}
				<span> App ready to work offline </span>
			{:else}
				<span> A new update is available, click on reload to update. </span>
			{/if}
		</div>

		<div class="mt-4 text-bold">
			{#if $needRefresh}
				<button
					class="text-pink-400 bg-violet-600/20 hover:bg-violet-600/30 px-8 py-1 rounded-md"
					on:click={() => updateServiceWorker(true)}
				>
					Reload
				</button>
			{/if}
			<button
				class="text-pink-400 bg-violet-600/20 hover:bg-violet-600/30 px-8 py-1 rounded-md"
				on:click={close}
			>
				Close
			</button>
		</div>
	</div>
{/if}

<div class="invisible">
	{buildDate}
</div>
