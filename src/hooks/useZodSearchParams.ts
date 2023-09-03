import { get, writable } from "svelte/store";
import type { z } from "zod";

type UseZodSearchParamsOptions = {
    ignoreEmptyStrings?: boolean;
    ignoreEmptyArray?: boolean;
    ignoreFalse?: boolean;
}

export function useZodSearchParams<S extends z.AnyZodObject>(schema: S, initialValue: z.infer<S>, opts?: UseZodSearchParamsOptions) {
    type TValue = z.infer<S>;

    const searchParamStore = writable<TValue>(initialValue);

    function set(value: TValue) {
        const obj = schema.parse(value);
        replaceWindowSearchParams(obj, opts);
    }

    function update(updater: (prev: TValue) => TValue) {
        const newValue = updater(get(searchParamStore));
        set(newValue);
    }

    function initialize() {
        if (typeof window === 'undefined') {
            return;
        }

        const { searchParams } = new URL(window.location.href);
        const obj = Object.fromEntries(searchParams);
        const value = schema.parse(obj);
        searchParamStore.set(value);
    }

    initialize();

    return {
        set,
        update,
        subscribe: searchParamStore.subscribe,
    }
}

function replaceWindowSearchParams(obj: Record<string, unknown>, opts?: UseZodSearchParamsOptions) {
    if (typeof window === 'undefined') {
        return;
    }

    const { ignoreEmptyStrings = false, ignoreFalse = false, ignoreEmptyArray = false } = opts || {};
    const newUrl = new URL(window.location.href);

    // clean up current params
    const keys = newUrl.searchParams.keys();
    for (const k of keys) {
        newUrl.searchParams.delete(k);
    }

    // set new params
    for (const [key, value] of Object.entries(obj)) {
        if (value != null) {
            if (Array.isArray(value)) {
                if (ignoreEmptyArray && value.length === 0) {
                    continue;
                }

                value.forEach(x => {
                    const s = String(x);
                    if ((ignoreEmptyStrings && s.length === 0) || (ignoreFalse && x === false)) {
                        return;
                    }

                    newUrl.searchParams.append(key, s);
                })
            } else {
                const s = String(value);

                if ((ignoreFalse && value === false) || (ignoreEmptyStrings && s.length === 0)) {
                    continue;
                }

                newUrl.searchParams.set(key, s);
            }
        }
    }

    // update the page url
    const path = newUrl.toString();
    window.history.pushState({ path }, '', path);
}
