// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { User } from "./lib/myanimelist/common/user";

declare global {
	namespace App {
		// interface Error {}
		// interface PageData {}

		interface Locals {
			authenticatedUser?: {
				user: User,
				accessToken: string;
			} | null;
		}

		interface Platform {
			env: {
				KV_STORE: KVNamespace;
			};
		}
	}
}

export { };
