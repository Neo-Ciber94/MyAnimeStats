import type { AnimeNodeWithStatus } from "../myanimelist/common/types";
import type { User } from "../myanimelist/common/user";

/**
 * Render the badge icon for the given size.
 */
export type RenderBadgeIcon = (size: number) => string | Promise<string>;

/**
 * Styles to apply to an anime badge.
 */
export type AnimeBadgeStyles = {
    /**
     * Sets the badge `border`.
     */
    border?: string;

    /**
     * Sets the badge `border-image` property.
     */
    borderImage?: string;

    /**
     * Sets the badge `border-image-slice` property.
     */
    borderImageSlice?: number;

    /**
     * Sets the badge `color` property.
     * 
     * @default white
     */
    color?: string;

    /**
     * Sets the badge `background` property.
     * 
     * @default white
     */
    background?: string;

    /**
     * Padding to add in the `x` position.
     */
    px?: number;
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
    name: string | ((user: User) => string)

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
     * @param animeList The user anime list. 
     * @param user The user.
     * @returns `true` if can show the badge for the user.
     */
    canHaveBadge: (animeList: AnimeNodeWithStatus[], user: User) => boolean;
}