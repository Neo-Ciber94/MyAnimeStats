import type { RenderBadgeIcon } from "./AnimeBadge"

/**
 * Renders as emoji in html.
 * @param emojiText The emoji text.
 */
export function badgeEmoji(emojiText: string): RenderBadgeIcon {
    return (size) => {
        return /*html*/ `<span style="${size}">${emojiText}</span>`
    }
}