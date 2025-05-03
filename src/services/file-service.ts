import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { v4 as uuidv4 } from "uuid";
import { handleError } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";

export interface FileUploadOptions {
  path?: string;
  maxSize?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  retryCount?: number;
  retryDelay?: number;
  cacheControl?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FileUploadResult {
  url: string | null;
  error: string | null;
  metadata?: {
    size: number;
    type: string;
    name: string;
    lastModified: number;
  };
}

const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY = 1000;
const DEFAULT_CACHE_CONTROL = "3600";

export class FileService {
  private static supabase = createClientComponentClient<Database>();
  private static readonly DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly DEFAULT_ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  private static async retry<T>(
    fn: () => Promise<T>,
    retryCount: number = DEFAULT_RETRY_COUNT,
    retryDelay: number = DEFAULT_RETRY_DELAY
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retryCount === 0) throw error;
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return this.retry(fn, retryCount - 1, retryDelay);
    }
  }

  /**
   * Validates a file before upload
   */
  private static validateFile(file: File, options: FileUploadOptions): FileValidationResult {
    const maxSize = options.maxSize || this.DEFAULT_MAX_SIZE;
    const allowedTypes = options.allowedTypes || this.DEFAULT_ALLOWED_TYPES;

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`
      };
    }

    return { isValid: true };
  }

  /**
   * Uploads a file to storage
   */
  static async uploadFile(
    file: File, 
    options: FileUploadOptions = {}
  ): Promise<FileUploadResult> {
    try {
      const validation = this.validateFile(file, options);
      if (!validation.isValid) {
        return { 
          url: null, 
          error: validation.error || "Invalid file",
          metadata: {
            size: file.size,
            type: file.type,
            name: file.name,
            lastModified: file.lastModified
          }
        };
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${options.path || "uploads"}/${fileName}`;

      const uploadResult = await this.retry(
        async () => {
          const { data, error } = await this.supabase.storage
            .from("cv-files")
            .upload(filePath, file, {
              cacheControl: options.cacheControl || DEFAULT_CACHE_CONTROL,
              upsert: false
            });

          if (error) throw error;
          return data;
        },
        options.retryCount,
        options.retryDelay
      );

      const { data: urlData } = this.supabase.storage
        .from("cv-files")
        .getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        error: null,
        metadata: {
          size: file.size,
          type: file.type,
          name: file.name,
          lastModified: file.lastModified
        }
      };
    } catch (error) {
      const errorMessage = handleError(error, {
        context: { 
          method: "uploadFile", 
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        }
      });
      return { 
        url: null, 
        error: errorMessage,
        metadata: {
          size: file.size,
          type: file.type,
          name: file.name,
          lastModified: file.lastModified
        }
      };
    }
  }

  /**
   * Deletes a file from storage
   */
  static async deleteFile(url: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const pathMatch = url.match(/\/cv-files\/([^?]+)/);
      if (!pathMatch || !pathMatch[1]) {
        return { 
          success: false, 
          error: "Invalid file URL format" 
        };
      }
      
      const filePath = pathMatch[1];
      
      await this.retry(async () => {
        const { error } = await this.supabase.storage
          .from("cv-files")
          .remove([filePath]);

        if (error) throw error;
      });
      
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = handleError(error, {
        showToast: false,
        context: { method: "deleteFile", url }
      });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Uploads a template image
   */
  static async uploadTemplateImage(
    file: File, 
    templateId: string,
    options: FileUploadOptions = {}
  ): Promise<FileUploadResult> {
    try {
      const allowedTypes = [
        "image/jpeg", 
        "image/png", 
        "image/webp", 
        "image/svg+xml"
      ];
      
      const validation = this.validateFile(file, {
        ...options,
        allowedTypes,
        maxSize: options.maxSize || 2 * 1024 * 1024 // 2MB default for images
      });

      if (!validation.isValid) {
        return { 
          url: null, 
          error: validation.error || "Invalid image file",
          metadata: {
            size: file.size,
            type: file.type,
            name: file.name,
            lastModified: file.lastModified
          }
        };
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${templateId}-${uuidv4()}.${fileExt}`;
      const filePath = `templates/${fileName}`;

      const uploadResult = await this.retry(
        async () => {
          const { data, error } = await this.supabase.storage
            .from("template-images")
            .upload(filePath, file, {
              cacheControl: options.cacheControl || DEFAULT_CACHE_CONTROL,
              upsert: false
            });

          if (error) throw error;
          return data;
        },
        options.retryCount,
        options.retryDelay
      );

      const { data: urlData } = this.supabase.storage
        .from("template-images")
        .getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        error: null,
        metadata: {
          size: file.size,
          type: file.type,
          name: file.name,
          lastModified: file.lastModified
        }
      };
    } catch (error) {
      const errorMessage = handleError(error, {
        context: { 
          method: "uploadTemplateImage", 
          fileName: file.name, 
          templateId 
        }
      });
      return { 
        url: null, 
        error: errorMessage,
        metadata: {
          size: file.size,
          type: file.type,
          name: file.name,
          lastModified: file.lastModified
        }
      };
    }
  }
}

export default FileService; 