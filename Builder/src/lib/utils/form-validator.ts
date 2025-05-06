import { z } from 'zod';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
}

export function validateData<T>(schema: z.ZodType<T>, data: unknown): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};

      error.errors.forEach(err => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });

      return { success: false, errors };
    }

    return {
      success: false,
      errors: { _form: ['Validation failed'] },
    };
  }
}

// User Profile Schema
export const userProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot be longer than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  avatar_url: z.string().url().optional().nullable(),
});

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Signup Schema
export const signupSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirm_password: z.string(),
  })
  .refine(data => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

// Domain Schema
export const domainSchema = z.object({
  domain: z
    .string()
    .min(3, 'Domain must be at least 3 characters')
    .max(63, 'Domain cannot be longer than 63 characters')
    .regex(
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/,
      'Domain can only contain letters, numbers, and hyphens, and cannot start or end with a hyphen'
    ),
});

// Payment Schema
export const paymentSchema = z.object({
  paymentMethod: z.string(),
  domain: z
    .string()
    .min(3, 'Domain must be at least 3 characters')
    .max(63, 'Domain cannot be longer than 63 characters')
    .regex(
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/,
      'Domain can only contain letters, numbers, and hyphens, and cannot start or end with a hyphen'
    ),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

// Revision Schema
export const revisionSchema = z.object({
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot be longer than 500 characters'),
  site_id: z.string().uuid('Invalid site ID'),
});

// User Settings Schema
export const userSettingsSchema = z.object({
  email_notifications: z.boolean(),
  marketing_emails: z.boolean(),
  preferences: z.record(z.any()).optional(),
});

// CV Data Schema
export const cvDataSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z
    .array(
      z.object({
        company: z.string(),
        position: z.string(),
        duration: z.string(),
        description: z.string().optional(),
      })
    )
    .optional(),
  education: z
    .array(
      z.object({
        institution: z.string(),
        degree: z.string(),
        year: z.string(),
      })
    )
    .optional(),
});

// Export all schemas
export const schemas = {
  userProfile: userProfileSchema,
  login: loginSchema,
  signup: signupSchema,
  domain: domainSchema,
  payment: paymentSchema,
  revision: revisionSchema,
  userSettings: userSettingsSchema,
  cvData: cvDataSchema,
};
