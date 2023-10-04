import { invariant } from './invariant';
import { delay } from './promises';

/**
 * A function to determine if retry a function.
 */
export type RetryFunction = (retryCount: number, err: unknown) => Promise<boolean> | boolean;

/**
 * Run a function and retry if fails.
 * @param f The function to execute.
 * @param retryFn The function used to decide whether to retry the function.
 * @returns The result value if succeeded.
 */
export async function runAndRetryOnThrow<T>(
	f: () => Promise<T> | T,
	retryFn: RetryFunction,
	log = true
): Promise<T> {
	let retryCount = 0;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		try {
			const result = f();
			return result;
		} catch (err) {
			retryCount += 1;

			if (log) {
				console.error(`❌ Retrying... ${retryCount}`);
			}

			const shouldRetry = await Promise.resolve(retryFn(retryCount, err));
			if (!shouldRetry) {
				throw err;
			}
		}
	}
}

export abstract class Retry {
	private constructor() {
		/** */
	}

	/**
	 * Returns a retry function that retries in a fixed interval.
	 */
	static fixed({ attends, interval }: { attends: number; interval?: number }): RetryFunction {
		invariant(attends > 0, 'attends must be positive');

		return async (retryCount) => {
			if (retryCount >= attends) {
				return false;
			}

			if (interval) {
				await delay(interval);
			}

			return true;
		};
	}

	/**
	 * Returns a retry function that retry exponentially.
	 */
	static exponential({
		start = 1,
		factorMs = 1000,
		attends
	}: { start?: number; factorMs?: number; attends?: number } = {}): RetryFunction {
		invariant(start >= 1, 'start must be greater than 0');

		return async (retryCount) => {
			if (attends != null && retryCount >= attends) {
				return false;
			}

			const delayMs = Math.pow(2, start++) * factorMs;
			await delay(delayMs);
			return true;
		};
	}

	/**
	 * Returns a retry function that retries in a random min-max milliseconds range.
	 */
	static random({
		min = 0,
		max,
		attends
	}: {
		min?: number;
		max: number;
		attends?: number;
	}): RetryFunction {
		invariant(min < max, 'min should be lower than max');

		return async (retryCount) => {
			if (attends != null && retryCount >= attends) {
				return false;
			}

			const retryMs = Math.random() * (max - min) + min;
			await delay(retryMs);
			return true;
		};
	}
}
