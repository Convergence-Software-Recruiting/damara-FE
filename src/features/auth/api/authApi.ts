import axiosInstance from "../../../shared/api/axiosInstance";

export const registerUser = (userData: {
  email: string;
  passwordHash: string;
  nickname: string;
  studentId: string;
  department?: string;
  avatarUrl?: string;
}) =>
  axiosInstance.post(`/users`, {
    user: userData,
  });

export const loginUser = (studentId: string, password: string) =>
  axiosInstance.post(`/users/login`, { studentId, password });
