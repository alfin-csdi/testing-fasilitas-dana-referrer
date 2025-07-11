import { UserFormData, UserType } from "@/types/users.types";
import { handleApiError } from "@/utils/apiError";
import instance from "@/utils/axios";

export const userApi = {
  getUsers: async (page: number = 1, per_page: number = 10) => {
    try {
      const response = await instance.get<UserType[]>(
        `/users?page=${page}&per_page=${per_page}`
      );
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getUser: async (id: number) => {
    try {
      const response = await instance.get<UserType>(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  createUser: async (userData: UserFormData) => {
    try {
      const response = await instance.post<UserType>("/users", userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  updateUser: async (id: number, userData: Partial<UserFormData>) => {
    try {
      const response = await instance.put<UserType>(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  deleteUser: async (id: number) => {
    try {
      await instance.delete(`/users/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
