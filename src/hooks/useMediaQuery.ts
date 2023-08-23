import { readable } from "svelte/store";

export function useMediaQuery(query: string, defaultValue = false) {
    return readable(defaultValue, (set) => {
        if (typeof window === 'undefined') {
            set(defaultValue);
            return;
        }

        const mediaMatch = window.matchMedia(query);

        set(mediaMatch.matches);

        mediaMatch.addEventListener('change', (event) => {
            set(event.matches)
        });
    })
} 