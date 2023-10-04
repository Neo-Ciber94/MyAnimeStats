import { animeSeasonSchema } from '@/lib/myanimelist/common/types';
import type { PageLoad } from './$types';
import { AnimeHelper } from '@/lib/myanimelist/common/helper';
import { AnimeSeasonYear } from '@/lib/myanimelist/common/AnimeSeasonYear';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	const currentSeason = AnimeHelper.getCurrentAnimeSeason();
	const minSeason = AnimeSeasonYear.from('winter', 1900);
	const maxSeason = AnimeSeasonYear.from(currentSeason.season, currentSeason.year).next;

	const seasonResult = animeSeasonSchema.safeParse(params.season);
	const seasonYear = Number(params.year);

	const season = seasonResult.success ? seasonResult.data : currentSeason.season;
	const year = Number.isNaN(seasonYear) ? currentSeason.year : seasonYear;
	const cur = AnimeSeasonYear.from(season, year);

	if (cur.compare(minSeason) < 0 || cur.compare(maxSeason) > 0) {
		throw redirect(307, `/anime/season/${currentSeason.year}/${currentSeason.season}`);
	}

	return {
		season,
		year,
		minSeason: {
			season: minSeason.season,
			year: minSeason.year
		},
		maxSeason: {
			season: maxSeason.season,
			year: maxSeason.year
		}
	};
};
