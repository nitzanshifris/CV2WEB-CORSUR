-- Create page_views table
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL,
  page_url VARCHAR(255) NOT NULL,
  referrer_url VARCHAR(255),
  user_agent TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster analytics queries
CREATE INDEX idx_page_views_site_date ON page_views (site_id, created_at);
CREATE INDEX idx_page_views_visitor ON page_views (visitor_id);

-- Add unique constraint to analytics table
ALTER TABLE analytics
ADD CONSTRAINT analytics_site_date_unique UNIQUE (site_id, date); 