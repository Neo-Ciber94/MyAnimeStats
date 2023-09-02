import { z } from "zod";

export const calculatedStatsSchema = z.object({
    personal: z.object({
        strength: z.number(),
        charisma: z.number(),
        intelligence: z.number(),
        vitality: z.number(),
    }),
});

export type CalculatedStats = z.infer<typeof calculatedStatsSchema>;

export const userAnimeStatsSchema = z.object({
    lastUpdated: z.string().pipe(z.coerce.date()),
    stats: calculatedStatsSchema,
});

export type UserAnimeStats = z.infer<typeof userAnimeStatsSchema>;

export const userAnimeListSchema = z.object({
    animeList: z.array(z.record(z.unknown())),
    lastUpdated: z.string().pipe(z.coerce.date()),
});

export type UserAnimeList = z.infer<typeof userAnimeListSchema>;
