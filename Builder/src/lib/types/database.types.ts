export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          revisions_left: number;
          status: 'active' | 'inactive' | 'suspended';
          payment_status: 'unpaid' | 'paid' | 'trial';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          revisions_left?: number;
          status?: 'active' | 'inactive' | 'suspended';
          payment_status?: 'unpaid' | 'paid' | 'trial';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          revisions_left?: number;
          status?: 'active' | 'inactive' | 'suspended';
          payment_status?: 'unpaid' | 'paid' | 'trial';
          created_at?: string;
          updated_at?: string;
        };
      };
      sites: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          url: string;
          status: 'active' | 'inactive' | 'pending';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          url: string;
          status?: 'active' | 'inactive' | 'pending';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          url?: string;
          status?: 'active' | 'inactive' | 'pending';
          created_at?: string;
          updated_at?: string;
        };
      };
      revisions: {
        Row: {
          id: string;
          user_id: string;
          site_id: string;
          description: string;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          site_id: string;
          description: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          site_id?: string;
          description?: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
      analytics: {
        Row: {
          id: string;
          site_id: string;
          date: string;
          page_views: number;
          unique_visitors: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          site_id: string;
          date: string;
          page_views?: number;
          unique_visitors?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          site_id?: string;
          date?: string;
          page_views?: number;
          unique_visitors?: number;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'revision' | 'payment' | 'system';
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'revision' | 'payment' | 'system';
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'revision' | 'payment' | 'system';
          message?: string;
          read?: boolean;
          created_at?: string;
        };
      };
      settings: {
        Row: {
          id: string;
          user_id: string;
          theme: 'light' | 'dark' | 'system';
          language: string;
          notifications_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: 'light' | 'dark' | 'system';
          language?: string;
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: 'light' | 'dark' | 'system';
          language?: string;
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
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
