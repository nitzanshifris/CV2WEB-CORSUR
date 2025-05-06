import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type Database = {
  public: {
    Tables: {
      sites: {
        Row: {
          id: string;
          user_id: string;
          domain: string;
          theme: string;
          content: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          domain: string;
          theme: string;
          content: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          domain?: string;
          theme?: string;
          content?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

export const supabase = createClientComponentClient<Database>();
