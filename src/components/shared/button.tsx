import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface CustomButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean;
  icon?: ReactNode;
  label?: string | ReactNode;
}

export const CustomButton = ({
  isLoading = false,
  icon,
  label,
  className,
  disabled,
  children,
  ...props
}: CustomButtonProps) => {
  return (
    <Button
      disabled={isLoading || disabled}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
      {!isLoading && icon}
      {label || children}
    </Button>
  );
};
