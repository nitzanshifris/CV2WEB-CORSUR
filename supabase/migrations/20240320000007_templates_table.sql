-- Create templates table
CREATE TABLE public.templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  preview_url TEXT,
  content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index
CREATE INDEX templates_is_active_idx ON public.templates(is_active);

-- Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view active templates"
  ON public.templates FOR SELECT
  USING (is_active = true);

-- Insert default templates
INSERT INTO public.templates (id, name, description, content) VALUES
('modern', 'מודרני', 'עיצוב מודרני וקליל', '{
  "sections": [
    {
      "id": "header",
      "type": "header",
      "blocks": [
        {
          "type": "hero",
          "id": "hero",
          "heading": "שם מלא",
          "subheading": "תפקיד",
          "content": "תיאור קצר"
        }
      ]
    },
    {
      "id": "experience",
      "type": "experience",
      "blocks": [
        {
          "type": "section",
          "id": "experience",
          "heading": "ניסיון תעסוקתי",
          "items": []
        }
      ]
    },
    {
      "id": "education",
      "type": "education",
      "blocks": [
        {
          "type": "section",
          "id": "education",
          "heading": "השכלה",
          "items": []
        }
      ]
    },
    {
      "id": "skills",
      "type": "skills",
      "blocks": [
        {
          "type": "section",
          "id": "skills",
          "heading": "מיומנויות",
          "items": []
        }
      ]
    }
  ],
  "styles": {
    "primaryColor": "#2563eb",
    "secondaryColor": "#1e40af",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "fontFamily": "Inter",
    "borderRadius": "0.5rem"
  }
}'),
('minimal', 'מינימליסטי', 'עיצוב נקי ופשוט', '{
  "sections": [
    {
      "id": "header",
      "type": "header",
      "blocks": [
        {
          "type": "hero",
          "id": "hero",
          "heading": "שם מלא",
          "subheading": "תפקיד",
          "content": "תיאור קצר"
        }
      ]
    },
    {
      "id": "experience",
      "type": "experience",
      "blocks": [
        {
          "type": "section",
          "id": "experience",
          "heading": "ניסיון תעסוקתי",
          "items": []
        }
      ]
    },
    {
      "id": "education",
      "type": "education",
      "blocks": [
        {
          "type": "section",
          "id": "education",
          "heading": "השכלה",
          "items": []
        }
      ]
    },
    {
      "id": "skills",
      "type": "skills",
      "blocks": [
        {
          "type": "section",
          "id": "skills",
          "heading": "מיומנויות",
          "items": []
        }
      ]
    }
  ],
  "styles": {
    "primaryColor": "#000000",
    "secondaryColor": "#333333",
    "backgroundColor": "#ffffff",
    "textColor": "#000000",
    "fontFamily": "Inter",
    "borderRadius": "0"
  }
}'),
('creative', 'יצירתי', 'עיצוב ייחודי ומקורי', '{
  "sections": [
    {
      "id": "header",
      "type": "header",
      "blocks": [
        {
          "type": "hero",
          "id": "hero",
          "heading": "שם מלא",
          "subheading": "תפקיד",
          "content": "תיאור קצר"
        }
      ]
    },
    {
      "id": "experience",
      "type": "experience",
      "blocks": [
        {
          "type": "section",
          "id": "experience",
          "heading": "ניסיון תעסוקתי",
          "items": []
        }
      ]
    },
    {
      "id": "education",
      "type": "education",
      "blocks": [
        {
          "type": "section",
          "id": "education",
          "heading": "השכלה",
          "items": []
        }
      ]
    },
    {
      "id": "skills",
      "type": "skills",
      "blocks": [
        {
          "type": "section",
          "id": "skills",
          "heading": "מיומנויות",
          "items": []
        }
      ]
    }
  ],
  "styles": {
    "primaryColor": "#7c3aed",
    "secondaryColor": "#5b21b6",
    "backgroundColor": "#f3f4f6",
    "textColor": "#1f2937",
    "fontFamily": "Inter",
    "borderRadius": "1rem"
  }
}'); 