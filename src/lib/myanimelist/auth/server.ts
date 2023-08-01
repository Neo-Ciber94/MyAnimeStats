import { MY_ANIME_LIST_CLIENT_ID, MY_ANIME_LIST_CLIENT_SECRET } from '$env/static/private';
import crypto from 'node:crypto';
import { z } from 'zod';

const MY_ANIME_LIST_OAUTH2_URL = "https://myanimelist.net/v1/oauth2";
const CODE_VERIFIER = createCodeVerifier();

export interface GetAuthenticationUrlOptions {
    redirectTo?: string;
}

export interface GetTokenOptions {
    code: string,
    redirectTo?: string;
}

export interface RefreshTokenOptions {
    refreshToken: string;
}

export interface GetUserProfileOptions {
    accessToken: string;
}

/**
 * Utilities for authenticate with `MyAnimeList`.
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

        const url = new URL(`${MY_ANIME_LIST_OAUTH2_URL}/authorize`);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("client_id", MY_ANIME_LIST_CLIENT_ID);
        url.searchParams.set("code_challenge", CODE_VERIFIER)
        url.searchParams.set("code_challenge_method", "plain");
        url.searchParams.set("state", state);

        if (redirectTo) {
            url.searchParams.set("redirect_uri", redirectTo);
        }

        return {
            url: url.toString(),
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
            code_verifier: CODE_VERIFIER,
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
            // const msg = await getResponseError(res) ?? res.statusText;
            // console.log(await res.text());
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
}

function createCodeVerifier(length = 64) {
    if (length < 43 || length > 128) {
        throw new Error("code verifier length must be between 43 and 128 characters");
    }

    const characters = crypto.randomBytes(length).toString('ascii');

    const base64Digest = crypto
        .createHash("sha256")
        .update(characters)
        .digest("base64");

    return base64Digest
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}