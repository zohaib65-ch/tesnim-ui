import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LogIn, Mail } from "lucide-react";
import { CustomButton } from "@/components/shared/button";
import { CustomInput } from "@/components/shared/InputField";
import { CustomCard } from "@/components/shared/card";
import { loginSchema, LoginFormValues } from "./helper";
import API from "@/services";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setFormError(null);

    try {
      const response = await API.auth.login({
        email: data.email,
        password: data.password,
      });

      if (response?.token) {
        const { token, refreshToken, user } = response;

        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", refreshToken);

        useAuthStore.setState({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          tokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
        });

        toast.success("Logged in successfully!");
        navigate("/dashboard");
      } else {
        setFormError("Invalid email or password");
        toast.error("Invalid email or password");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || "Login failed";
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
        showFooter
        footerClassName="flex justify-center"
        withGradient
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
                autoComplete="off"
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
                {...field}
              />
            )}
          />

          {formError && (
            <div className="flex items-center text-sm text-destructive mt-1 bg-destructive/10 p-2 rounded">
              <span>{formError}</span>
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
        </form>
      </CustomCard>
    </div>
  );
}
