import { api } from "./api.js";

export function getStudents() {
    return api.get("/students");
}

export function queryStudents(query = {}, options = {}) {
    return api.query("/students", query, options);
}

export function getStudentById(id) {
    return api.get(`/students/${id}`);
}

export function createStudent(student) {
    return api.post("/students", student);
}

export function updateStudent(id, student) {
    return api.put(`/students/${id}`, student);
}

export function patchStudent(id, student) {
    return api.patch(`/students/${id}`, student);
}

export function deleteStudent(id) {
    return api.delete(`/students/${id}`);
}