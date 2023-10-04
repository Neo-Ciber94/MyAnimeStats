/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Returns the methods for handling a promise lazily.
 */
export function deferred<T, TError = unknown>() {
	let resolve = (value: T) => {
		/* empty */
	};
	let reject = (reason: TError) => {
		/* empty */
	};

	const promise = new Promise<T>((resolveFn, rejectFn) => {
		resolve = resolveFn;
		reject = rejectFn;
	});

	return { promise, resolve, reject };
}

export function delay(ms: number): Promise<void> {
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
