/* eslint-disable @typescript-eslint/no-explicit-any */
import type { z } from "zod";


let GLOBAL_KV: KVNamespace | null;

export class KV {
    private constructor(private readonly kv: KVNamespace) { }

    static current() {
        if (GLOBAL_KV == null) {
            throw new Error("KVNamespace was not set, `KV.current()` should be called on the server inside a `load` function or hook");
        }

        return new KV(GLOBAL_KV);
    }

    async get<S extends z.ZodObject<any>>(key: string, schema: S): Promise<z.infer<S> | null> {
        const json = await this.kv.get(key);

        if (json == null) {
            return null;
        }

        try {
            const parsed = JSON.parse(json);
            const result = schema.parse(parsed);
            return result as z.infer<S>;
        }
        catch {
            return null;
        }
    }

    async set<S extends z.ZodObject<any>>(key: string, schema: S, value: z.infer<S>) {
        const json = JSON.stringify(value);
        await this.kv.put(key, json);
    }

    async remove(key: string) {
        await this.kv.delete(key);
    }
}

export function initializeKv(kv: KVNamespace) {
    GLOBAL_KV = kv;
}

export function cleanUpKv() {
    GLOBAL_KV = null;
}