import api from "./axiosInstance";

export const getAllTeachers  = ()       => api.get("/teachers");
export const createTeacher  = (data)   => api.post("/teachers", data);
export const getMyStudents  = ()       => api.get("/teachers/students");