import axiosWrapper from "@/utils/api";
import API_URLS from "./API_URLS";

const createTodoAPI = async (postData: any) => {
  try {
    return await axiosWrapper("post", API_URLS.TODOS.CREATE, postData);
  } catch (error) {
    throw error;
  }
};

const getAllTodosAPI = async (filters: any = {}) => {
  try {
    const query = new URLSearchParams(filters).toString();
    return await axiosWrapper("get", `${API_URLS.TODOS.GET_ALL}?${query}`);
  } catch (error) {
    throw error;
  }
};

const getTodoByIdAPI = async (id: string) => {
  try {
    return await axiosWrapper("get", API_URLS.TODOS.GET_BY_ID(id));
  } catch (error) {
    throw error;
  }
};

const updateTodoAPI = async (id: string, postData: any) => {
  try {
    return await axiosWrapper("put", API_URLS.TODOS.UPDATE(id), postData);
  } catch (error) {
    throw error;
  }
};

const deleteTodoAPI = async (id: string) => {
  try {
    return await axiosWrapper("delete", `${API_URLS.TODOS.DELETE(id)}`, {});
  } catch (error) {
    throw error;
  }
};

const getTodosByStatusAPI = async (status: string, filters: any = {}) => {
  try {
    const query = new URLSearchParams(filters).toString();
    return await axiosWrapper("get", `${API_URLS.TODOS.BY_STATUS(status)}?${query}`);
  } catch (error) {
    throw error;
  }
};

const getTodosByPriorityAPI = async (priority: string, filters: any = {}) => {
  try {
    const query = new URLSearchParams(filters).toString();
    return await axiosWrapper("get", `${API_URLS.TODOS.BY_PRIORITY(priority)}?${query}`);
  } catch (error) {
    throw error;
  }
};

const getTodosByDueDateAPI = async (filters: any) => {
  try {
    const query = new URLSearchParams(filters).toString();
    return await axiosWrapper("get", `${API_URLS.TODOS.BY_DUE_DATE}?${query}`);
  } catch (error) {
    throw error;
  }
};

const getTodosByTagAPI = async (tag: string, filters: any = {}) => {
  try {
    const query = new URLSearchParams(filters).toString();
    return await axiosWrapper("get", `${API_URLS.TODOS.BY_TAG(tag)}?${query}`);
  } catch (error) {
    throw error;
  }
};

const todoServices = {
  createTodoAPI,
  getAllTodosAPI,
  getTodoByIdAPI,
  updateTodoAPI,
  deleteTodoAPI,
  getTodosByStatusAPI,
  getTodosByPriorityAPI,
  getTodosByDueDateAPI,
  getTodosByTagAPI,
};

export default todoServices;
