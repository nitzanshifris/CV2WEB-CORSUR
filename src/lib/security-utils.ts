import { createHash } from "crypto";

interface SecurityOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

const DEFAULT_OPTIONS: SecurityOptions = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
};

export function validatePassword(
  password: string,
  options: SecurityOptions = {}
): boolean {
  const {
    minLength = DEFAULT_OPTIONS.minLength,
    requireUppercase = DEFAULT_OPTIONS.requireUppercase,
    requireLowercase = DEFAULT_OPTIONS.requireLowercase,
    requireNumbers = DEFAULT_OPTIONS.requireNumbers,
    requireSpecialChars = DEFAULT_OPTIONS.requireSpecialChars,
  } = options;

  if (password.length < minLength) {
    return false;
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return false;
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return false;
  }

  if (requireNumbers && !/[0-9]/.test(password)) {
    return false;
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return false;
  }

  return true;
}

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function generateToken(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";

  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return token;
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
}

export function encryptData(data: string, key: string): string {
  // This is a placeholder for actual encryption
  // In a real application, use a proper encryption library like crypto-js
  return btoa(data + key);
}

export function decryptData(encryptedData: string, key: string): string {
  // This is a placeholder for actual decryption
  // In a real application, use a proper encryption library like crypto-js
  const decrypted = atob(encryptedData);
  return decrypted.replace(key, "");
}

export function generateCSRFToken(): string {
  return generateToken(32);
}

export function validateCSRFToken(token: string, expectedToken: string): boolean {
  return token === expectedToken;
}

export function isSecureContext(): boolean {
  return window.isSecureContext;
}

export function getSecureHeaders(): Record<string, string> {
  return {
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  };
} 