import { noop } from "chart.js/dist/helpers/helpers.core";
import { readable } from "svelte/store";

export interface UseInterceptionObserverOptions {
    threshold?: number;
    defaultValue?: boolean;
    onIntercept?: (visible: boolean) => void;
}

/**
 * Check if an object is visible.
 * @param element The element to observer if intercepting.
 * @param options The configuration options.
 */
export function useInterceptionObserver(element: Element, options: UseInterceptionObserverOptions = {}) {
    const { threshold, defaultValue = false, onIntercept = noop } = options;

    return readable(defaultValue, (set) => {
        if (typeof window === 'undefined') {
            set(defaultValue);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                onIntercept(entry.isIntersecting);
                set(entry.isIntersecting);
            }
        }, {
            threshold
        });

        observer.observe(element)
    })
}