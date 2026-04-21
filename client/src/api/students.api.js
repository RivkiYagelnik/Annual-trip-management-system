import api from "./axiosInstance";

export const getAllStudents = ()     => api.get("/students");
export const createStudent = (data) => api.post("/students", data);