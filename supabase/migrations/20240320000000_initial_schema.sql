-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create sites table
CREATE TABLE sites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  template_id TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create revisions table
CREATE TABLE revisions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create analytics table
CREATE TABLE analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create settings table
CREATE TABLE settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'he',
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX sites_user_id_idx ON sites(user_id);
CREATE INDEX sites_slug_idx ON sites(slug);
CREATE INDEX revisions_site_id_idx ON revisions(site_id);
CREATE INDEX analytics_site_id_date_idx ON analytics(site_id, date);
CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX settings_user_id_idx ON settings(user_id);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Sites policies
CREATE POLICY "Users can view their own sites"
  ON sites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sites"
  ON sites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sites"
  ON sites FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sites"
  ON sites FOR DELETE
  USING (auth.uid() = user_id);

-- Revisions policies
CREATE POLICY "Users can view their own site revisions"
  ON revisions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM sites
    WHERE sites.id = revisions.site_id
    AND sites.user_id = auth.uid()
  ));

CREATE POLICY "Users can create revisions for their own sites"
  ON revisions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM sites
    WHERE sites.id = revisions.site_id
    AND sites.user_id = auth.uid()
  ));

-- Analytics policies
CREATE POLICY "Users can view their own site analytics"
  ON analytics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM sites
    WHERE sites.id = analytics.site_id
    AND sites.user_id = auth.uid()
  ));

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Settings policies
CREATE POLICY "Users can view their own settings"
  ON settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings"
  ON settings FOR INSERT
  WITH CHECK (auth.uid() = user_id); 