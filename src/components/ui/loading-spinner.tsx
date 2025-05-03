import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      size: {
        default: "h-4 w-4",
        sm: "h-3 w-3",
        lg: "h-6 w-6",
        xl: "h-8 w-8",
      },
      variant: {
        default: "text-primary",
        secondary: "text-secondary",
        muted: "text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
  labelPosition?: "top" | "bottom" | "left" | "right";
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  (
    {
      className,
      size,
      variant,
      label,
      labelPosition = "right",
      ...props
    },
    ref
  ) => {
    const labelClasses = cn(
      "text-sm text-muted-foreground",
      {
        "ml-2": labelPosition === "right",
        "mr-2": labelPosition === "left",
        "mb-2": labelPosition === "bottom",
        "mt-2": labelPosition === "top",
      }
    );

    const containerClasses = cn(
      "flex items-center",
      {
        "flex-col": labelPosition === "top" || labelPosition === "bottom",
        "flex-row": labelPosition === "left" || labelPosition === "right",
      },
      className
    );

    return (
      <div
        ref={ref}
        className={containerClasses}
        role="status"
        aria-label={label || "Loading"}
        {...props}
      >
        {(labelPosition === "top" || labelPosition === "left") && label && (
          <span className={labelClasses}>{label}</span>
        )}
        <div
          className={cn(spinnerVariants({ size, variant }))}
          aria-hidden="true"
        />
        {(labelPosition === "bottom" || labelPosition === "right") && label && (
          <span className={labelClasses}>{label}</span>
        )}
      </div>
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner, spinnerVariants }; 