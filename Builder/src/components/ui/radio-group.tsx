import { cn } from '@/lib/utils';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva, type VariantProps } from 'class-variance-authority';
import { Circle } from 'lucide-react';
import * as React from 'react';

const radioGroupVariants = cva('flex flex-col gap-2', {
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

const radioItemVariants = cva(
  'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
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

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    VariantProps<typeof radioGroupVariants> {
  label?: string;
  error?: string;
  helperText?: string;
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, orientation, label, error, helperText, ...props }, ref) => {
  const id = React.useId();
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <RadioGroupPrimitive.Root
        ref={ref}
        className={cn(radioGroupVariants({ orientation }), className)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...props}
      />
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
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioItemVariants> {
  label?: string;
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, variant, label, ...props }, ref) => {
  const id = React.useId();
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(radioItemVariants({ variant }), className)}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className="h-2.5 w-2.5 fill-current text-current" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
    </div>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
