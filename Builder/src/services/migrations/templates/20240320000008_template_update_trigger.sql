-- Create trigger to handle template versioning
CREATE OR REPLACE FUNCTION handle_template_version()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.html != NEW.html OR OLD.css != NEW.css OR OLD.js != NEW.js THEN
    NEW.version = OLD.version + 1;
    
    INSERT INTO template_versions (
      template_id,
      version,
      html,
      css,
      js,
      created_by
    ) VALUES (
      NEW.id,
      NEW.version,
      NEW.html,
      NEW.css,
      NEW.js,
      NEW.author_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER template_version_trigger
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION handle_template_version(); 