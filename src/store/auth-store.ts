import { useEffect } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import authService from "../services/auth/auth-service";
import { User, RegisterRequest, ResetPasswordRequest, VerifyEmailRequest } from "../services/auth/types";

/**
 * User preferences for application settings
 */
interface UserPreferences {
  theme?: "light" | "dark" | "system";
  notifications?: boolean;
  language?: string;
}

/**
 * Enhanced user interface extending the API User type with preferences
 */
export interface EnhancedUser extends User {
  preferences?: UserPreferences;
}

interface RegisterBody {
  firstName: string;
  lastName?: string;
  recaptchaToken?: string;
  email: string;
  password: string;
}

/**
 * Comprehensive auth state with initialization tracking
 */
interface AuthState {
  // State
  user: EnhancedUser | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;

  // Authentication actions
  login: (email: string, password: string) => Promise<void>;
  register: (registerBody: RegisterBody) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;

  // Password management
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;

  // Email verification
  verifyEmail: (token: string) => Promise<void>;

  // Session management
  clearError: () => void;
  checkAuth: () => boolean;
}

/**
 * Enhanced Auth Store integrated with auth service
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      tokenExpiry: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      initialized: false,

      /**
       * Authenticate user with credentials
       */
      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          // Commented out real auth service call
          // const loginData: LoginRequest = { email, password };
          // const user = await authService.login(loginData);

          // Static credentials (you can change these)
          const staticEmail = "test@mail.com";
          const staticPassword = "User@123";

          if (email !== staticEmail || password !== staticPassword) {
            throw new Error("Invalid email or password");
          }

          // Simulate a mock user object
          const mockUser: EnhancedUser = {
            id: "123456",
            email: staticEmail,
            firstName: "Test User",
            lastName: "",
            plan: "freemium",
            role: "admin",
            isEmailVerified: true,
            // Add any other required fields
          };

          const now = new Date();
          const expiresAt = now.setHours(now.getHours() + 24);

          // Simulate static tokens
          const token = "mockAccessToken";
          const refreshToken = "mockRefreshToken";

          set({
            user: mockUser,
            token,
            refreshToken,
            tokenExpiry: expiresAt,
            isAuthenticated: true,
            isLoading: false,
            initialized: true,
          });

          if (window && window.localStorage) {
            window.localStorage.setItem("tesnim_lastLogin", new Date().toISOString());
            window.localStorage.setItem("accessToken", token);
            window.localStorage.setItem("refreshToken", refreshToken);
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Authentication failed",
            isLoading: false,
          });
        }
      },

      /**
       * Register new user
       */
      register: async (body: RegisterBody) => {
        set({ isLoading: true, error: null });
        try {
          // Create registration request data
          const registerData: RegisterRequest = {
            firstName: body?.firstName,
            lastName: body?.lastName,
            email: body?.email,
            password: body?.password,
          };

          // Use the auth service to register
          const user = await authService.register(registerData);

          // Calculate token expiry (assuming 24-hour expiry)
          const now = new Date();
          const expiresAt = now.setHours(now.getHours() + 24);

          // Get tokens from localStorage after successful registration
          const token = localStorage.getItem("accessToken");
          const refreshToken = localStorage.getItem("refreshToken");

          // Update the auth state with response data
          set({
            user: user as EnhancedUser,
            token: token,
            refreshToken: refreshToken,
            tokenExpiry: expiresAt,
            isAuthenticated: true,
            isLoading: false,
            initialized: true,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Registration failed",
            isLoading: false,
          });
        }
      },

      /**
       * Logout user and clear session
       */
      logout: async () => {
        set({ isLoading: true });

        try {
          // Use the auth service to logout
          await authService.logout();
        } catch (error) {
          console.error("Error during logout", error);
        } finally {
          // Clear state regardless of API response
          set({
            user: null,
            token: null,
            refreshToken: null,
            tokenExpiry: null,
            isAuthenticated: false,
            isLoading: false,
            initialized: true,
          });
        }
      },

      /**
       * Refresh authentication token
       */
      refreshSession: async () => {
        const currentRefreshToken = get().refreshToken;

        if (!currentRefreshToken) {
          return false;
        }

        set({ isLoading: true });

        try {
          // Use the auth service to refresh the token
          await authService.refreshToken(currentRefreshToken);

          // Get updated tokens from localStorage after refresh
          const newToken = localStorage.getItem("accessToken");
          const newRefreshToken = localStorage.getItem("refreshToken");

          if (newToken && newRefreshToken) {
            // Calculate new token expiry (assuming 24-hour expiry)
            const now = new Date();
            const expiresAt = now.setHours(now.getHours() + 24);

            set({
              token: newToken,
              refreshToken: newRefreshToken,
              tokenExpiry: expiresAt,
              isLoading: false,
            });

            return true;
          } else {
            throw new Error("Failed to refresh token");
          }
        } catch (error) {
          console.error("Error during token refresh", error);
          // If refresh fails, log the user out
          await get().logout();
          set({
            error: "Session expired. Please login again.",
            isLoading: false,
          });
          return false;
        }
      },

      /**
       * Request password reset email
       */
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await authService.forgotPassword({ email });
          set({ isLoading: false });
          return Promise.resolve();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Password reset request failed",
            isLoading: false,
          });
          return Promise.reject(error);
        }
      },

      /**
       * Reset password with token
       */
      resetPassword: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await authService.resetPassword(data);
          set({ isLoading: false });
          return Promise.resolve();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Password reset failed",
            isLoading: false,
          });
          return Promise.reject(error);
        }
      },

      /**
       * Verify email address with token
       */
      verifyEmail: async (token) => {
        set({ isLoading: true, error: null });
        try {
          const data: VerifyEmailRequest = { token };
          await authService.verifyEmail(data);

          // On successful verification, update the user state
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: { ...currentUser, isEmailVerified: true },
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Email verification failed. The link may be expired or invalid.",
            isLoading: false,
          });
        }
      },

      /**
       * Clear any error messages
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Check if user is authenticated and token is valid
       */
      checkAuth: () => {
        const { isAuthenticated, tokenExpiry } = get();
        const isAuthFromService = authService.isAuthenticated();

        // Sync authentication state with service
        if (isAuthenticated !== isAuthFromService) {
          set({ isAuthenticated: isAuthFromService });
        }

        // If not authenticated, return false
        if (!isAuthFromService) return false;

        // If there's an expiry time, check if the token is still valid
        if (tokenExpiry) {
          const now = Date.now();
          if (now > tokenExpiry) {
            // Token expired, try to refresh or logout
            get()
              .refreshSession()
              .catch(() => get().logout());
            return false;
          }
        }

        // Also check if user data needs to be synced
        const serviceUser = authService.getCurrentUser();
        if (serviceUser && !get().user) {
          set({ user: serviceUser as EnhancedUser });
        }

        return true;
      },
    }),
    {
      name: "tesnim-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields to storage
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        tokenExpiry: state.tokenExpiry,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // When rehydration is complete, set initialized to true
        if (state) state.initialized = true;
      },
    }
  )
);

/**
 * Hook to automatically check authentication on component mount
 * Usage: useAuthCheck() at the root of your app or protected routes
 */
export const useAuthCheck = () => {
  const { checkAuth, initialized } = useAuthStore();

  useEffect(() => {
    if (initialized) {
      checkAuth();
    }
  }, [checkAuth, initialized]);
};
