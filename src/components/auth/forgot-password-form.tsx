import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { CustomButton } from "@/components/shared/button";
import { CustomInput } from "@/components/shared/InputField";
import { CustomCard } from "@/components/shared/card";
import { forgotPasswordSchema, ForgotPasswordFormValues } from "./helper";

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { forgotPassword, isLoading, error, clearError } = useAuthStore();

  // Setup React Hook Form with zod validation
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    clearError(); // Clear any previous errors
    try {
      await forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by the store
    }
  };

  // Footer for the card
  const cardFooter = (
    <p className="text-sm text-muted-foreground">
      Remember your password?{" "}
      <Link to="/login" className="text-primary hover:text-primary/90 hover:underline underline-offset-4">
        Login
      </Link>
    </p>
  );

  return (
    <div className="w-full max-w-md">
      {isSubmitted ? (
        <CustomCard
          title="Check your email"
          description={`We've sent a password reset link to ${getValues("email")}`}
          titleClassName="text-2xl font-bold text-center"
          descriptionClassName="text-center"
          withGradient={true}
        >
          <div className="flex flex-col items-center gap-6">
            <p className="text-center text-muted-foreground">Please check your inbox and follow the instructions to reset your password.</p>
            <Link to="/login">
              <CustomButton
                variant="outline"
                label="Back to login"
                className="border-border/80 bg-background/50 hover:bg-background/80 dark:border-[#2d2d5b] dark:bg-[#14142b]/50 dark:hover:bg-[#14142b]/70"
              />
            </Link>
          </div>
        </CustomCard>
      ) : (
        <CustomCard
          title="Forgot password"
          description="Enter your email and we'll send you a password reset link"
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
                  leftIcon={<MailIcon className="h-4 w-4" />}
                  className="dark:border-[#2d2d5b] dark:bg-[#14142b]/50"
                  required
                  {...field}
                />
              )}
            />

            {error && (
              <div className="flex items-center text-sm text-destructive mt-1 bg-destructive/10 p-2 rounded">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <CustomButton
              type="submit"
              isLoading={isLoading}
              icon={!isLoading && <MailIcon size={18} />}
              label={isLoading ? "Sending link..." : "Send reset link"}
              className="tesnim-gradient text-white shadow-md shadow-primary/20 hover:opacity-90 transition-opacity"
              disabled={isLoading}
            />
          </form>
        </CustomCard>
      )}
    </div>
  );
}
