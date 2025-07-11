import { TodoType } from "@/types/todos.type";
import { handleApiError } from "@/utils/apiError";
import instance from "@/utils/axios";

export type CreateTodoData = {
  title: string;
  due_on: string;
  status: string;
};

export const todoApi = {
  getTodos: async (page: number = 1, per_page: number = 10) => {
    try {
      const response = await instance.get<TodoType[]>(
        `/todos?page=${page}&per_page=${per_page}`
      );
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getUserTodos: async (
    userId: number,
    page: number = 1,
    per_page: number = 10
  ) => {
    try {
      const response = await instance.get<TodoType[]>(
        `/users/${userId}/todos?page=${page}&per_page=${per_page}`
      );
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createTodo: async (userId: number, todoData: CreateTodoData) => {
    try {
      const response = await instance.post<TodoType>(
        `/users/${userId}/todos`,
        todoData
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateTodo: async (id: number, todoData: Partial<CreateTodoData>) => {
    try {
      const response = await instance.put<TodoType>(`/todos/${id}`, todoData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteTodo: async (id: number) => {
    try {
      await instance.delete(`/todos/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
