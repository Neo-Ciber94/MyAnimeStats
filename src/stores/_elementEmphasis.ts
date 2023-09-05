import { browser } from "$app/environment";
import { parseJson } from "@/lib/utils/parseJson";
import { writable } from "svelte/store";
import { z } from "zod";

const ELEMENT_EMPHASIS_KEY = "element-emphasis-ids";

export const ELEMENT_EMPHASIS_IDS = Object.freeze({
    myListLink: "my-link-link",
});

type _ElementEmphasisID = typeof ELEMENT_EMPHASIS_IDS;
type ElementEmphasisID = (typeof ELEMENT_EMPHASIS_IDS)[keyof _ElementEmphasisID]

const elementEmphasisStore = writable<Set<string>>(new Set());
elementEmphasisStore.subscribe(ids => {
    if (!browser) {
        sessionStorage.setItem(ELEMENT_EMPHASIS_KEY, JSON.stringify([...ids]));
    }
})

function setEmphasis(id: ElementEmphasisID) {
    if (!browser) {
        return;
    }

    elementEmphasisStore.update(prev => prev.add(id));
    const element = document.getElementById(id);

    if (element) {
        element.classList.add('animate-bounce', 'animate-infinite');
        window.setTimeout(() => removeEmphasis(id), 1000 * 60); // remove after 1min
    }
}

function removeEmphasis(id: ElementEmphasisID) {
    if (!browser) {
        return;
    }

    elementEmphasisStore.update(prev => {
        prev.delete(id);
        return prev;
    });

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
        const schema = z.set(z.string());
        const elementsIds = parseJson(schema, elementsString, { returnNullOnFailure: true }) || new Set();

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
}