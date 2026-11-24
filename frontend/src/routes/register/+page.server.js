import {fail, redirect} from "@sveltejs/kit";
import {register} from "$lib/server/auth.js";


export const actions = {
    default: async ({request}) => {
        const form = await request.formData();

        const username =
            form.get("username")?.toString().trim() ?? "";

        const email =
            form.get("email")?.toString().trim() ?? "";

        const password =
            form.get("password")?.toString() ?? "";

        if (!username || !email || !password) {
            return fail(400, {
                username,
                email,
                error: "Заполните все поля"
            });
        }

        if (password.length < 6) {
            return fail(400, {
                username,
                email,
                error: "Пароль должен быть не короче 6 символов"
            });
        }

        try {
            await register({
                username,
                email,
                password
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