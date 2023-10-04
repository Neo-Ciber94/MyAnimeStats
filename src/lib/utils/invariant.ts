/**
 * Checks the given condition is true.
 * @param condition The condition to check.
 * @param message The error message to check is not null.
 */
export function invariant(condition: unknown, message: string): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}
