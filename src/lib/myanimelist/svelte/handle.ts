import { error, redirect, type Handle, type RequestEvent } from "@sveltejs/kit";
import { Auth } from "../auth/server";
import { getApiUrl } from "../common/getApiUrl";
import { MALClient } from "../api";
import { AUTH_ACCESS_TOKEN_COOKIE, AUTH_CODE_CHALLENGE_COOKIE, AUTH_CSRF_COOKIE, AUTH_SESSION_COOKIE, generateJwt, getServerSession } from "./auth";
import type { User } from "../common/user";

export const MY_ANIME_LIST_API_URL = "https://api.myanimelist.net/v2";
export const DEFAULT_SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days;

const ALLOWED_FORWARD_HEADERS = [
    "Authorization",
    "X-MAL-CLIENT-ID",
    "Content-Type"
]

type OnSessionData = {
    user: User,
    accessToken: string,
    expiresAt: Date
}

export type AuthCallbacks = {
    /**
     * Called after sign-in.
     */
    onSignIn?: (event: RequestEvent) => void,

    /**
     * Called after sign-out.
     */
    onSignOut?: (event: RequestEvent) => void,

    /**
     * Called after the auth callback.
     */
    onCallback?: (event: RequestEvent) => void,

    /**
     * Called after generating a session token.
     */
    onToken?: (event: RequestEvent) => void,

    /**
     * Called after generating an user session.
     */
    onSession?: (session: OnSessionData, event: RequestEvent) => void,

    /**
     * Called before a proxy request.
     * @param event The current request.
     * @param next The proxy request.
     * @returns The response of the request.
     */
    onProxyRequest?: (event: RequestEvent, next: (event: RequestEvent) => Promise<Response>) => Promise<Response>,
}

/**
 * Options for the auth handler.
 */
export interface MyAnimeListHandlerOptions {
    /**
     * Auth options.
     */
    auth?: {
        /**
         * Duration per session, defaults to 7 days.
         */
        sessionDurationSeconds?: number;
    },

    /**
     * Callbacks.
     */
    callbacks?: AuthCallbacks
}

/**
 * Creates a handler for `myanimelist` requests.
 * @param options The options for configure the handler.
 */
export function createMyAnimeListHandler(options: MyAnimeListHandlerOptions = {}): Handle {
    const { auth = {} } = options;
    const { sessionDurationSeconds = DEFAULT_SESSION_DURATION_SECONDS } = auth;
    const apiUrl = getApiUrl();
    const authPath = `${apiUrl}/auth`;

    if (apiUrl.endsWith("/")) {
        throw new Error(`api url cannot end with '/'`);
    }

    return async ({ event, resolve }) => {
        const pathname = event.url.pathname;

        if (!startsWithPathSegment(pathname, apiUrl)) {
            return resolve(event);
        }

        if (startsWithPathSegment(pathname, authPath)) {
            const action = pathname.slice(authPath.length);
            return handleAuth(event, {
                action,
                apiUrl,
                sessionDurationSeconds
            });
        }

        if (options.callbacks?.onProxyRequest) {
            const next = (event: RequestEvent) => proxyRequestToMyAnimeListAPI(apiUrl, event);
            return options.callbacks.onProxyRequest(event, next);
        }

        return proxyRequestToMyAnimeListAPI(apiUrl, event);
    }
}

type HandleAuthOptions = {
    action: string,
    apiUrl: string,
    sessionDurationSeconds: number,
    callbacks?: AuthCallbacks
}

