import axiosInstance from "../../../shared/api/axiosInstance";

export const getUsers = (limit = 20, offset = 0) =>
  axiosInstance.get(`/users`, {
    params: { limit, offset },
  });

export const updateUser = (
  id: string,
  data: {
    nickname?: string;
    department?: string;
    avatarUrl?: string;
  }
) =>
  axiosInstance.put(`/users/${id}`, {
    user: data,
  });

export const deleteUser = (id: string) =>
  axiosInstance.delete(`/users/${id}`);
