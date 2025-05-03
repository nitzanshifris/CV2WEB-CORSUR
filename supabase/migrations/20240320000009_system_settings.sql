-- Create system_settings table
CREATE TABLE public.system_settings (
  id TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view system settings"
  ON public.system_settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update system settings"
  ON public.system_settings FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create trigger for system settings updates
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default system settings
INSERT INTO public.system_settings (id, value) VALUES
('site', '{
  "title": "CV2Web",
  "description": "יצירת אתר קורות חיים אישי בקלות",
  "logo": "/logo.png",
  "favicon": "/favicon.ico",
  "theme": {
    "primaryColor": "#2563eb",
    "secondaryColor": "#1e40af",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937"
  }
}'),
('email', '{
  "from": "noreply@cv2web.com",
  "smtp": {
    "host": "smtp.example.com",
    "port": 587,
    "user": "user@example.com",
    "pass": "password"
  }
}'),
('analytics', '{
  "enabled": true,
  "trackPageViews": true,
  "trackUniqueVisitors": true
}'); 