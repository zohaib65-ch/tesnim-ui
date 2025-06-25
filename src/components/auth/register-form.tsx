import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import { EyeIcon, EyeOffIcon, UserPlus, Mail, User } from "lucide-react";
import { CustomButton } from "@/components/shared/button";
import { CustomInput } from "@/components/shared/InputField";
import { CustomCard } from "@/components/shared/card";
import { PasswordStrengthMeter } from "./auth-helper";
import { toast } from "sonner";
import API from "@/services";

const validate = (values: any) => {
  const errors: any = {};

  if (!values.firstName) {
    errors.firstName = "First name is required";
  }

  if (!values.lastName) {
    errors.lastName = "Last name is required";
  }

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm your password";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // ✅ Call the register API
        console.time("registerRequest");
        await API.auth.register({
          firstName: values.firstName.trim(),
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        });
        console.timeEnd("registerRequest");

        toast.success("Registration successful!");
        navigate("/verify-email");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.toLowerCase().includes("email")) {
          formik.setFieldError("email", errorMessage);
        } else {
          toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  const password = formik.values.password;

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
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6" autoComplete="off">
          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              id="firstName"
              label="First Name"
              placeholder="John"
              error={formik.touched.firstName || formik.submitCount > 0 ? formik.errors.firstName : undefined}
              leftIcon={<User className="h-4 w-4" />}
              className="dark:border-[#2d2d5b] dark:bg-[#14142b]/50"
              autoComplete="off"
              {...formik.getFieldProps("firstName")}
            />

            <CustomInput
              id="lastName"
              label="Last Name"
              placeholder="Doe"
              error={formik.touched.lastName || formik.submitCount > 0 ? formik.errors.lastName : undefined}
              className="dark:border-[#2d2d5b] dark:bg-[#14142b]/50"
              autoComplete="off"
              {...formik.getFieldProps("lastName")}
            />
          </div>

          <CustomInput
            id="email"
            label="Email"
            type="email"
            placeholder="student@example.com"
            error={formik.touched.email || formik.submitCount > 0 ? formik.errors.email : undefined}
            leftIcon={<Mail className="h-4 w-4" />}
            className="dark:border-[#2d2d5b] dark:bg-[#14142b]/50"
            autoComplete="off"
            {...formik.getFieldProps("email")}
          />

          <CustomInput
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={formik.touched.password || formik.submitCount > 0 ? formik.errors.password : undefined}
            rightIcon={showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            onRightIconClick={() => setShowPassword(!showPassword)}
            className="dark:border-[#2d2d5b] dark:bg-[#14142b]/50"
            autoComplete="new-password"
            {...formik.getFieldProps("password")}
          />

          <CustomInput
            id="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            error={formik.touched.confirmPassword || formik.submitCount > 0 ? formik.errors.confirmPassword : undefined}
            rightIcon={showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="dark:border-[#2d2d5b] dark:bg-[#14142b]/50"
            autoComplete="new-password"
            {...formik.getFieldProps("confirmPassword")}
          />

          {password && <PasswordStrengthMeter password={password} />}

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
