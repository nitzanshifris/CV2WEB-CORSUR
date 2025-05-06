import { Database } from '@/types/supabase';
import { supabase } from './supabase';

export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];

export class DatabaseService {
  private static instance: DatabaseService;
  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async getTemplates() {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getTemplateById(id: string) {
    const { data, error } = await supabase.from('templates').select('*').eq('id', id).single();

    if (error) throw error;
    return data;
  }

  async createTemplate(template: Omit<Tables['templates']['Insert'], 'id'>) {
    const { data, error } = await supabase.from('templates').insert(template).select().single();

    if (error) throw error;
    return data;
  }

  async updateTemplate(id: string, template: Partial<Tables['templates']['Update']>) {
    const { data, error } = await supabase
      .from('templates')
      .update(template)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTemplate(id: string) {
    const { error } = await supabase.from('templates').delete().eq('id', id);

    if (error) throw error;
  }
}
