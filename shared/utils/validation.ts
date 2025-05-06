import { MAX_FILE_SIZE, MIME_TYPES } from '../config/constants';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const isValidFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

export const isValidImage = (file: File): boolean => {
  return (
    isValidFileType(file, [MIME_TYPES.PNG, MIME_TYPES.JPEG, MIME_TYPES.GIF]) &&
    isValidFileSize(file, MAX_FILE_SIZE.IMAGE)
  );
};

export const isValidDocument = (file: File): boolean => {
  return (
    isValidFileType(file, [MIME_TYPES.PDF, MIME_TYPES.DOCX]) &&
    isValidFileSize(file, MAX_FILE_SIZE.DOCUMENT)
  );
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};
