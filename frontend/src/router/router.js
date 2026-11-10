import { get } from "svelte/store";
import { replace } from "svelte-spa-router";
import { wrap } from "svelte-spa-router/wrap";

import LoginPage from "../pages/auth/LoginPage.svelte";
import ProfilePage from "../pages/auth/ProfilePage.svelte";
import RegisterPage from "../pages/auth/RegisterPage.svelte";
import ForbiddenPage from "../pages/common/ForbiddenPage.svelte";
import NotFoundPage from "../pages/common/NotFoundPage.svelte";
import StudentDetailsPage from "../pages/students/StudentDetailsPage.svelte";
import StudentFormPage from "../pages/students/StudentFormPage.svelte";
import StudentListPage from "../pages/students/StudentListPage.svelte";
import { isAdmin, isAuthenticated } from "../stores/authStore.js";

const GUARDS = {
    auth: () => get(isAuthenticated),
    admin: () => get(isAuthenticated) && get(isAdmin),
    guest: () => !get(isAuthenticated)
};

function guarded(component, guard) {
    return wrap({
        component,
        conditions: [GUARDS[guard]],
        userData: { guard }
    });
}

export const routes = {
    "/": guarded(StudentListPage, "auth"),
    "/students": guarded(StudentListPage, "auth"),
    "/students/new": guarded(StudentFormPage, "admin"),
    "/students/:id": guarded(StudentDetailsPage, "auth"),
    "/students/:id/edit": guarded(StudentFormPage, "admin"),
    "/login": guarded(LoginPage, "guest"),
    "/register": guarded(RegisterPage, "guest"),
    "/profile": guarded(ProfilePage, "auth"),
    "/forbidden": ForbiddenPage,
    "*": NotFoundPage
};

export function handleConditionsFailed(detail) {
    if (detail.userData?.guard === "guest") {
        replace("/");
        return;
    }

    if (!get(isAuthenticated)) {
        const target = detail.location + (detail.querystring ? "?" + detail.querystring : "");

        replace("/login?redirect=" + encodeURIComponent(target));
        return;
    }

    replace("/forbidden");
}
