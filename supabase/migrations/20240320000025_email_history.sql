-- Create email_history table
CREATE TABLE public.email_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL,
  error TEXT,
  error_details JSONB,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.email_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can view email history"
  ON public.email_history FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

CREATE POLICY "System can insert email history"
  ON public.email_history FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update email history"
  ON public.email_history FOR UPDATE
  USING (true);

-- Create trigger for email history updates
CREATE TRIGGER update_email_history_updated_at
  BEFORE UPDATE ON public.email_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster queries
CREATE INDEX email_history_recipient_idx ON public.email_history(recipient);
CREATE INDEX email_history_status_idx ON public.email_history(status);
CREATE INDEX email_history_template_id_idx ON public.email_history(template_id);
CREATE INDEX email_history_retry_count_idx ON public.email_history(retry_count);
CREATE INDEX email_history_created_at_idx ON public.email_history(created_at); 