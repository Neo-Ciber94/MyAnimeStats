// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Session } from "@animelist/auth-sveltekit/client";

declare global {
	namespace App {
		// interface Error {}
		// interface PageData {}

		interface Locals {
			session?: Session | null;
		}

		interface Platform {
			env: {
				KV_STORE: KVNamespace;
			};
		}
	}
}

export { };
