import { toast } from "@/components/ui/use-toast";

interface ToastOptions {
  title?: string;
  description: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

export function showToast(options: ToastOptions) {
  const {
    title = "הודעה",
    description,
    variant = "default",
    duration = 3000,
  } = options;

  toast({
    title,
    description,
    variant,
    duration,
  });
}

export function showSuccess(message: string) {
  showToast({
    title: "הצלחה",
    description: message,
    variant: "success",
  });
}

export function showError(message: string) {
  showToast({
    title: "שגיאה",
    description: message,
    variant: "destructive",
  });
}

export function showInfo(message: string) {
  showToast({
    title: "מידע",
    description: message,
  });
} 