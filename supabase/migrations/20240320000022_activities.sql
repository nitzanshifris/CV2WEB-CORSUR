-- Create activities table
CREATE TABLE public.activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their activities"
  ON public.activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert activities"
  ON public.activities FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX activities_user_id_idx ON public.activities(user_id);
CREATE INDEX activities_entity_type_entity_id_idx ON public.activities(entity_type, entity_id);
CREATE INDEX activities_type_idx ON public.activities(type);
CREATE INDEX activities_ip_address_idx ON public.activities(ip_address);
CREATE INDEX activities_created_at_idx ON public.activities(created_at); 