import { capitalize } from "@/lib/utils/helpers";
import { getCurrentAnimeSeason, type AnimeSeason } from "./types";

export class AnimeSeasonDate {
    private readonly _season: AnimeSeason;
    private readonly _year: number;

    private constructor(season: AnimeSeason, year: number) {
        this._season = season;
        this._year = year;
    }

    static from(season: AnimeSeason, year: number) {
        return new AnimeSeasonDate(season, year);
    }

    static current() {
        const { season, year } = getCurrentAnimeSeason();
        return new AnimeSeasonDate(season, year);
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

        if (season === 'spring') {
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

        return new AnimeSeasonDate(season, year);
    }

    get next() {
        let season = this._season;
        let year = this._year;

        if (season === 'winter') {
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

        return new AnimeSeasonDate(season, year);
    }

    toString() {
        return `${capitalize(this._season)} ${this._year}`;
    }
}