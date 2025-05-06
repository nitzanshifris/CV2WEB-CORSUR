export class AppError extends Error {
  constructor(message: string, public statusCode: number = 500, public code?: string) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError('An unexpected error occurred');
};

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

export const createError = (message: string, statusCode: number = 500, code?: string): AppError => {
  return new AppError(message, statusCode, code);
};

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;
