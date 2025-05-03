-- Create images table
CREATE TABLE public.images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  size INTEGER NOT NULL,
  type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own images"
  ON public.images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public images"
  ON public.images FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view site images"
  ON public.images FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.sites
    WHERE sites.id = images.site_id
    AND sites.user_id = auth.uid()
  ));

CREATE POLICY "Users can upload images"
  ON public.images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own images"
  ON public.images FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images"
  ON public.images FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for images updates
CREATE TRIGGER update_images_updated_at
  BEFORE UPDATE ON public.images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX images_user_id_idx ON public.images(user_id);
CREATE INDEX images_site_id_idx ON public.images(site_id);
CREATE INDEX images_is_public_idx ON public.images(is_public); 