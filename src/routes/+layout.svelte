<script lang="ts">
	import '../app.css';
	import Layout from '@/layout/Layout.svelte';
	import SessionProvider from '../provider/SessionProvider.svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
	const queryClient = new QueryClient();
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
	<title>MyAnimeStats</title>
</svelte:head>

<QueryClientProvider client={queryClient}>
	<SessionProvider userSession={data.session}>
		<Layout>
			<slot />
		</Layout>
	</SessionProvider>
</QueryClientProvider>
