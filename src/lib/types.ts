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