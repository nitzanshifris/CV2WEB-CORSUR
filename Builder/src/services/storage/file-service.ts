import { supabase } from '../database/supabase';

export class FileService {
  private static instance: FileService;
  private constructor() {}

  public static getInstance(): FileService {
    if (!FileService.instance) {
      FileService.instance = new FileService();
    }
    return FileService.instance;
  }

  async uploadFile(file: File, bucket: string, path: string) {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file);

    if (error) throw error;
    return data;
  }

  async downloadFile(bucket: string, path: string) {
    const { data, error } = await supabase.storage.from(bucket).download(path);

    if (error) throw error;
    return data;
  }

  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
  }

  async getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return data.publicUrl;
  }

  async listFiles(bucket: string, path: string) {
    const { data, error } = await supabase.storage.from(bucket).list(path);

    if (error) throw error;
    return data;
  }
}
