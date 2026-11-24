import { redirect } from "@sveltejs/kit";
import {
  readUser,
  readToken,
  readRefresh,
  setAuthCookies,
  clearAuthCookies,
  refreshTokens
} from "$lib/server/auth.js";
import { isTokenExpired } from "$lib/server/jwt.js";

function isAdminOnlyPath(path) {
  return path === "/students/new" || /^\/students\/[^/]+\/edit$/.test(path);
}

export async function handle({ event, resolve }) {
  const { cookies, url, fetch } = event;

  let user = readUser(cookies);
  let token = readToken(cookies);

  if (token && isTokenExpired(token)) {
    const refresh = readRefresh(cookies);

    if (refresh) {
      const tokens = await refreshTokens(fetch, refresh);

      if (tokens) {
        setAuthCookies(cookies, tokens);
        user = readUser(cookies);
        token = readToken(cookies);
      } else {
        clearAuthCookies(cookies);
        user = null;
        token = null;
      }
    } else {
      clearAuthCookies(cookies);
      user = null;
      token = null;
    }
  }

  event.locals.user = user;
  event.locals.token = token;

  const path = url.pathname;
  const isAuth = Boolean(user);

  if (isAuth && (path === "/login" || path === "/register")) {
    throw redirect(303, "/students");
  }

  if (!isAuth && (path.startsWith("/students") || path.startsWith("/profile"))) {
    throw redirect(
      303,
      "/login?redirect=" + encodeURIComponent(path + url.search)
    );
  }

  if (isAuth && isAdminOnlyPath(path) && user.role !== "ADMIN") {
    throw redirect(303, "/students");
  }

  return resolve(event);
}