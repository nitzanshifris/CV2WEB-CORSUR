-- Create settings table
CREATE TABLE public.settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  description TEXT,
  value JSONB NOT NULL,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, key)
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their settings"
  ON public.settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view global settings"
  ON public.settings FOR SELECT
  USING (user_id IS NULL);

CREATE POLICY "Users can update their settings"
  ON public.settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their settings"
  ON public.settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their settings"
  ON public.settings FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for settings updates
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX settings_user_id_idx ON public.settings(user_id);
CREATE INDEX settings_key_idx ON public.settings(key);
CREATE INDEX settings_is_system_idx ON public.settings(is_system); 