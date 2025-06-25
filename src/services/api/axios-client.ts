// src/services/api/axios-client.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Base API configuration
const apiConfig = {
  baseURL: "http://localhost:8000/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
};

// Create Axios instance
const axiosClient: AxiosInstance = axios.create(apiConfig);

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 unauthorized error (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            `${apiConfig.baseURL}/auth/refresh-token`,
            {
              refreshToken,
            }
          );

          const { token, refreshToken: newRefreshToken } = response.data;

          // Store new tokens
          localStorage.setItem("accessToken", token);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Update the authorization header
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
          } else {
            originalRequest.headers = { Authorization: `Bearer ${token}` };
          }

          // Retry the original request
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, logout the user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        // Redirect to login (adjust as needed for your routing setup)
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Type for API response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// HTTP request wrapper methods
export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosClient
      .get<T, AxiosResponse<T>>(url, config)
      .then((response) => response.data);
  },

  post: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return axiosClient
      .post<T, AxiosResponse<T>>(url, data, config)
      .then((response) => response.data);
  },

  put: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return axiosClient
      .put<T, AxiosResponse<T>>(url, data, config)
      .then((response) => response.data);
  },

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosClient
      .delete<T, AxiosResponse<T>>(url, config)
      .then((response) => response.data);
  },

  patch: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return axiosClient
      .patch<T, AxiosResponse<T>>(url, data, config)
      .then((response) => response.data);
  },
};
