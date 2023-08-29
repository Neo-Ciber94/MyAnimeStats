import { get as getStoreValue, writable } from "svelte/store";

type Primitive = string | number | boolean | null | undefined;

type Query = Record<string, Primitive>;

export function useSearchParams<Q extends Query = Query>(initialValue?: Q) {
    const searchParamStore = writable<Q>({} as Q);

    function set(newQuery: Q) {
        searchParamStore.set(newQuery);;
        const newUrl = new URL(window.location.href);

        // Remove prev search params
        const keys = Array.from(newUrl.searchParams.keys());
        for (const k of keys) {
            newUrl.searchParams.delete(k);
        }

        // Set new search params
        for (const [key, value] of Object.entries(newQuery)) {
            if (value != null) {
                newUrl.searchParams.set(key, String(value));
            }
        }

        const path = newUrl.toString();
        window.history.pushState({ path }, '', path);
    }

    function update(updater: (prev: Q) => Q) {
        const prev = getStoreValue(searchParamStore);
        const newValue = updater(prev);
        set(newValue);
    }

    function remove(name: keyof Q) {
        const obj = getStoreValue(searchParamStore);
        delete obj[name];
        set(obj);
    }

    function clear() {
        set({} as Q)
    }

    function get() {
        return getStoreValue(searchParamStore);
    }

    if (typeof window !== 'undefined') {
        if (initialValue) {
            set(initialValue)
        } else {
            const { searchParams } = new URL(window.location.href);

            const obj: Record<string, string> = {};
            for (const [key, value] of searchParams.entries()) {
                obj[key] = value;
            }

            searchParamStore.set(obj as Q);
        }
    }

    return {
        set,
        get,
        clear,
        update,
        remove,
        subscribe: searchParamStore.subscribe
    }
}