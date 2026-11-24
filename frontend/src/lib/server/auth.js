import { apiRequest } from "./api.js";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "strict",
  secure: false
};


export function readToken(cookies) {
  return cookies.get(ACCESS_COOKIE) ?? null;
}


export function readRefresh(cookies) {
  return cookies.get(REFRESH_COOKIE) ?? null;
}


export function setAuthCookies(cookies, response) {
  const headers = response.headers.getSetCookie();

  const tokens = new Map();

  for (const header of headers) {
    const [pair, ...attributes] = header.split(";");
    const separator = pair.indexOf("=");

    if (separator === -1) continue;

    const name = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1).trim();

    if (name !== ACCESS_COOKIE && name !== REFRESH_COOKIE) {
      continue;
    }

    const maxAgeAttribute = attributes.find(
        (attribute) =>
            attribute.trim().toLowerCase().startsWith("max-age=")
    );

    const maxAge = maxAgeAttribute
        ? Number(maxAgeAttribute.split("=")[1])
        : undefined;

    tokens.set(name, { value, maxAge });
  }

  if (!tokens.has(ACCESS_COOKIE) || !tokens.has(REFRESH_COOKIE)) {
    throw new Error("Backend не вернул необходимые cookies");
  }

  for (const [name, { value, maxAge }] of tokens) {
    cookies.set(name, value, {
      ...COOKIE_OPTIONS,
      ...(Number.isFinite(maxAge) ? { maxAge } : {})
    });
  }
}


export function clearAuthCookies(cookies) {
  cookies.delete(ACCESS_COOKIE, { path: "/" });
  cookies.delete(REFRESH_COOKIE, { path: "/" });
}


export async function login(fetch, cookies, credentials) {
  const response = await apiRequest(fetch, {
    method: "POST",
    path: "/auth/login",
    body: credentials,
    auth: false,
    raw: true
  });

  setAuthCookies(cookies, response);
}


export async function refreshTokens(fetch, cookies) {
  const refreshToken = readRefresh(cookies);

  if (!refreshToken) {
    return false;
  }

  const response = await apiRequest(fetch, {
    method: "POST",
    path: "/auth/refresh",
    cookieHeader: `${REFRESH_COOKIE}=${refreshToken}`,
    auth: false,
    raw: true
  });

  setAuthCookies(cookies, response);

  return true;
}


export async function loadCurrentUser(fetch, cookies) {
  const token = readToken(cookies);

  if (!token) {
    return null;
  }

  return apiRequest(fetch, {
    method: "GET",
    path: "/auth/me",
    token
  });
}


export async function logout(fetch, cookies) {
  const refreshToken = readRefresh(cookies);

  await apiRequest(fetch, {
    method: "POST",
    path: "/auth/logout",
    cookieHeader: refreshToken
        ? `${REFRESH_COOKIE}=${refreshToken}`
        : undefined,
    auth: false
  });

  clearAuthCookies(cookies);
}