import * as React from 'react';

// Placeholder for Toast component and types
export type ToastProps = {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type ToastActionElement = React.ReactElement<any>;

export const Toast = (props: ToastProps) => {
  return <div>{props.title}</div>;
};
