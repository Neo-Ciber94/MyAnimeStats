/* eslint-disable @typescript-eslint/no-namespace */

import parse from "node-html-parser";

export namespace UserService {
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