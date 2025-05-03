-- Create tags table
CREATE TABLE public.tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create site_tags table
CREATE TABLE public.site_tags (
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (site_id, tag_id)
);

-- Enable RLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view tags"
  ON public.tags FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage tags"
  ON public.tags FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view their own site tags"
  ON public.site_tags FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.sites
    WHERE sites.id = site_tags.site_id
    AND sites.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their own site tags"
  ON public.site_tags FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.sites
    WHERE sites.id = site_tags.site_id
    AND sites.user_id = auth.uid()
  ));

-- Create trigger for tags updates
CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON public.tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 