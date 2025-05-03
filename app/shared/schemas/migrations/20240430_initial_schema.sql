-- Create tables
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.websites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    domain TEXT,
    template_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.cv_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    storage_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    features TEXT[],
    layout TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    website_id UUID REFERENCES public.websites(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id UUID REFERENCES public.websites(id) ON DELETE CASCADE,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indices
CREATE INDEX idx_websites_user_id ON public.websites(user_id);
CREATE INDEX idx_cv_files_user_id ON public.cv_files(user_id);
CREATE INDEX idx_domains_website_id ON public.domains(website_id);
CREATE INDEX idx_revisions_website_id ON public.revisions(website_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own websites" ON public.websites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own websites" ON public.websites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own websites" ON public.websites
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own websites" ON public.websites
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own CV files" ON public.cv_files
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own CV files" ON public.cv_files
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CV files" ON public.cv_files
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view templates" ON public.templates
    FOR SELECT USING (true);

CREATE POLICY "Users can view their own domains" ON public.domains
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.websites WHERE id = website_id));

CREATE POLICY "Users can create domains for their websites" ON public.domains
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.websites WHERE id = website_id));

CREATE POLICY "Users can update their own domains" ON public.domains
    FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.websites WHERE id = website_id));

CREATE POLICY "Users can delete their own domains" ON public.domains
    FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.websites WHERE id = website_id));

CREATE POLICY "Users can view their own revisions" ON public.revisions
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.websites WHERE id = website_id));

CREATE POLICY "Users can create revisions for their websites" ON public.revisions
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.websites WHERE id = website_id));

CREATE POLICY "Users can delete their own revisions" ON public.revisions
    FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.websites WHERE id = website_id));

CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Insert default templates
INSERT INTO public.templates (id, name, description, category, features, layout) VALUES
    ('designer', 'Designer Portfolio', 'Perfect for designers and creative professionals', 'creative', 
     ARRAY['Large project showcase', 'Visual gallery', 'Artistic typography', 'Custom color schemes'], 'portfolio'),
    ('musician', 'Musician Portfolio', 'Ideal for musicians and performers', 'creative',
     ARRAY['Performance gallery', 'Audio player integration', 'Event calendar', 'Press kit section'], 'portfolio'),
    ('developer', 'Developer Portfolio', 'Modern and clean design for developers', 'technical',
     ARRAY['Project showcase', 'GitHub integration', 'Skills visualization', 'Blog section'], 'minimal'); 