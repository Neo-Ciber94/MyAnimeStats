import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine multiple classes.
 */
export default function cx(...classes: ClassValue[]) {
    return twMerge(clsx(...classes))
}