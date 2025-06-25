import { toast } from "sonner";
import { apiClient } from "../api/axios-client";
import { LoginRequest, RegisterRequest, AuthResponse, User, ForgotPasswordRequest, ResetPasswordRequest, VerifyEmailRequest } from "./types";

class AuthService {
  private AUTH_ENDPOINT = "/auth";
  private user: User | null = null;

  constructor() {
    // Initialize user from localStorage if available
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch (error) {
        toast.error("Error parsing user data from localStorage");
        localStorage.removeItem("user");
      }
    }
  }

  // Login user
  async login(credentials: LoginRequest): Promise<User> {
    try {
      const response = await apiClient.post<AuthResponse>(`${this.AUTH_ENDPOINT}/login`, credentials);

      if (response.success && response.token) {
        // Store tokens and user data
        localStorage.setItem("accessToken", response.token);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.user));

        this.user = response.user;
        return response.user;
      } else {
        throw new Error("Login failed");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
      throw new Error(errorMessage);
    }
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<User> {
    try {
      const response = await apiClient.post<AuthResponse>(`${this.AUTH_ENDPOINT}/register`, userData);

      if (response.success && response.token) {
        // Store tokens and user data
        localStorage.setItem("accessToken", response.token);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.user));

        this.user = response.user;
        return response.user;
      } else {
        throw new Error("Registration failed");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      throw new Error(errorMessage);
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Optional: Call logout endpoint if your API has one
      const token = localStorage.getItem("refreshToken");
      if (token) {
        await apiClient.post(`${this.AUTH_ENDPOINT}/logout`, {
          refreshToken: token,
        });
      }
    } catch (error) {
      toast.error("Error during logout");
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      this.user = null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.user;
  }

  // Request password reset
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    try {
      await apiClient.post(`${this.AUTH_ENDPOINT}/forgot-password`, data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to send password reset email.";
      throw new Error(errorMessage);
    }
  }

  // Reset password
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    try {
      await apiClient.post(`${this.AUTH_ENDPOINT}/reset-password`, data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to reset password.";
      throw new Error(errorMessage);
    }
  }

  // Verify email
  async verifyEmail(data: VerifyEmailRequest): Promise<void> {
    try {
      await apiClient.post(`${this.AUTH_ENDPOINT}/verify-email`, data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to verify email.";
      throw new Error(errorMessage);
    }
  }

  // Refresh tokens
  async refreshToken(refreshToken: string): Promise<void> {
    try {
      const response = await apiClient.post<AuthResponse>(`${this.AUTH_ENDPOINT}/refresh-token`, { refreshToken });

      if (response.success && response.token) {
        localStorage.setItem("accessToken", response.token);
        localStorage.setItem("refreshToken", response.refreshToken);
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      // If refresh fails, force logout
      this.logout();
      throw error;
    }
  }
}

// Create and export a singleton instance
export const authService = new AuthService();
export default authService;
