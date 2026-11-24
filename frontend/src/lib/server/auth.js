import { getUserFromToken } from "./jwt.js";
import { apiRequest } from "./api.js";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

const ACCESS_MAX_AGE = 60 * 15;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: false
};

export function readUser(cookies) {
  const token = cookies.get(ACCESS_COOKIE);
  return token ? getUserFromToken(token) : null;
}

export function readToken(cookies) {
  return cookies.get(ACCESS_COOKIE) ?? null;
}

export function readRefresh(cookies) {
  return cookies.get(REFRESH_COOKIE) ?? null;
}

export function setAuthCookies(cookies, { accessToken, refreshToken }) {
  cookies.set(ACCESS_COOKIE, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_MAX_AGE
  });
  cookies.set(REFRESH_COOKIE, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_MAX_AGE
  });
}

export function clearAuthCookies(cookies) {
  cookies.delete(ACCESS_COOKIE, { path: "/" });
  cookies.delete(REFRESH_COOKIE, { path: "/" });
}

export async function refreshTokens(fetch, refreshToken) {
  try {
    return await apiRequest(fetch, {
      method: "POST",
      path: "/auth/refresh",
      body: { refreshToken },
      auth: false
    });
  } catch {
    return null;
  }
}