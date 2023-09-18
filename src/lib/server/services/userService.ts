/* eslint-disable @typescript-eslint/no-namespace */

import { PLACEHOLDER_IMAGE } from "@/common/constants";
import type { WatchStatus } from "@/lib/myanimelist/common/types";
import type { User } from "@/lib/myanimelist/common/user";
import parse, { HTMLElement } from "node-html-parser";

export namespace UserService {
    export async function getUserDetails(username: string): Promise<User | null> {
        const profileUrl = `https://myanimelist.net/profile/${username}`;
        const res = await fetch(profileUrl);

        if (!res.ok) {
            return null;
        }

        try {
            const html = await res.text();
            const htmlDocument = parse(html);
            const commentLink = htmlDocument.querySelector("h2 span.floatRightHeader a");

            if (commentLink == null) {
                return null;
            }

            const href = commentLink.getAttribute('href');

            if (href == null) {
                return null;
            }

            const idMatches = /id(1?)=(\d+)/.exec(href);

            if (idMatches == null) {
                return null;
            }

            const userId = Number(idMatches[2]);

            if (Number.isNaN(userId)) {
                return null;
            }

            const userImage = htmlDocument.querySelector("div.user-image img")?.getAttribute("data-src");
            const name = getUserName(htmlDocument);
            const meanScore = Number(htmlDocument.querySelector(".user-statistics-stats .stat-score .score-label")?.textContent?.trim());

            // TODO: This should not be hardcoded
            const joinedAt = htmlDocument.querySelectorAll("ul.user-status li span.fl-r")
                ?.[4]
                ?.textContent?.trim();

            const getStat = (status: WatchStatus) => {
                const text = htmlDocument.querySelector(`.stats-status a.anime.${status} + span`)?.textContent?.replaceAll(/[\s,]/g, "");
                const count = Number(text);
                return Number.isNaN(count) ? 0 : count;
            }

            const numWatching = getStat('watching');
            const numCompleted = getStat('completed')
            const numOnHold = getStat('on_hold')
            const numDropped = getStat('dropped')
            const numPlanToWatch = getStat('plan_to_watch')
            const statsData = getStatsData(htmlDocument);

            return {
                id: userId,
                name: name,
                picture: userImage ?? PLACEHOLDER_IMAGE,
                joined_at: joinedAt ?? "",
                anime_statistics: {
                    mean_score: Number.isNaN(meanScore) ? 0 : meanScore,
                    num_items_watching: numWatching,
                    num_items_completed: numCompleted,
                    num_items_on_hold: numOnHold,
                    num_items_dropped: numDropped,
                    num_items_plan_to_watch: numPlanToWatch,
                    num_items: statsData.numItems,
                    num_episodes: statsData.numEpisodes,
                    num_times_rewatched: statsData.numRewatched,

                    // ignored
                    num_days_watched: 0,
                    num_days_watching: 0,
                    num_days_completed: 0,
                    num_days_on_hold: 0,
                    num_days_dropped: 0,
                    num_days: 0,
                }
            }
        }
        catch (err) {
            console.error(err);
            return null;
        }
    }

    export async function getUserIdFromUsername(username: string) {
        const profileUrl = `https://myanimelist.net/profile/${username}`;
        const res = await fetch(profileUrl);

        if (!res.ok) {
            return null;
        }

        try {
            const html = await res.text();
            const htmlDocument = parse(html);
            const commentLink = htmlDocument.querySelector("h2 span.floatRightHeader a");

            if (commentLink == null) {
                return null;
            }

            const href = commentLink.getAttribute('href');

            if (href == null) {
                return null;
            }

            const matches = /id(1?)=(\d+)/.exec(href);

            if (matches == null) {
                return null;
            }

            const userId = Number(matches[2]);
            return Number.isNaN(userId) ? null : userId;
        }
        catch (err) {
            console.error(err);
            return null;
        }
    }


}

function getUserName(doc: HTMLElement) {
    const content = doc.querySelector("h1 span.di-ib.po-r")?.textContent?.trim();

    if (content == null) {
        return "<unknown>"
    }

    const matches = /([\w_-~]+)'s Profile/.exec(content);

    if (matches == null) {
        return "<unknown>"
    }

    return matches[1];
}

function getStatsData(doc: HTMLElement) {
    const statusElements = doc.querySelectorAll("ul.stats-data.fl-r li");
    let numItems = 0;
    let numRewatched = 0;
    let numEpisodes = 0;

    for (const el of statusElements) {
        const tag = el.querySelector("span.fl-l")?.textContent?.trim();
        const num = el.querySelector("span.fl-r")?.textContent?.replaceAll(/[\s,]/g, "");
        const n = Number(num);

        if (tag && num) {
            switch (tag) {
                case "Total Entries":
                    numItems = Number.isNaN(n) ? 0 : n;
                    break;
                case "Rewatched":
                    numRewatched = Number.isNaN(n) ? 0 : n;
                    break;
                case "Episodes":
                    numEpisodes = Number.isNaN(n) ? 0 : n;
                    break;
                default:
                    break;
            }
        }
    }

    return {
        numItems,
        numRewatched,
        numEpisodes,
    }
}