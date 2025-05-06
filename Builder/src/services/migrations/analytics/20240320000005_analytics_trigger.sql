-- Create function to track page views
CREATE OR REPLACE FUNCTION track_page_view()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert analytics record for today
  INSERT INTO analytics (site_id, page_views, unique_visitors, date)
  VALUES (NEW.site_id, 1, 1, CURRENT_DATE)
  ON CONFLICT (site_id, date) DO UPDATE
  SET 
    page_views = analytics.page_views + 1,
    unique_visitors = analytics.unique_visitors + 
      CASE WHEN NOT EXISTS (
        SELECT 1 FROM analytics_visitors 
        WHERE site_id = NEW.site_id 
        AND visitor_id = NEW.visitor_id 
        AND date = CURRENT_DATE
      ) THEN 1 ELSE 0 END;
  
  -- Track unique visitor
  INSERT INTO analytics_visitors (site_id, visitor_id, date)
  VALUES (NEW.site_id, NEW.visitor_id, CURRENT_DATE)
  ON CONFLICT (site_id, visitor_id, date) DO NOTHING;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create analytics_visitors table
CREATE TABLE analytics_visitors (
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (site_id, visitor_id, date)
);

-- Create trigger for page views
CREATE TRIGGER track_page_view_trigger
  AFTER INSERT ON page_views
  FOR EACH ROW
  EXECUTE FUNCTION track_page_view(); 