/**
 * A function used to set a value.
 */
export type SetValue<T> = T | ((prev: T) => T);
