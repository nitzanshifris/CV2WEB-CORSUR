-- Create site_visits table
CREATE TABLE public.site_visits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index
CREATE INDEX site_visits_site_id_idx ON public.site_visits(site_id);
CREATE INDEX site_visits_visitor_id_idx ON public.site_visits(visitor_id);

-- Enable RLS
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can create site visits"
  ON public.site_visits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Site owners can view their site visits"
  ON public.site_visits FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.sites
    WHERE sites.id = site_visits.site_id
    AND sites.user_id = auth.uid()
  )); 