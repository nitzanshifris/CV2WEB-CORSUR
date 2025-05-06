import { cn } from '@/lib/utils';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check } from 'lucide-react';
import * as React from 'react';

const checkboxVariants = cva(
  'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
  {
    variants: {
      variant: {
        default: 'border-primary',
        destructive: 'border-destructive data-[state=checked]:bg-destructive',
        success: 'border-success data-[state=checked]:bg-success',
        warning: 'border-warning data-[state=checked]:bg-warning',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, variant, label, error, helperText, ...props }, ref) => {
    const id = React.useId();
    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <div className="flex items-center space-x-2">
          <CheckboxPrimitive.Root
            ref={ref}
            id={id}
            className={cn(checkboxVariants({ variant }), className)}
            {...props}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          >
            <CheckboxPrimitive.Indicator
              className={cn('flex items-center justify-center text-current')}
            >
              <Check className="h-4 w-4" />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
          {label && (
            <label
              htmlFor={id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p id={`${id}-error`} className="text-sm font-medium text-destructive" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${id}-helper`} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
