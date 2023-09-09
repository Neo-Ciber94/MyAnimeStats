import type { RequestHandler } from "@sveltejs/kit";
import { exportUserAnimeList } from "../export";

export const GET: RequestHandler = async (event) => {
    return exportUserAnimeList(event, 'csv');
}