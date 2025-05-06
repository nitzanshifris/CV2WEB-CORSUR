export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
          revisions_left: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          revisions_left?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          revisions_left?: number;
        };
      };
      sites: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          name: string;
          description: string | null;
          template_id: string;
          template_data: Json;
          custom_styles: Json | null;
          is_published: boolean;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          name: string;
          description?: string | null;
          template_id: string;
          template_data: Json;
          custom_styles?: Json | null;
          is_published?: boolean;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          template_id?: string;
          template_data?: Json;
          custom_styles?: Json | null;
          is_published?: boolean;
          published_at?: string | null;
        };
      };
      revisions: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          site_id: string;
          description: string;
          status: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          site_id: string;
          description: string;
          status?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          site_id?: string;
          description?: string;
          status?: string;
          completed_at?: string | null;
        };
      };
      analytics: {
        Row: {
          id: string;
          created_at: string;
          site_id: string;
          date: string;
          page_views: number;
          unique_visitors: number;
          average_time: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          site_id: string;
          date: string;
          page_views?: number;
          unique_visitors?: number;
          average_time?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          site_id?: string;
          date?: string;
          page_views?: number;
          unique_visitors?: number;
          average_time?: number;
        };
      };
      notifications: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          type: string;
          message: string;
          read: boolean;
          data: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          type: string;
          message: string;
          read?: boolean;
          data?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          type?: string;
          message?: string;
          read?: boolean;
          data?: Json | null;
        };
      };
      settings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          theme: string;
          notifications_enabled: boolean;
          email_notifications: boolean;
          push_notifications: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          theme?: string;
          notifications_enabled?: boolean;
          email_notifications?: boolean;
          push_notifications?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          theme?: string;
          notifications_enabled?: boolean;
          email_notifications?: boolean;
          push_notifications?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
