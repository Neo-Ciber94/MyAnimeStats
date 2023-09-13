import { dev } from "$app/environment";
import { getSession } from "$lib/myanimelist/auth/client";
import type { User } from "$lib/myanimelist/common/user";
import { get, writable } from "svelte/store";
import { signIn as clientSignIn, signOut as clientSignOut } from '$lib/myanimelist/auth/client';
import { deleteCookie, setCookie } from "@/lib/utils/cookies";
import cookie from 'cookie';
import { invalidateAll } from "$app/navigation";

const COOKIE_INIT_SESSION = 'init-session';

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

type InitializeSession = Omit<SessionState, 'loading'>;

function setUserSession(session: InitializeSession | null) {
    if (session) {
        sessionStore.set({
            loading: false,
            accessToken: session.accessToken,
            user: session.user
        })
    } else {
        sessionStore.set({
            loading: false,
            accessToken: null,
            user: null
        });
    }
}

async function fetchUserSession() {
    try {
        // Set state to loading
        const currentSession = get(sessionStore);
        sessionStore.set({
            loading: true,
            accessToken: currentSession.accessToken,
            user: currentSession.user
        });

        // fetch the current user session
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

async function initialize(session?: InitializeSession | null) {
    const hasUser = get(sessionStore).user != null;

    if (initialized === true && !hasUser) {
        return;
    }

    if (typeof window === 'undefined') {
        return;
    }

    initialized = true;
    const cookies = cookie.parse(document.cookie);

    // If the init cookie is set, we refetch the session
    if (cookies[COOKIE_INIT_SESSION]) {
        deleteCookie(COOKIE_INIT_SESSION);
        await fetchUserSession();
        await invalidateAll();
    }
    // If not undefined we set the session
    else if (session !== undefined) {
        setUserSession(session);
    }
    // By default we just fetch the session
    else {
        await fetchUserSession();
    }
}

function signIn() {
    setCookie(COOKIE_INIT_SESSION, '1', { maxAge: 60 * 60 * 15 });
    clientSignIn();
}

function signOut() {
    clientSignOut();

    sessionStore.set({
        user: null,
        accessToken: null,
        loading: false
    })
}

export default {
    initialize,
    signIn,
    signOut,
    subscribe: sessionStore.subscribe,
    get current() {
        return get(sessionStore);
    }
}
