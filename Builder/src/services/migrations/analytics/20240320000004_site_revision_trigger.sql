-- Create trigger to track site revisions
CREATE OR REPLACE FUNCTION track_site_revision()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.content != NEW.content THEN
    INSERT INTO revisions (site_id, content)
    VALUES (NEW.id, NEW.content);
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER site_revision_trigger
  AFTER UPDATE ON sites
  FOR EACH ROW
  EXECUTE FUNCTION track_site_revision(); 