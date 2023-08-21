import { derived } from 'svelte/store';
import BADGES from '@/lib/badges';
import session from './session';
import type { AnimeNodeWithStatus } from '@/lib/myanimelist/common/types';

export function useUserBadges(animeList: AnimeNodeWithStatus[]) {
    return derived(session, (session) => {
        const user = session.user;
        const badges = user == null ? [] : BADGES.filter((b) => b.canHaveBadge(animeList, user));

        return {
            loading: session.loading,
            user,
            badges
        };
    });
}