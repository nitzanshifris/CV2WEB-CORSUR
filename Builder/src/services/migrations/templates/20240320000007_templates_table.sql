-- Add additional fields to templates table
ALTER TABLE templates
ADD COLUMN category VARCHAR(100),
ADD COLUMN tags TEXT[],
ADD COLUMN is_public BOOLEAN DEFAULT false,
ADD COLUMN author_id UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN version INTEGER DEFAULT 1,
ADD COLUMN status VARCHAR(50) DEFAULT 'draft';

-- Create template versions table
CREATE TABLE template_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  html TEXT NOT NULL,
  css TEXT NOT NULL,
  js TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (template_id, version)
);

-- Create template categories table
CREATE TABLE template_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create template tags table
CREATE TABLE template_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create template_tags junction table
CREATE TABLE template_tag_relations (
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES template_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (template_id, tag_id)
);

-- Insert default categories
INSERT INTO template_categories (name, description) VALUES
  ('Portfolio', 'Personal portfolio websites'),
  ('Business', 'Business and corporate websites'),
  ('Blog', 'Blog and content websites'),
  ('Landing Page', 'Single page landing websites'),
  ('E-commerce', 'Online store websites');

-- Insert default tags
INSERT INTO template_tags (name) VALUES
  ('Modern'),
  ('Minimal'),
  ('Dark'),
  ('Light'),
  ('Responsive'),
  ('Creative'),
  ('Professional'),
  ('Elegant'),
  ('Bold'),
  ('Clean'); 