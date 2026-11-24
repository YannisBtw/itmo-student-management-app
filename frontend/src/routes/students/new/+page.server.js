import {fail, redirect} from "@sveltejs/kit";

import {createStudent} from "$lib/server/students.js";

import {readStudentForm} from
        "$lib/server/studentForm.js";


export function load({locals}) {
    if (locals.user?.role !== "ADMIN") {
        throw redirect(303, "/students");
    }

    return {};
}


export const actions = {
    default: async ({request, locals, fetch}) => {

        if (locals.user?.role !== "ADMIN") {
            return fail(403, {
                error: "Недостаточно прав"
            });
        }

        const form = await request.formData();

        const values = Object.fromEntries(form);

        const payload = readStudentForm(form);

        let created;

        try {
            created = await createStudent(
                fetch,
                locals.token,
                payload
            );

        } catch (e) {
            return fail(e.status || 503, {
                error: e.userMessage ??
                    "Не удалось создать студента",

                fieldErrors: e.fieldErrors ?? {},

                values
            });
        }

        throw redirect(
            303,
            `/students/${created.id}`
        );
    }
};