<script lang="ts">
	import '../app.css';
	import Layout from '@/layout/Layout.svelte';
	import SessionProvider from '../providers/SessionProvider.svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import type { LayoutServerData } from './$types';
	import { Toaster } from 'svelte-french-toast';
	import ElementEmphasis from '@/providers/ElementEmphasis.svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import SEO from '$components/SEO.svelte';
	import AnimeWatchlistPrompt from '$components/AnimeWatchlistPrompt.svelte';

	export let data: LayoutServerData;
	const queryClient = new QueryClient();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition!(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');

		* {
			font-family: 'Roboto', sans-serif;
			font-family: 'Ubuntu', sans-serif;
		}
	</style>

	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<SEO />

	{@html webManifestLink}

	<!-- Google analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-K4HQJNPQNB"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){
			dataLayer.push(arguments);
		}

		gtag('js', new Date());
		gtag('config', 'G-K4HQJNPQNB');
	  </script>
</svelte:head>

<QueryClientProvider client={queryClient}>
	<SessionProvider userSession={data.session}>
		<Layout>
			<!-- 
				We use a key here to ensure the anime/[anime_id] route is reloaded: 
				https://github.com/sveltejs/kit/issues/4941#issuecomment-1227758791
			-->
			{#key $page.url.pathname}
				<slot />
			{/key}
		</Layout>
	</SessionProvider>

	<AnimeWatchlistPrompt />
	<Toaster />
	<ElementEmphasis />
</QueryClientProvider>

{#await import('$components/ReloadPrompt.svelte') then { default: ReloadPrompt }}
	<ReloadPrompt />
{/await}
