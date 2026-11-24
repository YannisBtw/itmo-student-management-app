import {createHash} from "node:crypto";

import {apiRequest} from "./api.js";
import {getCached, clearCache} from "./cache.js";


function createCacheKey(token, type, params) {
    const tokenHash = createHash("sha256")
        .update(token)
        .digest("hex");

    return JSON.stringify([
        tokenHash,
        type,
        params
    ]);
}


export function listStudents(token, query) {
    const loader = () => apiRequest({
        method: "QUERY",
        path: "/students",
        body: query,
        token
    });

    if (!token) {
        return loader();
    }

    const key = createCacheKey(token, "students", query);

    return getCached(key, loader);
}


export function getStudent(token, id) {
    const loader = () => apiRequest({
        method: "GET",
        path: `/students/${id}`,
        token
    });

    if (!token) {
        return loader();
    }

    const key = createCacheKey(token, "student", String(id));

    return getCached(key, loader);
}


export async function createStudent(token, payload) {
    const result = await apiRequest({
        method: "POST",
        path: "/students",
        body: payload,
        token
    });

    clearCache();

    return result;
}


export async function updateStudent(token, id, payload) {
    const result = await apiRequest({
        method: "PUT",
        path: `/students/${id}`,
        body: payload,
        token
    });

    clearCache();

    return result;
}


export async function deleteStudent(token, id) {
    const result = await apiRequest({
        method: "DELETE",
        path: `/students/${id}`,
        token
    });

    clearCache();

    return result;
}