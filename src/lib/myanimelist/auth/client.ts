import { z } from "zod";
import type { User } from "../common/user";

const userTokenSchema = z.object({
    accessToken: z.string(),
    expiresAt: z.string().pipe(z.coerce.date())
});

export type UserToken = z.infer<typeof userTokenSchema>;

export interface GetUserOptions {
    accessToken: string;
    reverseProxyUrl?: string;
}

function getAuthUrl() {
    return process.env.MY_ANIME_STATS_AUTH_URL ?? "/api/auth";
}

export function signIn() {
    window.location.href = `${window.location.origin}/${getAuthUrl()}/sign-in`
}

export function signOut() {
    window.location.href = `${window.location.origin}/${getAuthUrl()}/sign-out`
}

export async function getUserToken(): Promise<UserToken | null> {
    const res = await fetch(`${getAuthUrl()}/session`);

    if (!res.ok) {
        const msg = await res.text();
        console.error(msg);
        return null;
    }

    const userToken = userTokenSchema.parse(await res.json());
    return userToken;
}

export async function getUser(options: GetUserOptions) {
    const { accessToken } = options;
    const res = await fetch(`/api/myanimelist/users/@me?fields=anime_statistics`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!res.ok) {
        const msg = await res.text();
        console.error(msg);
        throw new Error(msg);
    }

    return await res.json() as User;
}