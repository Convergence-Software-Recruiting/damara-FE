import axiosInstance from "./axiosInstance";

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axiosInstance.post(`/upload/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const uploadImages = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await axiosInstance.post(`/upload/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};
