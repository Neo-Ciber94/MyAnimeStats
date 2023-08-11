import type { AnimeNodeWithStatus } from "../myanimelist/common/types";
import type { User } from "../myanimelist/common/user";

/**
 * Render the badge icon for the given size.
 */
export type RenderBadgeIcon = (size: number) => string;

/**
 * Styles to apply to an anime badge.
 */
export type AnimeBadgeStyles = {
    /**
     * The styles to apply to the border.
     */
    border?: string;

    /**
     * The text color.
     * 
     * @default white
     */
    color?: string;

    /**
     * The background color.
     * 
     * @default white
     */
    background?: string;
}

/**
 * Represents a badge to give to an user.
 */
export interface AnimeBadge {
    /**
     * An unique identifier for the badge.
     */
    id: string;

    /**
     * Name of the badge.
     */
    name: string;

    /**
     * A description to show for the badge.
     */
    description: string;

    /**
     * A function to render an icon for the given size.
     * 
     * The result string can be HTML so can be a `<svg>` and use `tailwindcss`.
     */
    icon?: RenderBadgeIcon;

    /**
     * Styles to apply to the badge.
     */
    styles?: AnimeBadgeStyles;

    /**
     * Check if the badge can be shown if the condition is meet.
     * @param user The user.
     * @param animeList The user anime list. 
     * @returns `true` if can show the badge for the user.
     */
    canHaveBadge: (user: User, animeList: AnimeNodeWithStatus[]) => boolean;
}