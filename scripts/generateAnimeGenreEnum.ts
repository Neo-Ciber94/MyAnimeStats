import puppeteer from "puppeteer";
import path from 'node:path';
import fse from 'fs-extra';

// Run with: tsx scripts/generateAnimeGenreEnum.ts

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();

// Navigate the page to a URL
await page.goto('https://myanimelist.net/anime.php', {
    waitUntil: 'domcontentloaded'
});

const genreLinks = await page.$$eval(".genre-list.al a", anchorTags => {
    return anchorTags
        .filter(x => x.href.startsWith("https://myanimelist.net/anime/genre/"))
        .map(x => x.href)
});

// We save the genre id and genre name
const genreIdAndNames: { genreId: number, genreName: string }[] = [];

for (const link of genreLinks) {
    const match = /\/anime\/genre\/(\d+)\/(.+)/.exec(link);

    if (match) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, id, name] = match;
        const genreId = Number(id);

        if (Number.isNaN(genreId)) {
            console.warn(`Genre ${name} returned a non-numeric id: '${id}'`);
            continue;
        }

        const genreName = name.replace(/[^a-zA-Z0-9]/g, "");
        genreIdAndNames.push({ genreId, genreName })
    }
}

// Sort the result by id
genreIdAndNames.sort((a, b) => a.genreId - b.genreId);

const genresObj: Record<string, number> = {};
genreIdAndNames.forEach(data => {
    genresObj[data.genreName] = data.genreId;
});

const destinationDir = path.join(process.cwd(), "types", "generated");
const fileName = path.join(destinationDir, "animeGenres.generated.ts");

await fse.ensureDir(destinationDir);

const fileData = `
/**
 * All the anime genres from MyAnimeList and its id. 
 */
const ANIME_GENRES = ${JSON.stringify(genresObj, null, 2).replace(/"/g, "")} as const;

export default ANIME_GENRES;
`;

await fse.writeFile(fileName, fileData, 'utf-8');

await browser.close();