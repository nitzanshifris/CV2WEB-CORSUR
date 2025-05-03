-- Create permissions table
CREATE TABLE public.permissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_permissions table
CREATE TABLE public.user_permissions (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  permission_id TEXT REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (user_id, permission_id)
);

-- Enable RLS
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view permissions"
  ON public.permissions FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage permissions"
  ON public.permissions FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view their own permissions"
  ON public.user_permissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage user permissions"
  ON public.user_permissions FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create trigger for permissions updates
CREATE TRIGGER update_permissions_updated_at
  BEFORE UPDATE ON public.permissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default permissions
INSERT INTO public.permissions (id, name, description) VALUES
('admin', 'מנהל מערכת', 'גישה מלאה למערכת'),
('editor', 'עורך', 'יכול לערוך תבניות והגדרות'),
('user', 'משתמש רגיל', 'יכול ליצור ולערוך אתרים'); 