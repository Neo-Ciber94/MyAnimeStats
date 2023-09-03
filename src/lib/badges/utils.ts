import type { AnimeObjectWithStatus, WatchStatus } from "../myanimelist/common/types"
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

type BadgeImageOptions = {
    src: string,
    alt: string,
    height?: string | number,
    width?: string | number,
    className?: string;
}

/**
 * Returns an html to render an `<img>` tag.
 * @param opts The options
 */
export function badgeImage(opts: BadgeImageOptions): RenderBadgeIcon {
    const { src, alt, height, width, className } = opts;
    return (size) => {
        if (className) {
            return /*html*/ `<img 
                class="${className}" 
                src='${src}' 
                alt='${alt}' 
                width='${width || size}' 
                height='${height || size}'
            />`
        }

        return /*html*/ `<img src='${src}' alt='${alt}' width='${width || size}' height='${height || size}'/>`
    }
}


export function hadWatchedAnime(anime: AnimeObjectWithStatus) {
    const watchedStatus = ['completed', 'dropped'] as WatchStatus[];
    return watchedStatus.includes(anime.list_status.status)
}