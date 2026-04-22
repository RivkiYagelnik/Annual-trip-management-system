import api from "./axiosInstance";

export const login = (idNumber, password) =>
  api.post("/auth/login", { idNumber, password });