import { derived, writable } from "svelte/store";


const EMPTY_STATE = {
    user: null
};


function createAuthStore() {
    const { subscribe, set } = writable(EMPTY_STATE);

    return {
        subscribe,

        setUser(user) {
            set({
                user
            });
        },

        clear() {
            set(EMPTY_STATE);
        }
    };
}


export const authStore = createAuthStore();

export const currentUser = derived(
    authStore,
    ($auth) => $auth.user
);

export const isAuthenticated = derived(
    currentUser,
    ($user) => Boolean($user)
);

export const userRole = derived(
    currentUser,
    ($user) => $user?.role ?? null
);

export const isAdmin = derived(
    userRole,
    ($role) => $role === "ADMIN"
);