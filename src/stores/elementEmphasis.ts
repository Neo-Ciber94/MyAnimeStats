import { writable } from "svelte/store";

const MY_LIST_EMPHASIS_KEY = 'show-emphasis-my-list';

type ElementEmphasis = {
    myListEmphasis?: boolean;
}

const elementEmphasisStore = writable<ElementEmphasis>({});

function set(value: ElementEmphasis) {
    const { myListEmphasis = false } = value;
    elementEmphasisStore.set({ myListEmphasis });

    if (myListEmphasis) {
        sessionStorage.setItem(MY_LIST_EMPHASIS_KEY, 'true');
        window.setTimeout(() => {
            set({ myListEmphasis: false })
        }, 1000 * 60);
    } else {
        sessionStorage.removeItem(MY_LIST_EMPHASIS_KEY);
    }
}

if (typeof window !== 'undefined') {
    const _myListEmphasis = sessionStorage.getItem(MY_LIST_EMPHASIS_KEY) === 'true';

    if (_myListEmphasis) {
        elementEmphasisStore.set({ myListEmphasis: _myListEmphasis });

        window.setTimeout(() => {
            set({ myListEmphasis: false })
        }, 1000 * 60);
    }
}

export default {
    subscribe: elementEmphasisStore.subscribe,
    set
}