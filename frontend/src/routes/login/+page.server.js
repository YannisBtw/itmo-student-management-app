import { fail, redirect } from "@sveltejs/kit";
import { apiRequest } from "$lib/server/api.js";
import { setAuthCookies } from "$lib/server/auth.js";

export const actions = {
  default: async ({ request, cookies, fetch, url }) => {
    const form = await request.formData();
    const usernameOrEmail = form.get("usernameOrEmail")?.toString() ?? "";
    const password = form.get("password")?.toString() ?? "";

    if (!usernameOrEmail || !password) {
      return fail(400, { usernameOrEmail, error: "Заполните все поля" });
    }

    let tokens;

    try {
      tokens = await apiRequest(fetch, {
        method: "POST",
        path: "/auth/login",
        body: { usernameOrEmail, password },
        auth: false
      });
    } catch (error) {
      return fail(error.status || 500, {
        usernameOrEmail,
        error: error.userMessage ?? "Ошибка входа"
      });
    }

    setAuthCookies(cookies, tokens);

    const redirectTo = url.searchParams.get("redirect") || "/students";
    throw redirect(303, redirectTo);
  }
};