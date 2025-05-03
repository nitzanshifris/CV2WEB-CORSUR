import * as Sentry from "@sentry/nextjs";
import { toast } from "@/components/ui/use-toast";

interface ErrorWithMessage {
  message: string;
  code?: string;
  status?: number;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // אם לא ניתן להמיר ל-JSON, החזר שגיאה כללית
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message;
}

export interface ErrorHandlingOptions {
  showToast?: boolean;
  sendToSentry?: boolean;
  context?: Record<string, any>;
  logToConsole?: boolean;
}

const defaultOptions: ErrorHandlingOptions = {
  showToast: true,
  sendToSentry: true,
  logToConsole: process.env.NODE_ENV === "development",
};

/**
 * מטפל בשגיאות באופן מרוכז
 * 
 * @param error השגיאה שנזרקה
 * @param options אפשרויות טיפול בשגיאה
 * @returns הודעת השגיאה
 */
export function handleError(error: unknown, options?: Partial<ErrorHandlingOptions>): string {
  const opts = { ...defaultOptions, ...options };
  const errorObj = toErrorWithMessage(error);
  const errorMessage = errorObj.message;

  // רישום לקונסול
  if (opts.logToConsole) {
    console.error("Error:", errorMessage, opts.context);
  }

  // שליחה לסנטרי
  if (opts.sendToSentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(errorObj, { 
      extra: opts.context,
      tags: {
        code: errorObj.code,
        status: errorObj.status?.toString()
      }
    });
  }

  // הצגת הודעה למשתמש
  if (opts.showToast) {
    toast({
      title: "שגיאה",
      description: errorMessage,
      variant: "destructive",
    });
  }

  return errorMessage;
}

/**
 * מטפל בשגיאות ללא הצגת הודעה למשתמש
 */
export function handleErrorSilently(error: unknown, context?: Record<string, any>): string {
  return handleError(error, { showToast: false, context });
}

/**
 * בודק אם השגיאה היא שגיאת אימות
 */
export function isAuthError(error: unknown): boolean {
  const errorObj = toErrorWithMessage(error);
  return errorObj.code === "auth/unauthorized" || errorObj.status === 401;
}

/**
 * בודק אם השגיאה היא שגיאת הרשאות
 */
export function isPermissionError(error: unknown): boolean {
  const errorObj = toErrorWithMessage(error);
  return errorObj.code === "auth/permission-denied" || errorObj.status === 403;
}

/**
 * בודק אם השגיאה היא שגיאת חיבור לשרת
 */
export function isNetworkError(error: unknown): boolean {
  const errorMessage = getErrorMessage(error).toLowerCase();
  return (
    errorMessage.includes("network") ||
    errorMessage.includes("connection") ||
    errorMessage.includes("offline")
  );
} 