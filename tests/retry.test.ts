import { Retry, runAndRetryOnThrow } from '@/lib/utils/retry';
import { expect, test, describe } from 'vitest';

function runAndThrow(successAfterRun: number, returnValue: string) {
	let count = 0;
	return () => {
		count += 1;

		if (count === successAfterRun) {
			return returnValue;
		}

		throw new Error('failed');
	};
}

describe('runAndRetryOnThrow tests', () => {
	test('Retry.fixed', async () => {
		await expect(
			runAndRetryOnThrow(runAndThrow(3, 'red fire'), Retry.fixed({ attends: 3, interval: 200 }))
		).resolves.toStrictEqual('red fire');
	});

	test('Retry.fixed throw', async () => {
		await expect(
			runAndRetryOnThrow(runAndThrow(3, 'red fire'), Retry.fixed({ attends: 2, interval: 200 }))
		).rejects.toBeTruthy();
	});

	test('Retry.exponential', async () => {
		await expect(
			runAndRetryOnThrow(runAndThrow(5, 'orange'), Retry.exponential({ factorMs: 10 }))
		).resolves.toStrictEqual('orange');
	});

	test('Retry.random', async () => {
		await expect(
			runAndRetryOnThrow(runAndThrow(3, 'green'), Retry.random({ max: 1000 }))
		).resolves.toStrictEqual('green');
	});
});
