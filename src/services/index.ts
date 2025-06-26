interface API {
  todos: {
    createTodo: (data: { title: string; status?: string; priority?: string; dueDate?: string; tags?: string[] }) => Promise<any>;
    getAllTodos: (filters?: { title: string; status?: string; priority?: string; tag?: string; dueDate?: string }) => Promise<any>;
    getTodoById: (id: string) => Promise<any>;
    updateTodo: (
      id: string,
      data: {
        title?: string;
        completed?: boolean;
        status?: string;
        priority?: string;
        dueDate?: string;
        tags?: string[];
      }
    ) => Promise<any>;

    deleteTodo: (id: string) => Promise<void>;
    getTodosByStatus: (status: string) => Promise<any>;
    getTodosByPriority: (priority: string) => Promise<any>;
    getTodosByDueDate: (dueDate: string) => Promise<any>;
    getTodosByTag: (tag: string) => Promise<any>;
  };

  auth: {
    login: (data: any) => Promise<any>;
    register: (data: any) => Promise<any>;
    logout: () => Promise<void>;
    forgotPassword: (data: any) => Promise<void>;
    resetPassword: (data: any) => Promise<void>;
    verifyEmail: (data: any) => Promise<void>;
    refreshToken: (refreshToken: string) => Promise<void>;
  };
}

const API: API = {
  todos: {
    createTodo: (data) => import("./todo.service").then((m) => m.default.createTodoAPI(data)),

    getAllTodos: (filters) => import("./todo.service").then((m) => m.default.getAllTodosAPI(filters)),
    getTodoById: (id) => import("./todo.service").then((m) => m.default.getTodoByIdAPI(id)),
    updateTodo: (id, data) => import("./todo.service").then((m) => m.default.updateTodoAPI(id, data)),
    deleteTodo: (id) => import("./todo.service").then((m) => m.default.deleteTodoAPI(id)),
    getTodosByStatus: (status) => import("./todo.service").then((m) => m.default.getTodosByStatusAPI(status)),
    getTodosByPriority: (priority) => import("./todo.service").then((m) => m.default.getTodosByPriorityAPI(priority)),
    getTodosByDueDate: (dueDate) => import("./todo.service").then((m) => m.default.getTodosByDueDateAPI({ dueDate })),
    getTodosByTag: (tag) => import("./todo.service").then((m) => m.default.getTodosByTagAPI(tag)),
  },

  auth: {
    login: (data) => import("../services/auth/auth-service").then((m) => m.default.login(data)),
    register: (data) => import("../services/auth/auth-service").then((m) => m.default.register(data)),
    logout: () => import("../services/auth/auth-service").then((m) => m.default.logout()),
    forgotPassword: (data) => import("../services/auth/auth-service").then((m) => m.default.forgotPassword(data)),
    resetPassword: (data) => import("../services/auth/auth-service").then((m) => m.default.resetPassword(data)),
    verifyEmail: (data) => import("../services/auth/auth-service").then((m) => m.default.verifyEmail(data)),
    refreshToken: (refreshToken) => import("../services/auth/auth-service").then((m) => m.default.refreshToken(refreshToken)),
  },
};

export default API;
