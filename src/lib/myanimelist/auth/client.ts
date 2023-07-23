import { z } from "zod";

export interface AnimeStatistics {
    num_items_watching: number;
    num_items_completed: number;
    num_items_on_hold: number;
    num_items_dropped: number;
    num_items_plan_to_watch: number;
    num_items: number;
    num_days_watched: number;
    num_days_watching: number;
    num_days_completed: number;
    num_days_on_hold: number;
    num_days_dropped: number;
    num_days: number;
    num_episodes: number;
    num_times_rewatched: number;
    mean_score: number;
}

export interface User {
    id: number;
    name: string;
    location?: string;
    gender?: string;
    joined_at: string;
    picture: string;
    anime_statistics: AnimeStatistics;
}

const sessionSchema = z.object({
    accessToken: z.string(),
    expiresAt: z.string().pipe(z.coerce.date())
});

export type SessionToken = z.infer<typeof sessionSchema>;

export interface MyAnimeListRequestOptions {
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD',
    accessToken: string;
    reverseProxyUrl?: string;
}

export interface GetUserOptions {
    accessToken: string;
    reverseProxyUrl?: string;
}

export function signIn() {
    window.location.href = `${window.location.origin}/api/auth/sign-in`
}

export function signOut() {
    window.location.href = `${window.location.origin}/api/auth/sign-out`
}

export async function getSessionToken(): Promise<SessionToken | null> {
    const res = await fetch('/api/auth/session');

    if (!res.ok) {
        const msg = await res.text();
        console.error(msg);
        return null;
    }

    const session = sessionSchema.parse(await res.json());
    return session;
}

export async function request(options: MyAnimeListRequestOptions) {
    const {
        accessToken,
        endpoint,
        reverseProxyUrl = "/api/myanimelist",
        method = 'GET'
    } = options;

    const res = await fetch(`${reverseProxyUrl}${endpoint}`, {
        method,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!res.ok) {
        const msg = await res.text();
        console.error(msg);
        throw new Error(msg);
    }

    const json = await res.json() as User;
    return json;
}

export async function getUser(options: GetUserOptions) {
    return request({
        ...options,
        endpoint: '/users/@me?fields=anime_statistic'
    })
}