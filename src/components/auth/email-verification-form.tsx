import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { CustomButton } from "@/components/shared/button";
import { CustomCard } from "@/components/shared/card";
import { CheckCircle, MailCheck, RefreshCw, AlertCircle } from "lucide-react";

export function EmailVerificationForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const { verifyEmail, user, isLoading, error, clearError } = useAuthStore();

  useEffect(() => {
    // If token is in URL, verify immediately
    if (token) {
      clearError(); // Clear any previous errors
      verifyEmail(token)
        .then(() => {
          setIsVerified(true);
        })
        .catch(() => {
          // Error is already handled by the store
        });
    }
  }, [token, verifyEmail, clearError]);

  useEffect(() => {
    // If user is verified, redirect to dashboard after a short delay
    if (isVerified) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVerified, navigate]);

  useEffect(() => {
    // Check if user's email is already verified from the user object
    if (user?.isEmailVerified) {
      setIsVerified(true);
    }
  }, [user]);

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleResendEmail = async () => {
    if (!user?.email) return;

    clearError(); // Clear any previous errors
    try {
      // Note: resendVerificationEmail method needs to be added to the auth store
      // For now, we'll simulate this with a placeholder
      console.log("Resend verification email to:", user.email);
      setResendDisabled(true);
      setCountdown(60); // 60 second cooldown

      // Show temporary message to user since this functionality
      // is not yet implemented in the auth store
      alert("This feature is not yet implemented. A verification email would be sent to " + user.email);
    } catch (error) {
      // Error handled by store
    }
  };

  // Footer for the card
  const cardFooter = (
    <p className="text-sm text-muted-foreground">
      Already verified?{" "}
      <Link to="/login" className="text-primary hover:text-primary/90 hover:underline underline-offset-4">
        Login
      </Link>
    </p>
  );

  return (
    <div className="w-full max-w-md">
      {isVerified ? (
        <CustomCard
          title="Email Verified!"
          description="Your email has been successfully verified"
          titleClassName="text-2xl font-bold text-center"
          descriptionClassName="text-center"
          withGradient={true}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center">
              <CheckCircle className="text-green-500 h-16 w-16" />
            </div>
            <p className="text-center text-muted-foreground">You'll be redirected to your dashboard momentarily...</p>
          </div>
          <div className="flex justify-center mt-6">
            <Link to="/dashboard">
              <CustomButton label="Go to Dashboard" className="tesnim-gradient text-white shadow-md shadow-primary/20 hover:opacity-90 transition-opacity" />
            </Link>
          </div>
        </CustomCard>
      ) : (
        <CustomCard
          title="Verify Your Email"
          description="Please check your inbox and verify your email address"
          titleClassName="text-2xl font-bold text-center"
          descriptionClassName="text-center"
          showFooter={true}
          footerClassName="flex justify-center"
          withGradient={true}
          footer={cardFooter}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="flex justify-center">
              <MailCheck className="text-primary h-16 w-16" />
            </div>
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">We've sent a verification email to:</p>
              <p className="font-medium">{user?.email}</p>

              {error && (
                <div className="flex items-center text-sm text-destructive mt-1 bg-destructive/10 p-2 rounded">
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <p className="text-sm text-muted-foreground mt-4">If you don't see the email, check your spam folder or request a new verification link.</p>
            </div>

            <CustomButton
              onClick={handleResendEmail}
              disabled={isLoading || resendDisabled}
              variant="outline"
              icon={<RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />}
              label={resendDisabled ? `Resend email (${countdown}s)` : isLoading ? "Sending..." : "Resend verification email"}
              className="border-border/80 bg-background/50 hover:bg-background/80 dark:border-[#2d2d5b] dark:bg-[#14142b]/50 dark:hover:bg-[#14142b]/70"
            />
          </div>
        </CustomCard>
      )}
    </div>
  );
}
