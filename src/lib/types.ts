import { z } from "zod";

const seasonSchema = z.enum(['spring', 'summer', 'fall', 'winter'])

export const calculatedStatsSchema = z.object({
    personal: z.object({
        strength: z.number(),
        charisma: z.number(),
        intelligence: z.number(),
        vitality: z.number(),
    }),

    animeByGenre: z.record(z.number()),
    watchedBySeason: z.record(seasonSchema, z.number()),
    watchedByYear: z.record(z.number(), z.number()),
    scoreByGenre: z.record(z.number()),
    scoreByYear: z.record(z.number(), z.number()),
    storeByStudio: z.record(z.number())
});

export type CalculatedStats = z.infer<typeof calculatedStatsSchema>;