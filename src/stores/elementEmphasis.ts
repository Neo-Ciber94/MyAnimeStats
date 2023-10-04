import { browser } from '$app/environment';
import { parseJson } from '@/lib/utils/parseJson';
import { get, writable } from 'svelte/store';
import { z } from 'zod';

const ELEMENT_EMPHASIS_KEY = 'element-emphasis-ids';

export const ELEMENT_EMPHASIS_IDS = Object.freeze({
	myListLink: 'my-list-link',
	myStatsLink: 'my-stats-link'
});

type _ElementEmphasisID = typeof ELEMENT_EMPHASIS_IDS;
type ElementEmphasisID = (typeof ELEMENT_EMPHASIS_IDS)[keyof _ElementEmphasisID];

const elementEmphasisStore = writable<Set<string>>(new Set());

function setEmphasis(id: ElementEmphasisID) {
	if (!browser) {
		return;
	}

	elementEmphasisStore.update((prev) => prev.add(id));
	const element = document.getElementById(id);

	if (element) {
		element.classList.add('animate-bounce', 'animate-infinite');
		sessionStorage.setItem(ELEMENT_EMPHASIS_KEY, JSON.stringify([...get(elementEmphasisStore)]));
		window.setTimeout(() => removeEmphasis(id), 1000 * 60);
	}
}

function removeEmphasis(id: ElementEmphasisID) {
	if (!browser) {
		return;
	}

	elementEmphasisStore.update((prev) => {
		prev.delete(id);
		return prev;
	});

	sessionStorage.setItem(ELEMENT_EMPHASIS_KEY, JSON.stringify([...get(elementEmphasisStore)]));
	const element = document.getElementById(id);

	if (element) {
		element.classList.remove('animate-bounce', 'animate-infinite');
	}
}

function initialize() {
	if (!browser) {
		return;
	}

	const elementsString = sessionStorage.getItem(ELEMENT_EMPHASIS_KEY);

	if (elementsString) {
		const validElementIds = Object.values(ELEMENT_EMPHASIS_IDS) as string[];
		const schema = z.array(z.string());
		const elementsIds = parseJson(schema, elementsString, { returnNullOnFailure: true }) || [];

		for (const id of elementsIds) {
			if (validElementIds.includes(id)) {
				setEmphasis(id as ElementEmphasisID);
			}
		}
	}
}

export default {
	setEmphasis,
	removeEmphasis,
	initialize,
	subscribe: elementEmphasisStore.subscribe
};
