import { derived, writable } from "svelte/store";

import { getUserFromToken } from "../services/jwt.js";


const STORAGE_KEY = "auth";

const EMPTY_STATE = { accessToken: null, refreshToken: null, user: null };


function buildState(accessToken, refreshToken) {
    const user = accessToken && refreshToken ? getUserFromToken(accessToken) : null;

    if (!user) {
        return EMPTY_STATE;
    }

    return { accessToken, refreshToken, user };
}


function readStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return EMPTY_STATE;
        }

        const { accessToken, refreshToken } = JSON.parse(raw);

        return buildState(accessToken, refreshToken);
    } catch (error) {
        return EMPTY_STATE;
    }
}


function writeStorage(state) {
    try {
        if (state.accessToken) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken
            }));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    } catch (error) {
    }
}


function createAuthStore() {
    const { subscribe, set } = writable(readStorage());

    return {
        subscribe,

        setTokens({ accessToken, refreshToken }) {
            const state = buildState(accessToken, refreshToken);

            writeStorage(state);
            set(state);
        },

        clear() {
            writeStorage(EMPTY_STATE);
            set(EMPTY_STATE);
        },

        syncFromStorage() {
            set(readStorage());
        }
    };
}


export const authStore = createAuthStore();

export const isAuthenticated = derived(
    authStore,
    ($auth) => Boolean($auth.accessToken && $auth.refreshToken)
);

export const currentUser = derived(authStore, ($auth) => $auth.user);

export const userRole = derived(authStore, ($auth) => $auth.user?.role ?? null);

export const isAdmin = derived(userRole, ($role) => $role === "ADMIN");


if (typeof window !== "undefined") {
    window.addEventListener("storage", function (event) {
        if (event.key === STORAGE_KEY || event.key === null) {
            authStore.syncFromStorage();
        }
    });
}
