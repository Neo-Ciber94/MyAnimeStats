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

    /**
     * A value that may be null.
     */
    export type Nullable<T> = T | null | undefined;
}

// View transitions 
export global {

    export interface CSSStyleDeclaration {
        /**
         * The view-transition-name CSS property provides the selected element with a distinct identifying name 
         * (a <custom-ident>) and causes it to participate in a separate view transition 
         * from the root view transition — or no view transition if the none value is specified.
         */
        viewTransitionName?: string;
    }

    export interface Document {
        /**
         * The startViewTransition() method of the View Transitions API starts a new view transition 
         * and returns a ViewTransition object to represent it.
         * 
         * @param callback A callback function typically invoked to update the DOM during the view transition process, 
         * which returns a Promise. The callback is invoked once the API has taken a screenshot of the current page. 
         * When the promise returned by the callback fulfills, the view transition begins in the next frame. 
         * If the promise returned by the callback rejects, the transition is abandoned.
         */
        startViewTransition?(callback: () => Promise<unknown>);
    }
}
