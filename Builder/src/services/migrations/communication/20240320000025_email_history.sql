-- Create email_history table
CREATE TABLE email_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'sent', -- 'sent', 'failed', 'delivered'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster email history lookups
CREATE INDEX idx_email_history_template ON email_history (template_id);
CREATE INDEX idx_email_history_recipient ON email_history (recipient_email);
CREATE INDEX idx_email_history_status ON email_history (status);
CREATE INDEX idx_email_history_created ON email_history (created_at); 