import { calculatedStatsSchema } from "@/lib/types";
import { z } from "zod";

const userAnimeStatsSchema = z.object({
    animeList: z.array(z.record(z.unknown())),
    lastUpdated: z.string().pipe(z.coerce.date()),
    stats: calculatedStatsSchema,
});

type UserDataObject = Omit<z.infer<typeof userAnimeStatsSchema>, 'lastUpdated'>

export class UserAnimeListStats {
    constructor(private readonly kv: KVNamespace) {
        if (kv == null) {
            throw new Error("key-value store is required")
        }
    }

    async getUserData(userId: number) {
        const userStats = await this.kv.get(`userStats/${userId}`);

        if (userStats == null) {
            return null;
        }

        try {
            const json = JSON.parse(userStats);
            const result = userAnimeStatsSchema.safeParse(json);
            return result.success ? result.data : null;
        }
        catch {
            return null;
        }
    }

    async saveUserData(userId: number, userData: UserDataObject) {
        const newData = {
            ...userData,
            lastUpdated: new Date()
        }
        const jsonString = JSON.stringify(newData);

        await this.kv.put(`userStats/${userId}`, jsonString);
        return newData;
    }
}