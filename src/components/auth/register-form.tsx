import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, UserPlus, AlertCircle, Mail, User } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { CustomButton } from "@/components/shared/button";
import { CustomInput } from "@/components/shared/InputField";
import { CustomCard } from "@/components/shared/card";
import { RegisterFormValues, registerSchema } from "./helper";
import { PasswordStrengthMeter } from "./auth-helper";
import { toast } from "sonner";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      render: (
        container: string | HTMLElement,
        parameters: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
      reset: (opt_widget_id?: number) => void;
      execute: (siteKey?: string, options?: any) => Promise<string>;
    };
  }
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const recaptchaRef = useRef<number | null>(null);

  const { register: registerUser, isLoading } = useAuthStore();

  // Setup React Hook Form with zod validation
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      recaptchaToken: "",
    },
    mode: "onBlur",
  });

  // Watch form values for UI updates
  const password = watch("password");

  // Load reCAPTCHA script
  useEffect(() => {
    // Load the reCAPTCHA script only once
    const scriptId = "recaptcha-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            // Make sure the container exists before rendering
            const container = document.getElementById("recaptcha-container");
            if (container) {
              try {
                // Get the site key from environment variables or use a fallback for development
                const siteKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Fallback key from your code

                // Render the reCAPTCHA widget
                recaptchaRef.current = window.grecaptcha.render("recaptcha-container", {
                  sitekey: siteKey,
                  callback: (token) => {
                    setValue("recaptchaToken", token);
                  },
                  "expired-callback": () => {
                    setValue("recaptchaToken", "");
                  },
                  "error-callback": () => {
                    setError("recaptchaToken", {
                      type: "manual",
                      message: "reCAPTCHA verification failed. Please try again.",
                    });
                  },
                });
              } catch (err) {
                toast.error("Error rendering reCAPTCHA:");
              }
            } else {
              toast.error("recaptcha-container element not found");
            }
          });
        }
      };

      document.body.appendChild(script);
    }

    return () => {
      // Clean up function
      if (recaptchaRef.current && window.grecaptcha) {
        try {
          window.grecaptcha.reset(recaptchaRef.current);
        } catch (err) {
          toast.error("Error resetting reCAPTCHA:");
        }
      }
    };
  }, [setValue, setError]);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // Verify reCAPTCHA token is present
      if (!data.recaptchaToken) {
        setError("recaptchaToken", {
          type: "manual",
          message: "Please complete the reCAPTCHA verification.",
        });
        return;
      }

      await registerUser({
        firstName: data.firstName?.trim(),
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        recaptchaToken: data?.recaptchaToken,
      });
      navigate("/verify-email");
    } catch (error) {
      // Handle specific errors
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.toLowerCase().includes("captcha")) {
        setError("recaptchaToken", {
          type: "manual",
          message: "reCAPTCHA verification failed. Please try again.",
        });

        // Reset reCAPTCHA on failure
        if (recaptchaRef.current && window.grecaptcha) {
          try {
            window.grecaptcha.reset(recaptchaRef.current);
          } catch (err) {
            toast.error("Error resetting reCAPTCHA:");
          }
        }
      } else if (errorMessage.toLowerCase().includes("email")) {
        setError("email", {
          type: "manual",
          message: errorMessage,
        });
      }
    }
  };

  // Footer for the card
  const cardFooter = (
    <p className="text-center text-sm text-muted-foreground">
      Already have an account?{" "}
      <Link to="/login" className="text-primary hover:text-primary/90 hover:underline underline-offset-4">
        Login
      </Link>
    </p>
  );

  return (
    <div className="w-full max-w-md">
      <CustomCard
        title="Create an account"
        description="Enter your details to register for tesnim"
        titleClassName="text-2xl font-bold text-center"
        descriptionClassName="text-center"
        showFooter={true}
        footerClassName="flex justify-center"
        withGradient={true}
        footer={cardFooter}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" autoComplete="off">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <CustomInput
                  id="firstName"
                  label="First Name"
                  placeholder="John"
                  error={errors.firstName?.message}
                  leftIcon={<User className="h-4 w-4" />}
                  className="dark:border-[#2d2d5b] dark:bg-[#14142b]/50"
                  required
                  autoComplete="off"
                  {...field}
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <CustomInput
                  id="lastName"
                  label="Last Name"
                  placeholder="Doe"
                  error={errors.lastName?.message}
                  className="dark:border-[#2d2d5b] dark:bg-[#14142b]/50"
                  required
                  autoComplete="off"
                  {...field}
                />
              )}
            />
          </div>

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
                required
                autoComplete="new-password"
                {...field}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <CustomInput
                id="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                rightIcon={showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="dark:border-[#2d2d5b] dark:bg-[#14142b]/50"
                required
                autoComplete="new-password"
                {...field}
              />
            )}
          />

          {/* Password strength indicator */}
          {password && <PasswordStrengthMeter password={password} />}

          {/* reCAPTCHA container - properly defined with an ID */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-center">
              {/* This is the container where reCAPTCHA will be rendered */}
              <div id="recaptcha-container"></div>
            </div>
            {errors.recaptchaToken && (
              <div className="text-destructive text-sm flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.recaptchaToken.message}
              </div>
            )}
          </div>

          <CustomButton
            type="submit"
            isLoading={isLoading}
            icon={!isLoading && <UserPlus size={18} />}
            label={isLoading ? "Creating account..." : "Create account"}
            className="tesnim-gradient text-white shadow-md shadow-primary/20 hover:opacity-90 transition-opacity"
            disabled={isLoading}
          />
        </form>
      </CustomCard>
    </div>
  );
}
