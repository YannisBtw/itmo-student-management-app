import {fail, redirect} from "@sveltejs/kit";
import {login} from "$lib/server/auth.js";


export const actions = {
    default: async ({request, cookies, url}) => {

        const form = await request.formData();

        const usernameOrEmail =
            form.get("usernameOrEmail")?.toString().trim() ?? "";

        const password =
            form.get("password")?.toString() ?? "";

        if (!usernameOrEmail || !password) {
            return fail(400, {
                usernameOrEmail,
                error: "Заполните все поля"
            });
        }

        try {
            await login(cookies, {
                usernameOrEmail,
                password
            });
        } catch (error) {
            return fail(error.status || 500, {
                usernameOrEmail,
                error: error.userMessage ?? "Ошибка входа"
            });
        }

        const redirectTo = url.searchParams.get("redirect");

        const destination =
            redirectTo &&
            redirectTo.startsWith("/") &&
            !redirectTo.startsWith("//") &&
            !redirectTo.includes("\\")
                ? redirectTo
                : "/students";

        throw redirect(303, destination);
    }
};