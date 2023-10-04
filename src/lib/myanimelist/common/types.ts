import { z } from 'zod';
export * from '@animelist/core';

export const watchStatusSchema = z.enum([
	'watching',
	'completed',
	'on_hold',
	'dropped',
	'plan_to_watch'
]);
export type WatchStatus = z.infer<typeof watchStatusSchema>;

// https://myanimelist.net/apiconfig/references/api/v2#operation/anime_season_year_season_get
export const animeSeasonSchema = z.enum(['winter', 'spring', 'summer', 'fall']);
export type AnimeSeason = z.infer<typeof animeSeasonSchema>;
