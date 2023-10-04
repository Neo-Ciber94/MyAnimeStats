import { readable, type Readable } from 'svelte/store';
import BADGES from '@/lib/badges';
import type { AnimeObjectWithStatus, User } from '@/lib/myanimelist/common/types';
import type { AnimeBadge } from '@/lib/badges/AnimeBadge';

export function useUserBadges(animeList: AnimeObjectWithStatus[], user: User): Readable<{
    user: User,
    badges: AnimeBadge[],
    loading: boolean
}> {
    return readable({ user, badges: [] as AnimeBadge[], loading: false }, (set) => {
        const badges = BADGES.filter((b) => b.canHaveBadge(animeList, user));
        return set({
            user,
            badges,
            loading: false
        })
    })
}