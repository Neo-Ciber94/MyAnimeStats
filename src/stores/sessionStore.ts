import { getSessionToken, getUser, type User } from "$lib/myanimelist/auth/client";
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
    loading: true
});

async function initialize() {
    if (initialized === true) {
        throw new Error("use store initialization was already called");
    }

    initialized = true;

    sessionStore.set({ loading: true, accessToken: null, user: null });
    const session = await getSessionToken();

    if (session == null) {
        return sessionStore.set({ loading: false, accessToken: null, user: null });
    }

    // Currently the expiration of the access token is 31 days, which is really long,
    // so we don't have reason to refresh it, each time the user log in a new token will be created.
    const { accessToken } = session;
    console.log("🍥 User session loaded: ", JSON.stringify(session, null, 2));
    const user = await getUser({ accessToken });
    console.log("🍙 User loaded: ", JSON.stringify(user, null, 2));

    sessionStore.set({ user, accessToken, loading: false })
}

export default {
    initialize,

    subscribe: sessionStore.subscribe,

    get session() {
        return get(sessionStore);
    }
}

