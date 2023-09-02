export { }

export global {
    /**
     * Represents a `JSON` object.
     */
    export type JsonObject = {
        [key: string]: JSONValue;
    }

    /**
     * Represents a `JSON` array.
     */
    export type JsonArray = Array<JsonValue>;

    /**
     * Represents a `JSON` value.
     */
    export type JsonValue = JsonObject | JsonArray | string | number | boolean | null | undefined;
}