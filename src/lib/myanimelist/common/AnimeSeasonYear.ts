import { capitalize } from "@/lib/utils/helpers";
import type { AnimeSeason } from "./types";
import { AnimeHelper } from "./helper";

export class AnimeSeasonYear {
    private readonly _season: AnimeSeason;
    private readonly _year: number;

    private constructor(season: AnimeSeason, year: number) {
        this._season = season;
        this._year = year;
    }

    static from(season: AnimeSeason, year: number) {
        return new AnimeSeasonYear(season, year);
    }

    static current() {
        const { season, year } = AnimeHelper.getCurrentAnimeSeason();
        return new AnimeSeasonYear(season, year);
    }

    get season() {
        return this._season;
    }

    get year() {
        return this._year;
    }

    get prev() {
        let season = this._season;
        let year = this._year;

        if (season === 'winter') {
            year -= 1;
        }

        switch (season) {
            case 'winter':
                season = 'fall';
                break;
            case 'spring':
                season = 'winter';
                break;
            case 'summer':
                season = 'spring';
                break;
            case 'fall':
                season = 'summer';
                break;
        }

        return new AnimeSeasonYear(season, year);
    }

    get next() {
        let season = this._season;
        let year = this._year;

        if (season === 'fall') {
            year += 1;
        }

        switch (season) {
            case 'winter':
                season = 'spring';
                break;
            case 'spring':
                season = 'summer';
                break;
            case 'summer':
                season = 'fall';
                break;
            case 'fall':
                season = 'winter';
                break;
        }

        return new AnimeSeasonYear(season, year);
    }

    compare(other: AnimeSeasonYear): number {
        // Same year, compare season
        if (this._year === other._year) {
            const thisSeasonIndex = AnimeHelper.seasonOrder(this._season);
            const otherSeasonIndex = AnimeHelper.seasonOrder(other._season);
            return thisSeasonIndex - otherSeasonIndex;
        } else {
            // If years are different, compare based on years
            return this._year - other._year;
        }
    }

    toString() {
        return `${capitalize(this._season)} ${this._year}`;
    }
}