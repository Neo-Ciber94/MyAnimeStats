import { animeSeasonSchema } from "@/lib/myanimelist/common/types";
import type { PageLoad } from "./$types";
import { AnimeHelper } from "@/lib/myanimelist/common/helper";

export const load: PageLoad = async ({ params }) => {
    const currentSeason = AnimeHelper.getCurrentAnimeSeason();

    const seasonResult = animeSeasonSchema.safeParse(params.season);
    const seasonYear = Number(params.year);

    const season = seasonResult.success ? seasonResult.data : currentSeason.season;
    const year = Number.isNaN(seasonYear) ? currentSeason.year : seasonYear;

    return { season, year }
};