import {redirect} from "@sveltejs/kit";

import {
    readToken,
    readRefresh,
    refreshTokens,
    loadCurrentUser,
    clearAuthCookies
} from "$lib/server/auth.js";


function isAdminOnlyPath(path) {
    return path === "/students/new" ||
        /^\/students\/[^/]+\/edit$/.test(path);
}


async function resolveUser(cookies) {
    try {
        if (readToken(cookies)) {
            return await loadCurrentUser(cookies);
        }
    } catch (error) {
        if (error.status !== 401) {
            throw error;
        }
    }

    if (readRefresh(cookies)) {
        try {
            const refreshed = await refreshTokens(cookies);

            if (refreshed) {
                return await loadCurrentUser(cookies);
            }
        } catch (error) {
            if (error.status !== 401) {
                throw error;
            }
        }
    }

    clearAuthCookies(cookies);

    return null;
}


export async function handle({event, resolve}) {
    const {cookies, url} = event;

    const user = await resolveUser(cookies);

    event.locals.user = user;
    event.locals.token = readToken(cookies);

    const path = url.pathname;

    const isAuth = Boolean(user);

    const isProtectedPath =
        path === "/students" ||
        path.startsWith("/students/") ||
        path === "/profile";

    const isGuestPath =
        path === "/login" ||
        path === "/register";


    if (isAuth && isGuestPath) {
        throw redirect(303, "/students");
    }


    if (!isAuth && isProtectedPath) {
        throw redirect(
            303,
            "/login?redirect=" +
            encodeURIComponent(path + url.search)
        );
    }


    if (isAuth &&
        isAdminOnlyPath(path) &&
        user.role !== "ADMIN"
    ) {
        throw redirect(303, "/students");
    }


    return resolve(event);
}