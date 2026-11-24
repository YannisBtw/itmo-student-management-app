import {fail, redirect} from "@sveltejs/kit";
import {apiRequest} from "$lib/server/api.js";

export const actions = {
    default: async ({request, fetch}) => {
        const form = await request.formData();
        const username = form.get("username")?.toString().trim() ?? "";
        const email = form.get("email")?.toString().trim() ?? "";
        const password = form.get("password")?.toString() ?? "";

        if (!username || !email || !password) {
            return fail(400, {username, email, error: "Заполните все поля"});
        }

        if (password.length < 6) {
            return fail(400, {
                username,
                email,
                error: "Пароль должен быть не короче 6 символов"
            });
        }

        try {
            await apiRequest(fetch, {
                method: "POST",
                path: "/auth/register",
                body: {username, email, password},
                auth: false
            });
        } catch (error) {
            return fail(error.status || 500, {
                username,
                email,
                error: error.userMessage ?? "Ошибка регистрации"
            });
        }

        throw redirect(303, "/login");
    }
};