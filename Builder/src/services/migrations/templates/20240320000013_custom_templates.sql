-- Create custom templates table
CREATE TABLE custom_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  html TEXT NOT NULL,
  css TEXT NOT NULL,
  js TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create custom template versions table
CREATE TABLE custom_template_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES custom_templates(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  html TEXT NOT NULL,
  css TEXT NOT NULL,
  js TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (template_id, version)
);

-- Create trigger for custom template versioning
CREATE OR REPLACE FUNCTION handle_custom_template_version()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.html != NEW.html OR OLD.css != NEW.css OR OLD.js != NEW.js THEN
    INSERT INTO custom_template_versions (
      template_id,
      version,
      html,
      css,
      js
    ) VALUES (
      NEW.id,
      COALESCE((SELECT MAX(version) FROM custom_template_versions WHERE template_id = NEW.id), 0) + 1,
      NEW.html,
      NEW.css,
      NEW.js
    );
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER custom_template_version_trigger
  BEFORE UPDATE ON custom_templates
  FOR EACH ROW
  EXECUTE FUNCTION handle_custom_template_version(); 