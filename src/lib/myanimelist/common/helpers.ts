import dayjs from "dayjs";

// https://myanimelist.net/apiconfig/references/api/v2#operation/anime_season_year_season_get
export type AnimeSeason = 'winter' | 'spring' | 'summer' | 'fall';

export function getCurrentAnimeSeason() {
    const now = dayjs();
    const month = now.month();
    const year = now.year();

    let season: AnimeSeason;

    if ([0, 1, 2].includes(month)) {
        season = 'winter';
    } else if ([3, 4, 5].includes(month)) {
        season = 'spring'
    } else if ([6, 7, 8].includes(month)) {
        season = 'summer'
    } else {
        season = 'fall';
    }

    return { season, year }
}