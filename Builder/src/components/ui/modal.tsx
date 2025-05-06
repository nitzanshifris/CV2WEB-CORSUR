import { cn } from '@/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import * as React from 'react';

const modalVariants = cva(
  'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
  {
    variants: {
      variant: {
        default: 'border-border',
        destructive: 'border-destructive',
        success: 'border-success',
        warning: 'border-warning',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface ModalProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof modalVariants> {
  title?: string;
  description?: string;
  showClose?: boolean;
}

const Modal = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, ModalProps>(
  ({ className, children, title, description, variant, showClose = true, ...props }, ref) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(modalVariants({ variant }), className)}
        {...props}
      >
        {title && (
          <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
            {title}
          </DialogPrimitive.Title>
        )}
        {description && (
          <DialogPrimitive.Description className="text-sm text-muted-foreground">
            {description}
          </DialogPrimitive.Description>
        )}
        {children}
        {showClose && (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
);
Modal.displayName = DialogPrimitive.Content.displayName;

const ModalTrigger = DialogPrimitive.Trigger;
const ModalClose = DialogPrimitive.Close;

export { Modal, ModalTrigger, ModalClose };
