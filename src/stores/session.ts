import { dev } from "$app/environment";
import { getSession } from "$lib/myanimelist/auth/client";
import type { User } from "$lib/myanimelist/common/user";
import { get, writable } from "svelte/store";

let initialized = false;

export type SessionState = {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
}

const sessionStore = writable<SessionState>({
    user: null,
    accessToken: null,
    loading: false
});


async function initialize(init?: Omit<SessionState, 'loading'>) {
    if (typeof window === 'undefined' || initialized === true) {
        return;
    }

    initialized = true;

    if (init) {
        return sessionStore.set({
            loading: false,
            accessToken: init.accessToken,
            user: init.user
        })
    } else {
        sessionStore.set({ loading: true, accessToken: null, user: null });
    }

    try {
        const session = await getSession();

        if (session == null) {
            return sessionStore.set({ loading: false, accessToken: null, user: null });
        }

        if (dev) {
            console.log("🍥 User session loaded: ", JSON.stringify(session, null, 2));
        }

        // Currently the expiration of the access token is 31 days, which is really long,
        // so we don't have reason to refresh it, each time the user log in a new token will be created.
        const { accessToken, user } = session;
        sessionStore.set({ user, accessToken, loading: false })
    }
    catch (err) {
        console.error(err);
        initialized = false;
        sessionStore.set({ user: null, accessToken: null, loading: false })
    }
}

export default {
    initialize,
    subscribe: sessionStore.subscribe,
    get current() {
        return get(sessionStore);
    }
}
