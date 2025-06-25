const API_URLS = {
  TODOS: {
    CREATE: "/todos",
    GET_ALL: "/todos",
    GET_BY_ID: (id: string): string => `/todos/${id}`,
    UPDATE: (id: string): string => `/todos/${id}`,
    DELETE: (id: string): string => `/todos/${id}`,

    BY_STATUS: (status: string): string => `/todos/status/${status}`,
    BY_PRIORITY: (priority: string): string => `/todos/priority/${priority}`,
    BY_DUE_DATE: "/todos/due-date",
    BY_TAG: (tag: string): string => `/todos/tag/${tag}`,
  },

  AUTH: {
    SIGNUP: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    REFRESH_TOKEN: "/auth/refresh-token",
  },
};

export default API_URLS;
