<script lang="ts">
	export let title: string | undefined = undefined;
	export let description: string = 'You like anime right? see your anime stats, just for fun';
	export let url: string = 'https://myanimestats.pages.dev';
	export let image: string = `${url}/icons/my-anime-stats-512x512.png`;

	//
	const pageTitle = `MyAnimeStats ${title == null ? '' : `| ${title}`}`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="title" content={pageTitle} />
	<meta name="description" content={description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={url} />
	<meta property="twitter:title" content={pageTitle} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={image} />
</svelte:head>
