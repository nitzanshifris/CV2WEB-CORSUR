import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const progressBarVariants = cva('relative w-full overflow-hidden rounded-full bg-secondary', {
  variants: {
    size: {
      default: 'h-2',
      sm: 'h-1',
      lg: 'h-4',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const progressIndicatorVariants = cva(
  'h-full w-full flex-1 bg-primary transition-all duration-500 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ProgressBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressBarVariants>,
    VariantProps<typeof progressIndicatorVariants> {
  value?: number;
  max?: number;
  showValue?: boolean;
  valueFormat?: (value: number, max: number) => string;
  ariaLabel?: string;
  ariaValueText?: string;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size,
      variant,
      showValue = false,
      valueFormat,
      ariaLabel = 'Progress',
      ariaValueText,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const formattedValue = valueFormat ? valueFormat(value, max) : `${Math.round(percentage)}%`;

    return (
      <div className="space-y-2">
        <div
          ref={ref}
          className={cn(progressBarVariants({ size, className }))}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuetext={ariaValueText}
          aria-label={ariaLabel}
          {...props}
        >
          <div
            className={cn(progressIndicatorVariants({ variant }))}
            style={{
              transform: `translateX(-${100 - percentage}%)`,
            }}
          />
        </div>
        {showValue && (
          <div className="text-sm text-muted-foreground text-center" aria-hidden="true">
            {formattedValue}
          </div>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export { ProgressBar, progressBarVariants, progressIndicatorVariants };
