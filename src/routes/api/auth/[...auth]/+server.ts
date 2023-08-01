import { error, redirect, type Cookies } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getServerUrl } from '$lib/utils/getServerUrl';
import { Auth } from '$lib/myanimelist/auth/server';

const AUTH_SESSION = 'auth-session';

export const GET = (async ({ url, params, cookies }) => {
	const path = "/" + params.auth;

	switch (path) {
		case '/callback': {
			await handleCallback(url, cookies);
			break;
		}
		case '/session': {
			return handleSession(cookies);
		}
		case '/sign-in': {

			const redirectTo = `${getServerUrl()}/api/auth/callback`;
			const { url, state } = Auth.getAuthenticationUrl({ redirectTo });
			cookies.set("auth.csrf", state, {
				path: "/",
				httpOnly: true,
				maxAge: 60 * 3, // 3min
			});

			throw redirect(307, url);
		}
		case '/sign-out': {
			cookies.delete(AUTH_SESSION, {
				path: '/'
			})
			throw redirect(307, '/');
		}
		default:
			throw error(404)
	}

	throw error(404)

}) satisfies RequestHandler;

async function handleSession(cookies: Cookies) {
	const refreshToken = cookies.get(AUTH_SESSION);

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

	return Response.json({
		accessToken,
		expiresAt
	})
}

async function handleCallback(url: URL, cookies: Cookies) {
	const searchParams = url.searchParams;
	const code = searchParams.get('code');
	const state = searchParams.get('state');

	if (code == null) {
		throw error(401, "No oauth2 code was received");
	}

	const csrf = cookies.get("auth.csrf");
	cookies.delete("auth.csrf"); // We delete the old csrf code

	if (state == null || state != csrf) {
		throw error(401, "Invalid auth state");
	}

	// TODO: Check state
	console.log({ url, code, state });
	const result = await Auth.getToken({ code, redirectTo: `${getServerUrl()}/api/auth/callback` });
	console.log({ result });

	cookies.set(AUTH_SESSION, result.refresh_token, {
		path: '/',
		maxAge: 60 * 60 * 24 * 7, // 7 days
		httpOnly: true,
		sameSite: 'strict'
	});

	throw redirect(307, '/');
}