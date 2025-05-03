-- Create messages table
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' NOT NULL,
  attachments JSONB,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their sent messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can view their received messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can delete their messages"
  ON public.messages FOR DELETE
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Create trigger for messages updates
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX messages_sender_id_idx ON public.messages(sender_id);
CREATE INDEX messages_receiver_id_idx ON public.messages(receiver_id);
CREATE INDEX messages_site_id_idx ON public.messages(site_id);
CREATE INDEX messages_priority_idx ON public.messages(priority);
CREATE INDEX messages_is_read_idx ON public.messages(is_read); 