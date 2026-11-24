import {error, fail, redirect} from "@sveltejs/kit";

import {
    getStudent,
    updateStudent
} from "$lib/server/students.js";

import {readStudentForm} from
        "$lib/server/studentForm.js";


export async function load({params, locals, fetch}) {

    if (locals.user?.role !== "ADMIN") {
        throw redirect(303, "/students");
    }

    try {
        const student = await getStudent(
            fetch,
            locals.token,
            params.id
        );

        return {student};

    } catch (e) {
        throw error(
            e.status || 503,
            e.userMessage ?? "Не удалось загрузить студента"
        );
    }
}


export const actions = {
    default: async ({request, params, locals, fetch}) => {

        if (locals.user?.role !== "ADMIN") {
            return fail(403, {
                error: "Недостаточно прав"
            });
        }

        const form = await request.formData();

        const values = Object.fromEntries(form);

        const payload = readStudentForm(form);

        try {
            await updateStudent(
                fetch,
                locals.token,
                params.id,
                payload
            );

        } catch (e) {
            return fail(e.status || 503, {
                error: e.userMessage ??
                    "Не удалось сохранить изменения",

                fieldErrors: e.fieldErrors ?? {},

                values
            });
        }

        throw redirect(
            303,
            `/students/${params.id}`
        );
    }
};