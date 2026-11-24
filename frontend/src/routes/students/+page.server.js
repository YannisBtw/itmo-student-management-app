import { error } from "@sveltejs/kit";
import { listStudents } from "$lib/server/students.js";

export async function load({ url, locals, fetch }) {
  const query = {
    q: url.searchParams.get("q") ?? "",
    page: url.searchParams.get("page") ?? "0",
    size: url.searchParams.get("size") ?? "10",
    sort: url.searchParams.get("sort") ?? "",
    order: url.searchParams.get("order") ?? ""
  };

  try {
    const students = await listStudents(fetch, locals.token, query);
    return { students, query };
  } catch (e) {
    throw error(e.status || 500, e.userMessage ?? "Не удалось загрузить студентов");
  }
}