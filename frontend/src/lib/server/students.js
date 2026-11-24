import { apiRequest } from "./api.js";

export function listStudents(fetch, token, query) {
  return apiRequest(fetch, {
    method: "QUERY",
    path: "/students",
    query,
    token
  });
}

export function getStudent(fetch, token, id) {
  return apiRequest(fetch, {
    method: "GET",
    path: `/students/${id}`,
    token
  });
}

export function createStudent(fetch, token, payload) {
  return apiRequest(fetch, {
    method: "POST",
    path: "/students",
    body: payload,
    token
  });
}

export function updateStudent(fetch, token, id, payload) {
  return apiRequest(fetch, {
    method: "PUT",
    path: `/students/${id}`,
    body: payload,
    token
  });
}

export function deleteStudent(fetch, token, id) {
  return apiRequest(fetch, {
    method: "DELETE",
    path: `/students/${id}`,
    token
  });
}