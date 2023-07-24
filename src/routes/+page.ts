import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ url }) => {
    if (url.pathname === "/") {
        throw redirect(302, '/stats');
    }
}