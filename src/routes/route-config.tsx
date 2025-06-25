import { ReactNode } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { AuthLayout } from "@/components/layout/auth-layout";
import { LoginPage } from "@/pages/login-page";
import { RegisterPage } from "@/pages/register-page";
import { ForgotPasswordPage } from "@/pages/forgot-password-page";
import { DashboardPage } from "@/pages/dashboard-page";

// Define route types with literal type for role-based access control
export type RouteRole = "guest" | "user" | "admin" | "superadmin";

export interface AppRoute {
  path: string;
  element: ReactNode;
  layout?: React.ComponentType<{ children: ReactNode }>;
  auth?: boolean;
  roles?: RouteRole[];
  premium?: boolean;
}

// Public routes - accessible without authentication
export const publicRoutes: AppRoute[] = [
  {
    path: "/login",
    element: <LoginPage />,
    layout: AuthLayout,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    layout: AuthLayout,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
    layout: AuthLayout,
  },
];

// Protected routes - require authentication and possibly specific roles
export const protectedRoutes: AppRoute[] = [
  {
    path: "/dashboard",
    element: <DashboardPage />,
    layout: MainLayout,
    auth: true,
    roles: ["user", "admin", "superadmin"],
  },
  {
    path: "/tasks",
    element: <div>Tasks Page (Coming Soon)</div>,
    layout: MainLayout,
    auth: true,
    roles: ["user", "admin"],
    premium: true,
  },
  {
    path: "/calendar",
    element: <div>Calendar Page (Coming Soon)</div>,
    layout: MainLayout,
    auth: true,
  },
  {
    path: "/pomodoro",
    element: <div>Pomodoro Page (Coming Soon)</div>,
    layout: MainLayout,
    auth: true,
  },
  {
    path: "/settings",
    element: <div>Settings Page (Coming Soon)</div>,
    layout: MainLayout,
    auth: true,
    roles: ["admin", "superadmin"],
  },
  {
    path: "/help",
    element: <div>Help Page (Coming Soon)</div>,
    layout: MainLayout,
    auth: true,
  },
];
