import { readable } from "svelte/store";

export interface UseInterceptionObserverOptions {
    threshold?: number;
    defaultValue?: boolean;
    onIntercept?: (visible: boolean) => void;
}

const noop = () => { /* */ }

/**
 * Check if an object is visible.
 * @param element The element to observer if intercepting.
 * @param options The configuration options.
 */
export function useInterceptionObserver(element: Element | null | undefined, options: UseInterceptionObserverOptions = {}) {
    let isAlreadyCheck = false;
    const { threshold, defaultValue = false, onIntercept = noop } = options;

    return readable(defaultValue, (set) => {
        if (typeof window === 'undefined') {
            return set(defaultValue);
        }

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            isAlreadyCheck = true;

            if (entry) {
                onIntercept(entry.isIntersecting);
                set(entry.isIntersecting);
            }
        }, {
            threshold
        });

        if (element) {
            if (!isAlreadyCheck) {
                if (element.getBoundingClientRect().top < window.innerHeight) {
                    set(true);
                    onIntercept(true);
                }
            }

            observer.observe(element)
        }
    })
}