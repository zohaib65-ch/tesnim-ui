// src/router/app-router.tsx
import { useEffect, ReactNode, FC } from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { publicRoutes, protectedRoutes, RouteRole } from "./route-config";

/**
 * Type-safe AuthGuard that ensures proper role-based access control
 */
interface AuthGuardProps {
  children: ReactNode;
  auth?: boolean;
  roles?: RouteRole[];
  premium?: boolean;
}

const AuthGuard: FC<AuthGuardProps> = ({ children, auth, roles, premium }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Authentication check with location state for redirect after login
  if (auth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Type-safe role-based permission check
  if (roles?.length && user?.role && !roles.includes(user.role as RouteRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Premium feature check with fallback to settings
  if (premium && user && !user.isEmailVerified) {
    return <Navigate to="/settings" replace />;
  }

  return <>{children}</>;
};

/**
 * Advanced AppRouter with persistent auth state and optimized route handling
 */
export const AppRouter: FC = () => {
  const { isAuthenticated, initialized } = useAuthStore();
  const location = useLocation();

  // Rehydrate auth store from persistence
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  // Show loading state while auth is initializing
  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Define route structure for public routes with auth layout */}
      <Route element={<AuthLayoutWrapper />}>
        {publicRoutes.map((route, index) => (
          <Route
            key={`public-${index}`}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>

      {/* Protected routes with main layout */}
      <Route element={<MainLayoutWrapper />}>
        {protectedRoutes.map((route, index) => (
          <Route
            key={`protected-${index}`}
            path={route.path}
            element={
              <AuthGuard
                auth={route.auth}
                roles={route.roles}
                premium={route.premium}
              >
                {route.element}
              </AuthGuard>
            }
          />
        ))}
      </Route>

      {/* Home route with intelligent routing */}
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? "/dashboard" : "/login"}
            state={{ from: location.pathname !== "/" ? location : undefined }}
            replace
          />
        }
      />

      {/* Unauthorized route */}
      <Route
        path="/unauthorized"
        element={
          <div className="flex h-screen items-center justify-center flex-col gap-4">
            <h1 className="text-2xl font-bold">Unauthorized Access</h1>
            <p>You don't have permission to access this resource.</p>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        }
      />

      {/* 404 route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

/**
 * Wrapper for the AuthLayout to handle authentication state
 */
const AuthLayoutWrapper: FC = () => {
  const { isAuthenticated } = useAuthStore();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Import AuthLayout dynamically to ensure correct rendering
  const AuthLayout = publicRoutes[0].layout!;

  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
};

/**
 * Wrapper for the MainLayout to handle authentication state
 */
const MainLayoutWrapper: FC = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Import MainLayout dynamically to ensure correct rendering
  const MainLayout = protectedRoutes[0].layout!;

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
