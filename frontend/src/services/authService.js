import { get } from "svelte/store";
import { defer, firstValueFrom, from } from "rxjs";
import { share } from "rxjs/operators";

import { startSessionWatcher } from "../rx/authSession.js";
import { authStore, currentUser, isAuthenticated } from "../stores/authStore.js";
import { api, ApiError, configureApi } from "./api.js";


async function performRefresh() {
    const { refreshToken } = get(authStore);

    if (!refreshToken) {
        throw new ApiError(401, "Нет refresh-токена");
    }

    try {
        const tokens = await api.post(
            "/auth/refresh",
            { refreshToken },
            { auth: false }
        );

        authStore.setTokens(tokens);

    } catch (error) {
        authStore.syncFromStorage();

        const current = get(authStore).refreshToken;

        if (current && current !== refreshToken) {
            return;
        }

        throw error;
    }
}


export const refresh$ = defer(() => from(performRefresh())).pipe(share());


export function refreshTokens() {
    return firstValueFrom(refresh$, { defaultValue: undefined });
}


export async function login(usernameOrEmail, password) {
    const tokens = await api.post(
        "/auth/login",
        { usernameOrEmail, password },
        { auth: false }
    );

    authStore.setTokens(tokens);

    return get(currentUser);
}


export function register({ username, email, password }) {
    return api.post(
        "/auth/register",
        { username, email, password },
        { auth: false }
    );
}


export async function logout() {
    authStore.clear();
}


function expireSession(onSessionExpired) {
    if (!get(isAuthenticated)) {
        return;
    }

    authStore.clear();

    if (onSessionExpired) {
        onSessionExpired();
    }
}


let stopWatcher = null;

export function initAuth({ onSessionExpired } = {}) {
    configureApi({
        getAccessToken: () => get(authStore).accessToken,
        refresh: refreshTokens,
        onAuthFailure: () => expireSession(onSessionExpired)
    });

    if (stopWatcher) {
        stopWatcher();
    }

    const subscription = startSessionWatcher({
        authStore,
        refresh$,
        onSessionExpired: () => expireSession(onSessionExpired)
    });

    stopWatcher = function () {
        subscription.unsubscribe();
        stopWatcher = null;
    };

    return stopWatcher;
}
