import { toast } from "@/components/ui/use-toast";

interface ErrorContext {
  method?: string;
  [key: string]: any;
}

interface ErrorOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  context?: ErrorContext;
}

export function handleError(error: any, options: ErrorOptions = {}) {
  const {
    showToast = true,
    logToConsole = true,
    context = {},
  } = options;

  // Log error to console if enabled
  if (logToConsole) {
    console.error("Error occurred:", {
      error,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  // Show toast if enabled
  if (showToast) {
    const errorMessage = getErrorMessage(error);
    toast({
      title: "שגיאה",
      description: errorMessage,
      variant: "destructive",
    });
  }

  return error;
}

function getErrorMessage(error: any): string {
  if (typeof error === "string") {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.error_description) {
    return error.error_description;
  }

  if (error?.error) {
    return error.error;
  }

  return "אירעה שגיאה לא ידועה";
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function isAppError(error: any): error is AppError {
  return error instanceof AppError;
}

export function createAppError(
  message: string,
  code: string,
  statusCode: number = 500
): AppError {
  return new AppError(message, code, statusCode);
} 