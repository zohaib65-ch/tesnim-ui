import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { ReactNode, useId } from "react";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelExtra?: ReactNode;
  error?: string;
  helperText?: string;
  wrapperClass?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
  onLeftIconClick?: () => void;
}

export const CustomInput = ({
  id,
  label,
  labelExtra,
  error,
  helperText,
  className,
  wrapperClass,
  leftIcon,
  rightIcon,
  onRightIconClick,
  onLeftIconClick,
  ...props
}: CustomInputProps) => {
  const autoId = useId();
  const inputId = id || props.name || autoId;
  const descriptionId = `${inputId}-description`;

  return (
    <div className={cn("grid gap-1", wrapperClass)}>
      {label && (
        <div className="flex justify-between items-center">
          <Label htmlFor={inputId} className="text-sm font-medium">
            {label}
          </Label>
          {labelExtra}
        </div>
      )}
      <div className="relative">
        {leftIcon && (
          <div
            className={cn(
              "absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground",
              onLeftIconClick ? "cursor-pointer" : "pointer-events-none"
            )}
            onClick={onLeftIconClick}
          >
            {leftIcon}
          </div>
        )}
        <Input
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error || helperText ? descriptionId : undefined}
          className={cn(
            "w-full",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            "border-input/80 bg-background/50 focus-visible:ring-primary",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div
            className={cn(
              "absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground",
              onRightIconClick ? "cursor-pointer" : "pointer-events-none"
            )}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <div
          id={descriptionId}
          className="flex items-center text-sm text-destructive mt-1"
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <p id={descriptionId} className="text-xs text-muted-foreground mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
