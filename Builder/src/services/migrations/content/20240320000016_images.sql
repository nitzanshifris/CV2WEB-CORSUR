-- Create images table
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  path VARCHAR(255) NOT NULL,
  size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster image lookups
CREATE INDEX idx_images_site ON images (site_id);
CREATE INDEX idx_images_user ON images (user_id);
CREATE INDEX idx_images_name ON images (name);
CREATE INDEX idx_images_path ON images (path);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for images
CREATE TRIGGER update_images_updated_at
  BEFORE UPDATE ON images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 