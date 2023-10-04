import type { AnimeObject, AnimeObjectWithStatus } from '$lib/myanimelist/common/types';
import dayjs from 'dayjs';

interface GetAnimeWatchedByYearOptions {
	from: number;
	to?: number;
	genre?: string;
}

export function getAnimeWatchedByYear(
	animeList: AnimeObjectWithStatus[],
	options: GetAnimeWatchedByYearOptions
) {
	const { from, to = new Date().getFullYear(), genre } = options;

	const matchGenre = (anime: AnimeObject) => {
		if (!genre) {
			return true;
		}

		return (anime.node.genres || []).some((g) => g.name.toLowerCase() === genre.toLowerCase());
	};

	return animeList
		.filter((anime) => matchGenre(anime))
		.filter((anime) => {
			const myAnimeStatus = anime.list_status;
			if (myAnimeStatus == null) {
				console.error(500, `user anime status for series '${anime.node.title}' was not found`);
				return false;
			}

			const hadWatched =
				myAnimeStatus.status === 'completed' ||
				myAnimeStatus.status === 'watching' ||
				myAnimeStatus.status === 'on_hold' ||
				myAnimeStatus.status === 'dropped';

			const endDate = dayjs(anime.node.end_date);
			return hadWatched && (endDate == null || (endDate.year() >= from && endDate.year() <= to));
		});
}
