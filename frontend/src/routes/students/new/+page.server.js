import { fail, redirect } from "@sveltejs/kit";
import { createStudent } from "$lib/server/students.js";

export function load({ locals }) {
  if (locals.user?.role !== "ADMIN") {
    throw redirect(303, "/students");
  }
  return {};
}

export const actions = {
  default: async ({ request, locals, fetch }) => {
    const form = await request.formData();
    const payload = Object.fromEntries(form);

    let created;

    try {
      created = await createStudent(fetch, locals.token, payload);
    } catch (e) {
      return fail(e.status || 500, {
        error: e.userMessage ?? "Не удалось создать студента"
      });
    }

    throw redirect(303, `/students/${created.id}`);
  }
};