-- Create statistics table
CREATE TABLE public.statistics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0 NOT NULL,
  unique_visitors INTEGER DEFAULT 0 NOT NULL,
  average_time_on_site INTEGER DEFAULT 0 NOT NULL,
  bounce_rate DECIMAL DEFAULT 0 NOT NULL,
  referrer TEXT,
  device_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(site_id, date, referrer, device_type)
);

-- Enable RLS
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their site statistics"
  ON public.statistics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.sites
    WHERE sites.id = statistics.site_id
    AND sites.user_id = auth.uid()
  ));

CREATE POLICY "System can insert statistics"
  ON public.statistics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update statistics"
  ON public.statistics FOR UPDATE
  USING (true);

-- Create trigger for statistics updates
CREATE TRIGGER update_statistics_updated_at
  BEFORE UPDATE ON public.statistics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX statistics_site_id_date_idx ON public.statistics(site_id, date);
CREATE INDEX statistics_referrer_idx ON public.statistics(referrer);
CREATE INDEX statistics_device_type_idx ON public.statistics(device_type); 