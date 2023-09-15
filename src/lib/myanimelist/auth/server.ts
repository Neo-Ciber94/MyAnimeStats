import { MY_ANIME_LIST_CLIENT_ID, MY_ANIME_LIST_CLIENT_SECRET } from '$env/static/private';
import { z } from 'zod';
import CryptoES from 'crypto-es';
import * as jose from 'jose';

const MY_ANIME_LIST_OAUTH2_URL = "https://myanimelist.net/v1/oauth2";

/**
 * Options to create the authentication url.
 */
export interface GetAuthenticationUrlOptions {
    /**
     * The url to redirect after authentication.
     * 
     * This should be set in your https://myanimelist.net/apiconfig
     */
    redirectTo?: string;

    /**
     * A minimum length of 43 characters and a maximum length of 128 characters.
     * 
     * @see 
     * This is generated automatically, you do not require to set it manually.
     */
    codeVerifier?: string;
}

/**
 * The options to get the token.
 */
export interface GetTokenOptions {
    /**
     * The authorization code returned from the initial request. Normally, this value is nearly 1,000 bytes long.
     */
    code: string,

    /**
     * The url to redirect after authentication.
     * 
     * This is the same set in your: https://myanimelist.net/apiconfig
     */
    redirectTo?: string;

    /**
     * A minimum length of 43 characters and a maximum length of 128 characters.
     * 
     * @see 
     * In case you generated your url with a manual code, you need to use the same code here.
     */
    codeVerifier: string;
}

export interface RefreshTokenOptions {
    refreshToken: string;
}

export interface GetUserProfileOptions {
    accessToken: string;
}

/**
 * Utilities for authenticate with `MyAnimeList`.
 * 
 * @see https://myanimelist.net/apiconfig/references/authorization
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Auth {
    /**
     * Create an `OAuth2` authentication url for myanimelist.
     * 
     * @see https://myanimelist.net/apiconfig/references/authorization#obtaining-oauth-2.0-access-tokens
     */
    export function getAuthenticationUrl(options: GetAuthenticationUrlOptions) {
        const { redirectTo } = options;
        const state = crypto.randomUUID();
        const codeChallenge = options.codeVerifier ?? createCodeChallenge();
        const url = new URL(`${MY_ANIME_LIST_OAUTH2_URL}/authorize`);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("client_id", MY_ANIME_LIST_CLIENT_ID);
        url.searchParams.set("code_challenge", codeChallenge)
        url.searchParams.set("code_challenge_method", "plain");
        url.searchParams.set("state", state);

        if (redirectTo) {
            url.searchParams.set("redirect_uri", redirectTo);
        }

        return {
            url: url.toString(),
            codeChallenge,
            state
        }
    }

    /**
     * Authenticate with `MyAnimeList` using the code returned after authentication.
     * @returns Returns the tokens to access the `MyAnimeList` API.
     */
    export async function getToken(options: GetTokenOptions) {
        const { code, redirectTo } = options;
        const url = new URL(`${MY_ANIME_LIST_OAUTH2_URL}/token`);
        const searchParams = new URLSearchParams({
            client_id: MY_ANIME_LIST_CLIENT_ID,
            client_secret: MY_ANIME_LIST_CLIENT_SECRET,
            grant_type: "authorization_code",
            code_verifier: options.codeVerifier,
            code,
        });

        if (redirectTo) {
            searchParams.set('redirect_uri', redirectTo);
        }

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: searchParams
        });

        if (!res.ok) {
            const msg = await res.text();
            console.error(msg);
            throw new Error(msg);
        }

        const responseSchema = z.object({
            token_type: z.literal("Bearer"),
            expires_in: z.number(),
            access_token: z.string(),
            refresh_token: z.string(),
        });

        const json = await res.json();
        return responseSchema.parse(json);
    }

    /**
     * Refresh the access token using a refresh token.
     */
    export async function refreshToken(options: RefreshTokenOptions) {
        const { refreshToken } = options;
        const url = new URL(`${MY_ANIME_LIST_OAUTH2_URL}/token`);
        const searchParams = new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken
        });

        const credentials = Buffer.from(`${MY_ANIME_LIST_CLIENT_ID}:${MY_ANIME_LIST_CLIENT_SECRET}`).toString('base64');

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: searchParams
        });

        if (!res.ok) {
            const msg = await res.text();
            console.error(`${res.status} ${res.statusText} - ${msg}`);
            throw new Error(msg);
        }

        const responseSchema = z.object({
            token_type: z.literal("Bearer"),
            expires_in: z.number(),
            access_token: z.string(),
            refresh_token: z.string(),
        });

        const json = await res.json();
        return responseSchema.parse(json);
    }

    /**
     * Decode the token and returns the user id.
     * @param token The jwt access token returned by MyAnimeList.
     * @returns The user id in the jwt claims.
     */
    export function getUserIdFromToken(token: string): number | null {
        const claims = jose.decodeJwt(token);

        if (claims.sub == null) {
            return null;
        }

        const userId = Number(claims.sub);
        return Number.isNaN(userId) ? null : userId;
    }
}

function generateCodeVerifier(length = 43) {
    if (length < 43 || length > 128) {
        throw new Error("code verifier length must be between 43 and 128 characters");
    }

    // Generate a random string of the specified length
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    let codeVerifier = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        codeVerifier += charset.charAt(randomIndex);
    }

    return codeVerifier;
}

// This code should run both on `node` and the `edge`.
function createCodeChallenge(length = 43) {
    const codeVerifier = generateCodeVerifier(length);

    // Calculate the SHA-256 hash of the code verifier
    const hash = CryptoES.SHA256(codeVerifier).toString();

    const hashBase64 = btoa(hash)
        .replace('+', '-')
        .replace('/', '_')
        .replace(/=+$/, '');

    return hashBase64;
}
