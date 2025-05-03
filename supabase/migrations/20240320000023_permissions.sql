-- Create permissions table
CREATE TABLE public.permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, resource_type, resource_id, action)
);

-- Enable RLS
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their permissions"
  ON public.permissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage permissions"
  ON public.permissions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- Create trigger for permissions updates
CREATE TRIGGER update_permissions_updated_at
  BEFORE UPDATE ON public.permissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster queries
CREATE INDEX permissions_user_id_idx ON public.permissions(user_id);
CREATE INDEX permissions_resource_type_resource_id_idx ON public.permissions(resource_type, resource_id);
CREATE INDEX permissions_action_idx ON public.permissions(action);
CREATE INDEX permissions_is_system_idx ON public.permissions(is_system); 