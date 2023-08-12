import type { AnimeNodeWithStatus, WatchStatus } from "../myanimelist/common/types"
import type { RenderBadgeIcon } from "./AnimeBadge"

/**
 * Renders as text as html.
 * @param text The emoji text.
 * @param className Additional class to add.
 */
export function badgeIconText(text: string, className?: string): RenderBadgeIcon {
    return (size) => {
        if (className) {
            return /*html*/ `<span class="${className}" style="font-size: ${size}px">${text}</span>`
        }

        return /*html*/ `<span style="font-size: ${size}px">${text}</span>`
    }
}

export function hadWatchedAnime(anime: AnimeNodeWithStatus) {
    const watchedStatus = ['completed', 'dropped'] as WatchStatus[];
    return watchedStatus.includes(anime.list_status.status)
}