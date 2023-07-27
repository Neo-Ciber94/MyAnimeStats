import puppeteer from "puppeteer";
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Run with: tsx scripts/getAnimeGenres.ts

type AnimeByGenre = {
    [key: string]: number
}

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();

// Navigate the page to a URL
await page.goto('https://myanimelist.net/anime.php', {
    waitUntil: 'domcontentloaded'
});

const textContents = await page.$$eval(".genre-list.al a", anchorTags => {
    return anchorTags
        .filter(x => x.href.startsWith("https://myanimelist.net/anime/genre/"))
        .map(x => x.innerHTML)
});
const animeByGenre: AnimeByGenre = {};

for (const text of textContents) {
    const regexPattern = /^(.+?) \((\d+(?:,\d+)?)\)$/;
    const matches = regexPattern.exec(text);

    if (matches == null) {
        // throw new Error(`Failed to parse genre '${text}'`);
        console.error(`⚠️ Failed to parse genre '${text}'`);
        continue;
    }

    const genre = matches[1];
    const count = Number(matches[2].replace(/,/g, ""));

    animeByGenre[genre] = count;
}

const json = JSON.stringify(animeByGenre, null, 2);
const dir = path.dirname(fileURLToPath(import.meta.url));
const destPath = path.join(dir, "anime_count_by_genres.json");

console.log(`⌛ Writing anime by genres json to: '${destPath}'`);

try {
    await fs.writeFile(destPath, json, 'utf-8');
    console.log(`✅ Written ${Object.keys(animeByGenre).length} items to '${destPath}'`);
}
catch (err) {
    console.error(`❌ failed to write json to '${destPath}'`, err);
}

await browser.close();