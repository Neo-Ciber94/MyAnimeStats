import type { z } from "zod";

type ParseJsonOptions = {
    returnNullOnFailure?: boolean;
}

export function parseJson<S extends z.ZodType>(schema: S, json: string, opts: { returnNullOnFailure: true }): z.infer<S> | null;
export function parseJson<S extends z.ZodType>(schema: S, json: string, opts?: { returnNullOnFailure?: false }): z.infer<S>;
export function parseJson<S extends z.ZodType>(schema: S, json: string, opts?: ParseJsonOptions): z.infer<S> | null {
    const { returnNullOnFailure = false } = opts || {};

    try {
        const obj = JSON.parse(json);
        const result = schema.parse(obj);
        return result;
    }
    catch (err) {
        if (returnNullOnFailure) {
            return null;
        }

        throw err;
    }
}