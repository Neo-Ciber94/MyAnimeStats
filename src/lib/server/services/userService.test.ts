import { describe, test, expect } from 'vitest';
import { UserService } from './userService';

describe("Test UserService", () => {
    test("Should get user id from own", async () => {
        const result = await UserService.getUserIdFromUsername("freddx");
        expect(result).toStrictEqual(10531632);
    })

    test("Should get user id from other username", async () => {
        const result = await UserService.getUserIdFromUsername("ZeroCrystal");
        expect(result).toStrictEqual(5292566);
    });

    test("Should get user details from own user", async () => {
        const user = await UserService.getUserDetails("freddx");

        expect(user).toBeTruthy();

        expect(user?.id).toStrictEqual(10531632);
        expect(user?.name).toBeTruthy();
        expect(user?.picture).contains("https://");

        expect(user?.anime_statistics?.mean_score).greaterThan(0);
        expect(user?.anime_statistics?.num_items).greaterThan(0);
        expect(user?.anime_statistics?.num_episodes).greaterThan(0);

        expect(user?.anime_statistics?.num_items_watching).greaterThan(0);
        expect(user?.anime_statistics?.num_items_completed).greaterThan(0);
        expect(user?.anime_statistics?.num_items_dropped).greaterThan(0);
        expect(user?.anime_statistics?.num_items_on_hold).greaterThan(0);
        expect(user?.anime_statistics?.num_items_plan_to_watch).greaterThan(0);
    });

    test("Should get user details from other user", async () => {
        const user = await UserService.getUserDetails("ZeroCrystal");

        expect(user).toBeTruthy();

        expect(user?.id).toStrictEqual(5292566);
        expect(user?.name).toBeTruthy();
        expect(user?.picture).contains("https://");

        expect(user?.anime_statistics?.mean_score).greaterThan(0);
        expect(user?.anime_statistics?.num_items).greaterThan(0);
        expect(user?.anime_statistics?.num_episodes).greaterThan(0);

        expect(user?.anime_statistics?.num_items_watching).greaterThan(0);
        expect(user?.anime_statistics?.num_items_completed).greaterThan(0);
        expect(user?.anime_statistics?.num_items_dropped).greaterThan(0);
        expect(user?.anime_statistics?.num_items_on_hold).greaterThan(0);
        expect(user?.anime_statistics?.num_items_plan_to_watch).greaterThan(0);
    })
})