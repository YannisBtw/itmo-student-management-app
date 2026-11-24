import {error} from "@sveltejs/kit";
import {listStudents} from "$lib/server/students.js";


function readString(params, name) {
    return params.get(name)?.trim() || undefined;
}


function readNumber(params, name) {
    const value = readString(params, name);

    if (value === undefined) {
        return undefined;
    }

    const number = Number(value);

    if (!Number.isSafeInteger(number)) {
        throw error(400, `Некорректный параметр: ${name}`);
    }

    return number;
}


function readBoolean(params, name) {
    const value = readString(params, name);

    if (value === undefined) {
        return undefined;
    }

    if (value === "true") {
        return true;
    }

    if (value === "false") {
        return false;
    }

    throw error(400, `Некорректный параметр: ${name}`);
}


export async function load({url, locals}) {
    const params = url.searchParams;

    const query = {
        fullName: readString(params, "fullName"),

        isuId: readNumber(params, "isuId"),

        group: readString(params, "group"),

        dormitoryNumber:
            readNumber(params, "dormitoryNumber"),

        roomNumber:
            readNumber(params, "roomNumber"),

        moveInDate:
            readString(params, "moveInDate"),

        isForeign:
            readBoolean(params, "isForeign"),

        notes: readString(params, "notes"),

        sortBy:
            readString(params, "sortBy") ?? "id",

        sortDirection:
            readString(params, "sortDirection") ?? "asc",

        page:
            readNumber(params, "page") ?? 0,

        size:
            readNumber(params, "size") ?? 20
    };

    try {
        const students = await listStudents(
            locals.token,
            query
        );

        return {
            students,
            query
        };

    } catch (e) {
        throw error(
            e.status || 500,
            e.userMessage ?? "Не удалось загрузить студентов"
        );
    }
}