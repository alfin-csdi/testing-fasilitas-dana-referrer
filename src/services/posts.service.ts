import { CommentType } from "@/types/comments.type";
import { PostType } from "@/types/posts.types";
import instance from "@/utils/axios";
import { handleApiError } from "@/utils/apiError";

export const postsApi = {
  getPosts: async (page: number = 1, per_page: number = 10) => {
    try {
      const response = await instance.get<PostType[]>(`/posts?page=${page}&per_page=${per_page}`);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getUserPosts: async (userId: number, page: number = 1, per_page: number = 10) => {
    try {
      const response = await instance.get<PostType[]>(`/users/${userId}/posts?page=${page}&per_page=${per_page}`);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createPost: async (userId: number, data: { title: string; body: string }) => {
    try {
      const response = await instance.post<PostType>(`/posts`, {
        user_id: userId,
        ...data
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updatePost: async (postId: number, data: { title: string; body: string }) => {
    try {
      const response = await instance.put<PostType>(`/posts/${postId}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deletePost: async (postId: number) => {
    try {
      await instance.delete(`/posts/${postId}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getPostComments: async (postId: number, page: number = 1, per_page: number = 10) => {
    try {
      const response = await instance.get<CommentType[]>(`/posts/${postId}/comments?page=${page}&per_page=${per_page}`);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createComment: async (postId: number, data: { name: string; email: string; body: string }) => {
    try {
      const response = await instance.post<CommentType>(`/comments`, {
        post_id: postId,
        ...data
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteComment: async (commentId: number) => {
    try {
      await instance.delete(`/comments/${commentId}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};