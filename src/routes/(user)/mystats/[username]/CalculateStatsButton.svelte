<script lang="ts">
	import { enhance } from '$app/forms';
	import elementEmphasis, { ELEMENT_EMPHASIS_IDS } from '$stores/elementEmphasis';
	import myStatsLoading from '$stores/myStatsLoading';
	import { Button } from 'flowbite-svelte';
	import { ChartSolid } from 'flowbite-svelte-icons';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ data: Record<string, unknown> }>();
</script>

<form
	method="POST"
	action="?/calculate"
	use:enhance={() => {
		myStatsLoading.set(true);

		return ({ update, result }) => {
			if (result && result.type === 'success') {
				if (result.data) {
					elementEmphasis.setEmphasis(ELEMENT_EMPHASIS_IDS.myListLink);
					dispatch('data', result.data);
				}
			}

			myStatsLoading.set(false);
			update();
		};
	}}
>
	<Button type="submit" size="lg" color="purple" class="text-xl flex flex-row items-center gap-3">
		<ChartSolid class="w-5 h-5 text-white" />
		<slot />
	</Button>
</form>
