import { Database } from '@/types/database.types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface FileUploadOptions {
  bucket: string;
  path: string;
  file: File;
  metadata?: Record<string, any>;
}

interface FileDownloadOptions {
  bucket: string;
  path: string;
}

export async function uploadFile({
  bucket,
  path,
  file,
  metadata = {},
}: FileUploadOptions): Promise<string> {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      ...metadata,
    });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function downloadFile({ bucket, path }: FileDownloadOptions): Promise<Blob> {
  try {
    const { data, error } = await supabase.storage.from(bucket).download(path);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

export async function deleteFile({ bucket, path }: FileDownloadOptions): Promise<void> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

export async function listFiles(bucket: string, path: string = ''): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage.from(bucket).list(path);

    if (error) throw error;

    return data.map(file => file.name);
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  const extension = getFileExtension(file.name);
  return allowedTypes.includes(extension);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
