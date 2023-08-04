import { error, redirect, type RequestEvent } from "@sveltejs/kit";
import { Auth } from "../auth/server";
import { getApiUrl } from "../common/getApiUrl";
import { MALClient } from "../api";

export const MY_ANIME_LIST_API_URL = "https://api.myanimelist.net/v2";
export const AUTH_SESSION_COOKIE = 'myanimestats.session';
export const AUTH_CSRF_COOKIE = 'myanimestats.csrf';
export const DEFAULT_SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days;

const ALLOWED_FORWARD_HEADERS = [
    "Authorization",
    "X-MAL-CLIENT-ID",
    "Content-Type"
]

// type MyAnimeListAuthToken = Awaited<ReturnType<typeof Auth.getToken>>;

// type AuthCallbacks = {
//     onSignIn?: () => void,
//     onSignOut?: () => void,
//     onCallback?: () => void,
//     onToken?: () => void,
//     onSession?: () => void,
// }

export interface MyAnimeListHandlerOptions {
    auth?: {
        sessionDurationSeconds?: number;
    }
}

export function MyAnimeListHandler(options: MyAnimeListHandlerOptions = {}) {
    const { auth = {} } = options;
    const { sessionDurationSeconds = DEFAULT_SESSION_DURATION_SECONDS } = auth;
    const apiUrl = getApiUrl();
    const authPath = `${apiUrl}/auth`;

    if (apiUrl.endsWith("/")) {
        throw new Error(`api url cannot end with '/'`);
    }

    return async (event: RequestEvent): Promise<Response> => {
        const pathname = event.url.pathname;

        if (!startsWithPathSegment(pathname, apiUrl)) {
            throw new Error(`Invalid url pathname, expected path starting with ${apiUrl}`);
        }

        if (startsWithPathSegment(pathname, authPath)) {
            const action = pathname.slice(authPath.length);
            return handleAuth(event, {
                action,
                apiUrl,
                sessionDurationSeconds
            });
        }

        return proxyRequestToMyAnimeListAPI(apiUrl, event);
    }
}

type HandleAuthOptions = {
    action: string,
    apiUrl: string,
    sessionDurationSeconds: number,
}

async function handleAuth(event: RequestEvent, options: HandleAuthOptions) {
    const { action, apiUrl, sessionDurationSeconds } = options;
    const originUrl = `${event.url.origin}${apiUrl}/auth`;

    switch (action) {
        case '/sign-in': {
            const redirectTo = `${originUrl}/callback`;
            console.log({ redirectTo });
            const { url, state } = Auth.getAuthenticationUrl({ redirectTo });
            event.cookies.set(AUTH_CSRF_COOKIE, state, {
                path: "/",
                httpOnly: true,
                maxAge: sessionDurationSeconds
            });

            throw redirect(307, url);
        }
        case '/sign-out': {
            event.cookies.delete(AUTH_SESSION_COOKIE, { path: "/" })
            event.cookies.delete(AUTH_CSRF_COOKIE, { path: "/" });
            throw redirect(307, '/');
        }
        case '/callback': {
            const url = event.url;
            const searchParams = url.searchParams;
            const code = searchParams.get('code');
            const state = searchParams.get('state');

            if (code == null) {
                throw error(401, "No oauth2 code was received");
            }

            const csrf = event.cookies.get(AUTH_CSRF_COOKIE);

            if (state == null || state != csrf) {
                throw error(401, "Invalid auth state");
            }

            console.log({ url: url.toString(), code, state });
            const tokens = await Auth.getToken({ code, redirectTo: `${originUrl}/callback` });
            console.log({ tokens });

            event.cookies.set(AUTH_SESSION_COOKIE, tokens.refresh_token, {
                path:  "/",
                maxAge: sessionDurationSeconds,
                httpOnly: true,
                sameSite: 'strict'
            });

            throw redirect(307, '/');
        }
        case '/token': {
            const { accessToken, expiresAt } = await getAuthToken(event);
            return Response.json({ accessToken, expiresAt })
        }
        case '/session': {
            const { accessToken, expiresAt } = await getAuthToken(event);
            const includeStatistics = event.url.searchParams.get('include_anime_statistics') === "true";

            const malClient = new MALClient({ accessToken });
            const user = await malClient.getMyUserInfo({
                fields: includeStatistics ? ['anime_statistics'] : []
            });

            return Response.json({
                user,
                accessToken,
                expiresAt
            })
        }
        default: {
            console.error(`❌ Invalid auth action: ${action}`);
            throw error(404)
        }
    }
}

async function getAuthToken(event: RequestEvent) {
    const refreshToken = event.cookies.get(AUTH_SESSION_COOKIE);

    if (refreshToken == null) {
        throw error(401);
    }

    const { access_token: accessToken, expires_in } = await Auth.refreshToken({ refreshToken });

    // OAuth2 expires_in is in seconds
    // https://www.rfc-editor.org/rfc/rfc6749#section-5.1
    const accessTokenExpiresMs = expires_in * 1000;

    // Keep in mind some delay could exists in the time, so we should consider the token
    // will expire before the actual expiration date.
    const expiresAt = new Date(accessTokenExpiresMs + Date.now());

    return { accessToken, expiresAt }
}

async function proxyRequestToMyAnimeListAPI(apiUrl: string, event: RequestEvent) {
    const forwardHeaders: Record<string, string> = {};

    for (const [key, value] of event.request.headers.entries()) {
        if (ALLOWED_FORWARD_HEADERS.includes(key)) {
            forwardHeaders[key] = value;
        }
    }

    const path = event.url.toString().slice(apiUrl.length);
    const myAnimeListApiUrl = `${MY_ANIME_LIST_API_URL}/${path}`

    // 🍥 GET: https://api.example.com/users
    console.log(`🍥 ${event.request.method}: ${myAnimeListApiUrl}`)

    const res = await event.fetch(path, {
        method: event.request.method,
        body: event.request.body,
        headers: forwardHeaders,
        signal: event.request.signal,
        cache: event.request.cache,
        credentials: event.request.credentials,
        integrity: event.request.integrity,
        keepalive: event.request.keepalive,
        mode: event.request.mode,
        redirect: event.request.redirect,
        referrer: event.request.referrer,
        referrerPolicy: event.request.referrerPolicy
    });

    if (!res.ok) {
        // ❌ GET (404) Not Found: https://api.example.com/users
        console.error(`❌ ${event.request.method} (${res.status}) ${res.statusText}: ${myAnimeListApiUrl}`)
    }

    return res;
}

function startsWithPathSegment(pathname: string, other: string) {
    const a = pathname.split("/").filter(x => x.length > 0);
    const b = other.split("/").filter(x => x.length > 0);

    if (a.length < b.length) {
        return false;
    }

    for (let i = 0; i < b.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}