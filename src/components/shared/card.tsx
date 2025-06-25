import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CustomCardProps {
  title?: string | ReactNode;
  description?: string | ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  withGradient?: boolean;
}

export const CustomCard = ({
  title,
  description,
  children,
  footer,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  titleClassName,
  descriptionClassName,
  showHeader = true,
  showFooter = false,
  withGradient = false,
}: CustomCardProps) => {
  return (
    <UICard
      className={cn(
        "border-border/50 bg-card/95 backdrop-blur-sm dark:border-[#222245] dark:bg-card/90 dark:shadow-lg",
        withGradient && "dark:shadow-primary/10",
        className
      )}
    >
      {showHeader && (title || description) && (
        <CardHeader className={cn(headerClassName)}>
          {title && (
            <CardTitle className={cn("text-2xl font-bold", titleClassName)}>
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className={cn(descriptionClassName)}>
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}

      <CardContent className={cn(contentClassName)}>{children}</CardContent>

      {(showFooter || footer) && (
        <CardFooter className={cn(footerClassName)}>{footer}</CardFooter>
      )}
    </UICard>
  );
};
