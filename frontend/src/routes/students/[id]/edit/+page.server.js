import { error, fail, redirect } from "@sveltejs/kit";
import { getStudent, updateStudent } from "$lib/server/students.js";

export async function load({ params, locals, fetch }) {
  if (locals.user?.role !== "ADMIN") {
    throw redirect(303, "/students");
  }

  try {
    const student = await getStudent(fetch, locals.token, params.id);
    return { student };
  } catch (e) {
    if (e.status === 404) throw error(404, "Студент не найден");
    throw error(e.status || 500, e.userMessage ?? "Ошибка загрузки");
  }
}

export const actions = {
  default: async ({ request, params, locals, fetch }) => {
    const form = await request.formData();
    const payload = Object.fromEntries(form);

    try {
      await updateStudent(fetch, locals.token, params.id, payload);
    } catch (e) {
      return fail(e.status || 500, {
        error: e.userMessage ?? "Не удалось сохранить изменения"
      });
    }

    throw redirect(303, `/students/${params.id}`);
  }
};