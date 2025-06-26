import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { CustomButton } from "@/components/shared/button";
import { CustomInput } from "@/components/shared/InputField";
import { CustomCard } from "@/components/shared/card";
import { z } from "zod";
import API from "@/services";
import { toast } from "sonner";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  // Setup React Hook Form with zod validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    setFormError(null);

    if (!token) {
      setFormError("Invalid or missing reset token");
      setIsLoading(false);
      return;
    }

    try {
      await API.auth.resetPassword({
        password: data.newPassword,
        token,
      });
      setIsSubmitted(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Reset password failed:", msg);
      setFormError(msg.includes("token") ? "Invalid or expired reset token" : msg);
    } finally {
      setIsLoading(false);
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
          title="Password Reset Successful"
          description="Your password has been updated successfully"
          titleClassName="text-2xl font-bold text-center"
          descriptionClassName="text-center"
          withGradient={true}
        >
          <div className="flex flex-col items-center gap-6">
            <p className="text-center text-muted-foreground">You can now log in with your new password.</p>
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
          title="Reset Password"
          description="Enter your new password below"
          titleClassName="text-2xl font-bold text-center"
          descriptionClassName="text-center"
          showFooter={true}
          footerClassName="flex justify-center"
          withGradient={true}
          footer={cardFooter}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <CustomInput
                  id="newPassword"
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  error={errors.newPassword?.message}
                  leftIcon={<Lock className="h-4 w-4" />}
                  className="dark:border-[#2d2d5b] dark:bg-[#14142b]/50"
                  required
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
                  type="password"
                  placeholder="Confirm new password"
                  error={errors.confirmPassword?.message}
                  leftIcon={<Lock className="h-4 w-4" />}
                  className="dark:border-[#2d2d5b] dark:bg-[#14142b]/50"
                  required
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
              icon={!isLoading && <Lock size={18} />}
              label={isLoading ? "Resetting password..." : "Reset Password"}
              className="tesnim-gradient text-white shadow-md shadow-primary/20 hover:opacity-90 transition-opacity"
              disabled={isLoading}
            />
          </form>
        </CustomCard>
      )}
    </div>
  );
}