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
    })
})