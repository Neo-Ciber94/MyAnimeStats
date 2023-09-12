import * as jose from 'jose';
import { SECRET_KEY } from "$env/static/private";
import { DEFAULT_SESSION_DURATION_SECONDS } from "./handle";
import { error, type Cookies } from '@sveltejs/kit';

export const AUTH_SESSION_COOKIE = 'myanimestats.session';
export const AUTH_CSRF_COOKIE = 'myanimestats.csrf';
export const AUTH_CODE_CHALLENGE_COOKIE = 'myanimestats.code_challenge';
export const AUTH_ACCESS_TOKEN_COOKIE = 'myanimestats.access_token';

const MY_ANIME_STATS_AUDIENCE = "myanimestats";
const MY_ANIME_STATS_ISSUER = "myanimestats";

export type AuthenticatedUser = {
    userId: number;
    refreshToken: string;
    accessToken: string;
}

function getSecretKey() {
    const encoder = new TextEncoder();
    const key = encoder.encode(SECRET_KEY);
    return key;
}

/**
 * Generate a jwt from the refreshToken returned from MyAnimeList to validate in our server.
 * 
 * @param userId the user id.
 * @param refreshToken The MyAnimeList refresh token.
 * @returns A jwt token with the refresh token and user id.
 */
export async function generateJwt(userId: number, refreshToken: string): Promise<string> {
    const signJwt = new jose.SignJWT({ refreshToken, sub: String(userId) })
        .setExpirationTime(Date.now() + DEFAULT_SESSION_DURATION_SECONDS)
        .setAudience(MY_ANIME_STATS_AUDIENCE)
        .setIssuer(MY_ANIME_STATS_ISSUER)
        .setProtectedHeader({ alg: 'HS256' })

    const key = getSecretKey();
    const jwt = await signJwt.sign(key);
    return jwt;
}

/**
 * Verify the session and return the MyAnimeList refresh token and user id.
 * @param cookies The cookies to extract the user token.
 * @returns The user refresh token and user id.
 */
export async function getServerSession(cookies: Cookies): Promise<AuthenticatedUser | null> {
    const key = getSecretKey();

    const sessionToken = cookies.get(AUTH_SESSION_COOKIE);
    const accessToken = cookies.get(AUTH_ACCESS_TOKEN_COOKIE);

    if (sessionToken == null) {
        console.warn("session token is null");
        return null;
    }

    if (accessToken == null) {
        console.warn("access token is null");
        return null;
    }

    try {
        const result = await jose.jwtVerify(sessionToken, key, {
            audience: MY_ANIME_STATS_AUDIENCE,
            issuer: MY_ANIME_STATS_ISSUER
        });

        const { payload: { refreshToken, sub } } = result;
        const userId = Number(sub)

        if (typeof refreshToken !== 'string') {
            console.error(`invalid refresh token: '${refreshToken}'`);
            return null;
        }

        if (Number.isNaN(userId)) {
            console.error(`Invalid user id: '${userId}'`);
            return null;
        }

        return { refreshToken, userId, accessToken }
    }
    catch (err) {
        console.error(err);
        return null;
    }

}

/**
 * Verify the session and returns the user id and refresh token, if the user is not authenticated throws 401.
 * @param cookies The cookies to extract the user token.
 * @param message The error message to show when the user is not authenticated. Defaults to `"unable to get user session"`.
 * @returns The user refresh token and id.
 */
export async function getRequiredServerSession(cookies: Cookies, message = "unable to get user session"): Promise<AuthenticatedUser> {
    const session = await getServerSession(cookies);

    if (session == null) {
        throw error(401, message);
    }

    return session;
}