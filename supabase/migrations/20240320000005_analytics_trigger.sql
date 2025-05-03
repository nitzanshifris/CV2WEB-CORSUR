-- Create function to handle site visits
CREATE OR REPLACE FUNCTION public.handle_site_visit()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to update existing record
  UPDATE public.analytics
  SET 
    page_views = page_views + 1,
    unique_visitors = CASE 
      WHEN NEW.visitor_id IS DISTINCT FROM OLD.visitor_id 
      THEN unique_visitors + 1 
      ELSE unique_visitors 
    END
  WHERE site_id = NEW.site_id AND date = CURRENT_DATE;
  
  -- If no record exists, create a new one
  IF NOT FOUND THEN
    INSERT INTO public.analytics (site_id, page_views, unique_visitors, date)
    VALUES (NEW.site_id, 1, 1, CURRENT_DATE);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for site visits
CREATE TRIGGER on_site_visited
  AFTER INSERT ON public.site_visits
  FOR EACH ROW EXECUTE FUNCTION public.handle_site_visit(); 