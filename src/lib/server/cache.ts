/* eslint-disable @typescript-eslint/no-namespace */
import { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } from '$env/static/private';
import { Redis } from '@upstash/redis/cloudflare';
import type { SetCommandOptions } from '@upstash/redis/types/pkg/commands/set';

const redis = new Redis({
	url: UPSTASH_REDIS_REST_URL,
	token: UPSTASH_REDIS_REST_TOKEN
});

export namespace RedisService {
	export async function get<T = unknown>(key: string): Promise<T | null> {
		try {
			const result = await redis.get(key);

			if (result == null) {
				return null;
			}

			return result as T;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	export async function* scan<T = unknown>(prefix: string) {
		let cursor = 0;

		try {
			while (true) {
				const [cursorString, keys] = await redis.scan(cursor, {
					match: prefix
				});

				for (const key of keys) {
					const json = await redis.get<T>(key);
					yield json;
				}

				cursor = Number(cursorString);

				if (Number.isNaN(cursor) || cursor === 0) {
					break;
				}
			}
		} catch (err) {
			console.error(err);
			yield* [] as T[];
		}
	}

	export async function getAll<T = unknown>(prefix: string) {
		const result: unknown[] = [];

		for await (const value of scan<T>(prefix)) {
			if (value) {
				result.push(value);
			}
		}

		return result;
	}

	export async function set(key: string, value: unknown, opts?: SetCommandOptions | undefined) {
		try {
			const result = await redis.set(key, value, opts);

			if (result == null) {
				return null;
			}

			return result;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	export async function del(key: string) {
		try {
			const result = await redis.del(key);

			if (result == null) {
				return null;
			}

			return result;
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}
