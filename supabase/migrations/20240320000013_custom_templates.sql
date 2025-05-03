-- Create custom_templates table
CREATE TABLE public.custom_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.custom_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own custom templates"
  ON public.custom_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public custom templates"
  ON public.custom_templates FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can create their own custom templates"
  ON public.custom_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom templates"
  ON public.custom_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom templates"
  ON public.custom_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for custom templates updates
CREATE TRIGGER update_custom_templates_updated_at
  BEFORE UPDATE ON public.custom_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 