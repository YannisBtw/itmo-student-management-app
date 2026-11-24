import {error, redirect, fail} from "@sveltejs/kit";
import {logout} from "$lib/server/auth.js";


export function load({locals}) {
    if (!locals.user) {
        throw error(401, "Требуется вход в систему");
    }

    return {
        user: locals.user
    };
}


export const actions = {
    logout: async ({cookies, locals}) => {
        try {
            await logout(cookies);
        } catch (e) {
            return fail(e.status || 500, {
                error: e.userMessage ?? "Не удалось выйти из аккаунта"
            });
        }

        locals.user = null;
        locals.token = null;

        throw redirect(303, "/login");
    }
};