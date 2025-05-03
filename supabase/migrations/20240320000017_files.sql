-- Create files table
CREATE TABLE public.files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  size INTEGER NOT NULL,
  type TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own files"
  ON public.files FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public files"
  ON public.files FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view site files"
  ON public.files FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.sites
    WHERE sites.id = files.site_id
    AND sites.user_id = auth.uid()
  ));

CREATE POLICY "Users can upload files"
  ON public.files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own files"
  ON public.files FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files"
  ON public.files FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for files updates
CREATE TRIGGER update_files_updated_at
  BEFORE UPDATE ON public.files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX files_user_id_idx ON public.files(user_id);
CREATE INDEX files_site_id_idx ON public.files(site_id);
CREATE INDEX files_is_public_idx ON public.files(is_public); 