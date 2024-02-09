<script lang="ts">
	import { enhance } from '$app/forms';
	import elementEmphasis, { ELEMENT_EMPHASIS_IDS } from '$stores/elementEmphasis';
	import myStatsLoading from '$stores/myStatsLoading';
	import { readCookie, setCookie } from '@/lib/utils/cookies';
	import dayjs from 'dayjs';
	import { Button } from 'flowbite-svelte';
	import { ChartSolid } from 'flowbite-svelte-icons';
	import { createEventDispatcher, onMount } from 'svelte';

	const RECALCULATE_COLDDOWN = 1000 * 60; // 1min
	const COOKIE_CAN_RECALCULATE_AT = 'mas.can_recalculate_at_timestamp';

	const dispatch = createEventDispatcher<{ data: Record<string, unknown> }>();
	let canCalculate = true;

	onMount(() => {
		const recalculateCookie = readCookie(COOKIE_CAN_RECALCULATE_AT);
		if (recalculateCookie) {
			try {
				const expirationMs = dayjs(Number(recalculateCookie)).valueOf() - dayjs().valueOf();

				if (expirationMs > 0) {
					canCalculate = false;
					setTimeout(() => {
						canCalculate = true;
					}, expirationMs);
				}
			} catch {
				// ignore
			}
		}
	});
</script>

<form
	method="POST"
	action="?/calculate"
	use:enhance={() => {
		setTimeout(() => {
			canCalculate = true;
		}, RECALCULATE_COLDDOWN);

		// Set expiration
		const expirationDate = dayjs().add(RECALCULATE_COLDDOWN, 'milliseconds');
		setCookie(COOKIE_CAN_RECALCULATE_AT, expirationDate.valueOf().toString(), {
			expires: expirationDate.toDate()
		});

		// Update state
		canCalculate = false;
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
	<Button
		type="submit"
		size="lg"
		color="purple"
		class="text-xl flex flex-row items-center gap-3"
		disabled={!canCalculate}
	>
		<ChartSolid class="w-5 h-5 text-white" />
		<slot />
	</Button>
</form>
