import {error, fail, redirect} from "@sveltejs/kit";
import {getStudent, deleteStudent} from "$lib/server/students.js";

export async function load({params, locals, fetch}) {
    try {
        const student = await getStudent(fetch, locals.token, params.id);
        return {student};
    } catch (e) {
        if (e.status === 404) throw error(404, "Студент не найден");
        throw error(e.status || 500, e.userMessage ?? "Ошибка загрузки");
    }
}

export const actions = {
    delete: async ({params, locals, fetch}) => {
        if (locals.user?.role !== "ADMIN") {
            return fail(403, {error: "Только администратор может удалять студентов"});
        }

        try {
            await deleteStudent(fetch, locals.token, params.id);
        } catch (e) {
            return fail(e.status || 500, {
                error: e.userMessage ?? "Не удалось удалить студента"
            });
        }

        throw redirect(303, "/students");
    }
};