import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LogIn, Mail } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { CustomButton } from "@/components/shared/button";
import { CustomInput } from "@/components/shared/InputField";
import { CustomCard } from "@/components/shared/card";
import { loginSchema, LoginFormValues } from "./helper";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error } = useAuthStore();

  // Setup React Hook Form with zod validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      // Navigation will be handled by the protected route or the auth store
    } catch (_error: unknown) {
      console.log(_error);
      // Error is handled by the store
    }
  };

  // Footer for the card
  const cardFooter = (
    <p className="text-center text-sm text-muted-foreground">
      Don&apos;t have an account?{" "}
      <Link to="/register" className="text-primary hover:text-primary/90 hover:underline underline-offset-4">
        Sign up
      </Link>
    </p>
  );

  return (
    <div className="w-full max-w-md">
      <CustomCard
        title="Login"
        description="Enter your credentials to access your account"
        titleClassName="text-2xl font-bold text-center"
        descriptionClassName="text-center"
        showFooter={true}
        footerClassName="flex justify-center"
        withGradient={true}
        footer={cardFooter}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <CustomInput
                id="email"
                label="Email"
                type="email"
                placeholder="student@example.com"
                error={errors.email?.message}
                leftIcon={<Mail className="h-4 w-4" />}
                className="dark:border-[#2d2d5b] dark:bg-[#14142b]/50"
                required
                {...field}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <CustomInput
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                error={errors.password?.message}
                rightIcon={showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                onRightIconClick={() => setShowPassword(!showPassword)}
                className="dark:border-[#2d2d5b] dark:bg-[#14142b]/50"
                labelExtra={
                  <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/90 hover:underline underline-offset-4">
                    Forgot password?
                  </Link>
                }
                required
                {...field}
              />
            )}
          />

          {error && (
            <div className="flex items-center text-sm text-destructive mt-1 bg-destructive/10 p-2 rounded">
              <span>{error}</span>
            </div>
          )}

          <CustomButton
            type="submit"
            isLoading={isLoading}
            icon={!isLoading && <LogIn size={18} />}
            label={isLoading ? "Logging in..." : "Login"}
            className="tesnim-gradient text-white shadow-md shadow-primary/20 hover:opacity-90 transition-opacity"
            disabled={isLoading}
          />

          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border dark:border-[#2d2d5b]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground dark:bg-card/90">Or continue with</span>
            </div>
          </div>

          <CustomButton
            type="button"
            variant="outline"
            className="border-border/80 bg-background/50 hover:bg-background/80 dark:border-[#2d2d5b] dark:bg-[#14142b]/50 dark:hover:bg-[#14142b]/70"
            icon={
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            }
            label="Login with Google"
          />
        </form>
      </CustomCard>
    </div>
  );
}