async function handleAuth(event: RequestEvent, options: HandleAuthOptions) {
    const { action, apiUrl, sessionDurationSeconds } = options;
    const originUrl = `${event.url.origin}${apiUrl}/auth`;

    switch (action) {
        case '/sign-in': {
            const redirectTo = `${originUrl}/callback`;
            const { url, state, codeChallenge } = Auth.getAuthenticationUrl({ redirectTo });

            event.cookies.set(AUTH_CSRF_COOKIE, state, {
                path: "/",
                sameSite: 'lax',
                httpOnly: true,
                maxAge: sessionDurationSeconds
            });

            event.cookies.set(AUTH_CODE_CHALLENGE_COOKIE, codeChallenge, {
                path: "/",
                sameSite: 'lax',
                httpOnly: true,
                maxAge: 60 * 15, // 15min
            });

            // sign-in callback
            options.callbacks?.onSignIn?.(event);

            throw redirect(307, url);
        }
        case '/sign-out': {
            event.cookies.delete(AUTH_SESSION_COOKIE, { path: "/" })
            event.cookies.delete(AUTH_CODE_CHALLENGE_COOKIE, { path: "/" });
            event.cookies.delete(AUTH_ACCESS_TOKEN_COOKIE, { path: "/" });

            // sign-out callback
            options.callbacks?.onSignOut?.(event);

            throw redirect(307, '/');
        }
        case '/callback': {
            const url = event.url;
            const searchParams = url.searchParams;
            const code = searchParams.get('code');
            const state = searchParams.get('state');
            const codeChallenge = event.cookies.get(AUTH_CODE_CHALLENGE_COOKIE);

            if (code == null) {
                throw error(401, "No oauth2 code was received");
            }

            if (codeChallenge == null) {
                throw error(401, "No oauth2 code challenge was received");
            }

            const csrf = event.cookies.get(AUTH_CSRF_COOKIE);
            //console.log({ codeChallenge, state, csrf })

            if (state == null || state != csrf) {
                throw error(401, "Invalid auth state");
            }

            const tokens = await Auth.getToken({
                code,
                codeVerifier: codeChallenge,
                redirectTo: `${originUrl}/callback`
            });

            const userId = Auth.getUserIdFromToken(tokens.access_token);

            if (userId == null) {
                throw error(401, "User id not found");
            }

            const sessionToken = await generateJwt(userId, tokens.refresh_token);

            event.cookies.set(AUTH_SESSION_COOKIE, sessionToken, {
                path: "/",
                maxAge: sessionDurationSeconds,
                httpOnly: true,
                sameSite: 'strict'
            });

            const { access_token: accessToken, expires_in } = await Auth.refreshToken({ refreshToken: tokens.refresh_token });

            event.cookies.set(AUTH_ACCESS_TOKEN_COOKIE, accessToken, {
                path: "/",
                maxAge: expires_in,
                httpOnly: true,
                sameSite: 'strict'
            });

            // auth callback
            options.callbacks?.onCallback?.(event);

            throw redirect(307, '/');
        }
        case '/token': {
            const { accessToken, expiresAt } = await getMyAnimeListAuthToken(event);

            // token callback
            options.callbacks?.onToken?.(event);

            return Response.json({ accessToken, expiresAt })
        }
        case '/session': {
            const { accessToken, expiresAt } = await getMyAnimeListAuthToken(event);
            const includeStatistics = event.url.searchParams.get('include_anime_statistics') === "true";

            const malClient = new MALClient({ accessToken });
            const user = await malClient.getMyUserInfo({
                fields: includeStatistics ? ['anime_statistics'] : []
            });

            event.cookies.set(AUTH_ACCESS_TOKEN_COOKIE, accessToken, {
                path: "/",
                maxAge: sessionDurationSeconds,
                httpOnly: true,
                sameSite: 'strict'
            });

            // session callback
            options.callbacks?.onSession?.({ user, accessToken, expiresAt }, event);

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

async function getMyAnimeListAuthToken(event: RequestEvent) {
    const token = event.cookies.get(AUTH_SESSION_COOKIE);

    if (token == null) {
        throw error(401);
    }

    const authenticated = await getServerSession(event.cookies);

    if (authenticated == null) {
        throw error(401);
    }

    const { refreshToken, userId } = authenticated;
    const { access_token: accessToken, expires_in } = await Auth.refreshToken({ refreshToken });

    // OAuth2 expires_in is in seconds
    // https://www.rfc-editor.org/rfc/rfc6749#section-5.1
    const accessTokenExpiresMs = expires_in * 1000;

    // Keep in mind some delay could exists in the time, so we should consider the token
    // will expire before the actual expiration date.
    const expiresAt = new Date(accessTokenExpiresMs + Date.now());

    return { accessToken, expiresAt, userId }
}

async function proxyRequestToMyAnimeListAPI(apiUrl: string, event: RequestEvent) {
    const forwardHeaders: Record<string, string> = {};

    for (const [key, value] of event.request.headers.entries()) {
        if (ALLOWED_FORWARD_HEADERS.some(x => x.toLowerCase() === key.toLowerCase())) {
            forwardHeaders[key] = value;
        }
    }

    const path = event.url.pathname.slice(apiUrl.length);
    const search = event.url.search;
    const myAnimeListApiUrl = `${MY_ANIME_LIST_API_URL}${path}${search}`

    // 🍥 GET: https://api.example.com/users
    console.log(`🍥 ${event.request.method}: ${myAnimeListApiUrl}`)

    const res = await event.fetch(myAnimeListApiUrl, {
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
        referrerPolicy: event.request.referrerPolicy,

        // @ts-expect-error This property is required to send a body
        // https://github.com/nodejs/node/issues/46221#issuecomment-1482439958
        duplex: 'half'
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

