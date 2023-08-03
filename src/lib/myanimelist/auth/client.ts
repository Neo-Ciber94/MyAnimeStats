import { z } from "zod";
import type { User } from "../common/user";
import { getApiUrl } from "../common/getApiUrl";

const userTokenSchema = z.object({
    accessToken: z.string(),
    expiresAt: z.string().pipe(z.coerce.date())
});

export type UserToken = z.infer<typeof userTokenSchema>;


export function signIn() {
    window.location.href = `${window.location.origin}${getApiUrl()}/auth/sign-in`
}

export function signOut() {
    window.location.href = `${window.location.origin}${getApiUrl()}/auth/sign-out`
}

export async function getUserToken(): Promise<UserToken | null> {
    const res = await fetch(`${getApiUrl()}/auth/token`);

    if (!res.ok) {
        const msg = await res.text();
        console.error(msg);
        return null;
    }

    const userToken = userTokenSchema.parse(await res.json());
    return userToken;
}

type Session = UserToken & {
    user: User
}

export async function getSession() {
    const url = `${getApiUrl()}/auth/session`;
    const res = await fetch(`${url}?include_anime_statistics=true`);

    if (!res.ok) {
        const msg = await res.text();
        console.error(msg);
        throw new Error(msg);
    }

    return await res.json() as Session
}