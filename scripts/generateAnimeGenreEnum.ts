import puppeteer from "puppeteer";
import path from 'node:path';
import fse from 'fs-extra';

// Run with: tsx scripts/generateAnimeGenreEnum.ts

type AnimeGenreRecord = {
    [genreName: string]: {
        ID: number,
        Count: number
    }
}

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();

// Navigate the page to a URL
await page.goto('https://myanimelist.net/anime.php', {
    waitUntil: 'domcontentloaded'
});

const genreAnchor = await page.$$eval(".genre-list.al a", anchorTags => {
    return anchorTags
        .filter(x => x.href.startsWith("https://myanimelist.net/anime/genre/"))
        .map(x => ({
            href: x.href,
            text: x.innerHTML
        }))
});

// We save the genre id and genre name
const genreIdAndNames: { genreId: number, genreName: string, animeCount: number }[] = [];

for (const anchor of genreAnchor) {
    const idAndGenreMatch = /\/anime\/genre\/(\d+)\/(.+)/.exec(anchor.href);
    const genreAnimeCount = /^(.+?) \((\d+(?:,\d+)?)\)$/.exec(anchor.text);

    if (genreAnimeCount == null) {
        console.error(`⚠️ Failed to parse genre '${anchor.text}'`);
        continue;
    }

    const animeCount = Number(genreAnimeCount[2].replace(/,/g, ""));

    if (idAndGenreMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, id, name] = idAndGenreMatch;
        const genreId = Number(id);

        if (Number.isNaN(genreId)) {
            console.warn(`Genre ${name} returned a non-numeric id: '${id}'`);
            continue;
        }

        if (Number.isNaN(animeCount)) {
            console.warn(`Count for genre ${name} returned an invalid number '${animeCount}'`);
            continue;
        }

        const genreName = name.replace(/[^a-zA-Z0-9]/g, "");
        genreIdAndNames.push({ genreId, genreName, animeCount })
    }
}

// Sort the result by id
genreIdAndNames.sort((a, b) => a.genreId - b.genreId);

const genresObj: AnimeGenreRecord = {};
genreIdAndNames.forEach(data => {
    genresObj[data.genreName] = {
        ID: data.genreId,
        Count: data.animeCount
    }
});

const destinationDir = path.join(process.cwd(), "src", "types", "generated");
const fileName = path.join(destinationDir, "animeGenres.generated.ts");

await fse.ensureDir(destinationDir);

const fileData = `
/**
 * Collection of anime genres, its \`ID\` in MyAnimeList and the number of anime for that genre.
 */
const ANIME_GENRES = ${JSON.stringify(genresObj, null, 2).replace(/"/g, "")} as const;

export default ANIME_GENRES;
`;

await fse.writeFile(fileName, fileData, 'utf-8');
console.log(`🍥 Object with ${genreIdAndNames.length} genres written to: ${fileName}`);

await browser.close();