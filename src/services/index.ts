interface API {
  todos: {
    createTodo: (data: { text: string; status?: string; priority?: string; dueDate?: string; tags?: string[] }) => Promise<any>;
    getAllTodos: (filters?: { status?: string; priority?: string; tag?: string; dueDate?: string }) => Promise<any>;
    getTodoById: (id: string) => Promise<any>;
    updateTodo: (
      id: string,
      data: {
        text?: string;
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
};

export default API;
