<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<div class="p-4">
    <pre class="text-white">{JSON.stringify(data, null, 2)}</pre>
</div>
