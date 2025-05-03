-- Create comments table
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view approved comments"
  ON public.comments FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Users can view their own comments"
  ON public.comments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Site owners can view all comments on their sites"
  ON public.comments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.sites
    WHERE sites.id = comments.site_id
    AND sites.user_id = auth.uid()
  ));

CREATE POLICY "Users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Site owners can manage all comments on their sites"
  ON public.comments FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.sites
    WHERE sites.id = comments.site_id
    AND sites.user_id = auth.uid()
  ));

-- Create trigger for comments updates
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 