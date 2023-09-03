import { get, writable } from "svelte/store";
import type { z } from "zod";

type UseZodSearchParamsOptions = {
    ignoreEmptyStrings?: boolean;
    ignoreEmptyArray?: boolean;
    ignoreFalse?: boolean;
}

export function useZodSearchParams<S extends z.AnyZodObject>(schema: S, initialValue?: z.infer<S>, opts?: UseZodSearchParamsOptions) {
    type TValue = z.infer<S>;

    const searchParamStore = writable<TValue>(initialValue);

    function set(value: TValue) {
        const result = schema.safeParse(value);
        if (result.success) {
            replaceWindowSearchParams(result.data, opts);
        } else {
            console.error(result.error);
        }
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
        const obj = parseSearchParams(searchParams, schema);
        const result = schema.safeParse(obj);

        if (result.success) {
            searchParamStore.set(result.data);
        } else {
            console.error(result.error);
        }
    }

    initialize();

    return {
        set,
        update,
        subscribe: searchParamStore.subscribe,
    }
}

// https://github.com/colinhacks/zod/discussions/1763
export function parseSearchParams<SchemaType extends z.ZodRawShape>(
    searchParams: URLSearchParams,
    schema: z.ZodObject<SchemaType>,
) {
    const rawValues: Record<string, Array<string> | string> = {}
    const schemaProps = schema._def.shape()
    for (const key of searchParams.keys()) {
        const values = searchParams.getAll(key)
        const propSchema = schemaProps[key]
        if (propSchema && values.length === 1 && !isExpectingArray(propSchema)) {
            rawValues[key] = values[0]
        } else {
            rawValues[key] = values
        }
    }

    return schema.parse(rawValues)
}

function isExpectingArray(schema?: z.ZodTypeAny): boolean {
    if (!schema?._def) return false

    const { typeName } = schema._def
    if (typeName === 'ZodArray') return true
    if (['ZodUnion', 'ZodIntersection'].includes(typeName)) {
        return schema._def.options.some(isExpectingArray)
    }
    if (['ZodOptional', 'ZodNullable', 'ZodDefault'].includes(typeName)) {
        return isExpectingArray(schema._def.innerType)
    }
    if (typeName === 'ZodLazy') {
        return isExpectingArray(schema._def.getter())
    }
    return false
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
