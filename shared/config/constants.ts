export const STORAGE_BUCKETS = {
  TEMPLATES: 'templates',
  SITES: 'sites',
  USER_FILES: 'user-files',
} as const;

export const FILE_TYPES = {
  IMAGE: 'image',
  DOCUMENT: 'document',
  OTHER: 'other',
} as const;

export const MIME_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  GIF: 'image/gif',
} as const;

export const MAX_FILE_SIZE = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  OTHER: 20 * 1024 * 1024, // 20MB
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const SITE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;
