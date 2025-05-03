-- Create function to handle site updates
CREATE OR REPLACE FUNCTION public.handle_site_update()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.revisions (site_id, content)
  VALUES (NEW.id, NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for site updates
CREATE TRIGGER on_site_updated
  AFTER UPDATE ON public.sites
  FOR EACH ROW
  WHEN (OLD.content IS DISTINCT FROM NEW.content)
  EXECUTE FUNCTION public.handle_site_update(); 