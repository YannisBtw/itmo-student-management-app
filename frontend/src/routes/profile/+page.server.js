import { error, redirect } from "@sveltejs/kit";
import { clearAuthCookies } from "$lib/server/auth.js";

export function load({ locals }) {
  if (!locals.user) throw error(401, "Требуется вход в систему");
  return { user: locals.user };
}

export const actions = {
  logout: async ({ cookies }) => {
    clearAuthCookies(cookies);
    throw redirect(303, "/login");
  }
};