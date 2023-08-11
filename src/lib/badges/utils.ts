import type { RenderBadgeIcon } from "./AnimeBadge"

/**
 * Renders as text as html.
 * @param text The emoji text.
 */
export function badgeEmoji(text: string): RenderBadgeIcon {
    return (size) => {
        return /*html*/ `<span style="font-size: ${size}px">${text}</span>`
    }
}