import { get } from "svelte/store";
import {
    defer,
    firstValueFrom,
    from
} from "rxjs";
import { share } from "rxjs/operators";

import {
    authStore,
    currentUser,
    isAuthenticated
} from "../stores/authStore.js";

import {
    api,
    ApiError,
    configureApi
} from "./api.js";


async function performRefresh() {
    await api.post(
        "/auth/refresh",
        undefined,
        {
            auth: false
        }
    );
}


export const refresh$ = defer(
    () => from(performRefresh())
).pipe(
    share()
);


export function refreshTokens() {
    return firstValueFrom(
        refresh$,
        {
            defaultValue: undefined
        }
    );
}


export async function loadCurrentUser() {
    const user = await api.get(
        "/auth/me"
    );

    authStore.setUser(user);

    return user;
}


export async function login(
    usernameOrEmail,
    password
) {
    await api.post(
        "/auth/login",
        {
            usernameOrEmail,
            password
        },
        {
            auth: false
        }
    );

    return loadCurrentUser();
}


export function register({
                             username,
                             email,
                             password
                         }) {
    return api.post(
        "/auth/register",
        {
            username,
            email,
            password
        },
        {
            auth: false
        }
    );
}


export async function logout() {
    try {
        await api.post(
            "/auth/logout",
            undefined,
            {
                auth: false
            }
        );
    } finally {
        authStore.clear();
    }
}


function expireSession(
    onSessionExpired
) {
    const wasAuthenticated =
        get(isAuthenticated);

    authStore.clear();

    if (
        wasAuthenticated &&
        onSessionExpired
    ) {
        onSessionExpired();
    }
}


export async function initAuth({
                                   onSessionExpired
                               } = {}) {
    configureApi({
        refresh: refreshTokens,

        onAuthFailure: () =>
            expireSession(
                onSessionExpired
            )
    });

    try {
        await loadCurrentUser();
    } catch (error) {
        authStore.clear();

        if (
            !(error instanceof ApiError) ||
            error.status !== 401
        ) {
            console.error(
                "AUTH INITIALIZATION ERROR:",
                error
            );
        }
    }
}