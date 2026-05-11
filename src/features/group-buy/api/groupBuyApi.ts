import axiosInstance from "../../../shared/api/axiosInstance";

export const getPosts = (limit = 20, offset = 0, category?: string) =>
  axiosInstance.get(`/posts`, {
    params: { limit, offset, ...(category && category !== "all" && { category }) },
  });

export const getPostDetail = (id: string) =>
  axiosInstance.get(`/posts/${id}`);

export const createPost = (data: {
  authorId: string;
  title: string;
  content: string;
  price: number;
  minParticipants: number;
  deadline: string;
  pickupLocation: string;
  images?: string[];
  category?: string;
}) =>
  axiosInstance.post(`/posts`, {
    post: data,
  });

export const updatePost = (
  id: string,
  data: {
    title?: string;
    content?: string;
    price?: number;
    deadline?: string;
    pickupLocation?: string;
    images?: string[];
    minParticipants?: number;
    category?: string;
  }
) => axiosInstance.put(`/posts/${id}`, { post: data });

export const deletePost = (id: string) =>
  axiosInstance.delete(`/posts/${id}`);

export const getPostsByStudentId = (
  studentId: string,
  limit = 20,
  offset = 0
) =>
  axiosInstance.get(`/posts/student/${studentId}`, {
    params: { limit, offset },
  });

export const participatePost = (postId: string, userId: string) =>
  axiosInstance.post(`/posts/${postId}/participate`, { userId });

export const cancelParticipation = (postId: string, userId: string) =>
  axiosInstance.delete(`/posts/${postId}/participate/${userId}`);

export const checkParticipation = (postId: string, userId: string) =>
  axiosInstance.get(`/posts/${postId}/participate/${userId}`);

export const getParticipants = (postId: string) =>
  axiosInstance.get(`/posts/${postId}/participants`);

export const getParticipatedPosts = (userId: string) =>
  axiosInstance.get(`/posts/user/${userId}/participated`);

export const updatePostStatus = (
  postId: string,
  status: "open" | "closed" | "in_progress" | "completed",
  authorId: string
) => {
  const url = `/posts/${postId}/status`;
  const body = { status, authorId };

  console.log("========== 상태 변경 API 호출 ==========");
  console.log("URL:", `${axiosInstance.defaults.baseURL}${url}`);
  console.log("method: PATCH");
  console.log("Request Body:", JSON.stringify(body, null, 2));
  console.log("=========================================");

  return axiosInstance.patch(url, body);
};

export const addFavorite = (postId: string, userId: string) =>
  axiosInstance.post(`/posts/${postId}/favorite`, { userId });

export const checkFavorite = (postId: string, userId: string) =>
  axiosInstance.get(`/posts/${postId}/favorite/${userId}`);

export const removeFavorite = (postId: string, userId: string) =>
  axiosInstance.delete(`/posts/${postId}/favorite/${userId}`);

export const getFavoritePosts = async (userId: string) => {
  const endpoints = [
    `/posts/user/${userId}/favorites`,
    `/users/${userId}/favorites`,
    `/favorites/${userId}`,
  ];

  try {
    return await axiosInstance.get(endpoints[0]);
  } catch (err: any) {
    if (err.response?.status !== 404) {
      throw err;
    }

    for (let i = 1; i < endpoints.length; i++) {
      try {
        return await axiosInstance.get(endpoints[i]);
      } catch (e: any) {
        if (i === endpoints.length - 1) {
          throw err;
        }
      }
    }
    throw err;
  }
};
