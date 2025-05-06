export interface TemplateSection {
  id: string;
  name: string;
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'custom';
  required: boolean;
  order: number;
  styles?: Record<string, any>;
}

export interface TemplateStyle {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  typography: {
    fontFamily: string;
    headingSize: string;
    bodySize: string;
    lineHeight: string;
  };
  spacing: {
    sectionGap: string;
    elementGap: string;
    padding: string;
  };
  layout: {
    maxWidth: string;
    columns: number;
    alignment: 'left' | 'center' | 'right';
  };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  version: string;
  sections: TemplateSection[];
  styles: TemplateStyle;
  isPremium: boolean;
  category: 'professional' | 'creative' | 'minimal' | 'modern';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: string;
  metadata?: Record<string, any>;
}

export interface TemplatePreview {
  id: string;
  templateId: string;
  html: string;
  css: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface TemplateEngine {
  compile: (template: Template, data: any) => Promise<string>;
  validate: (template: Template) => boolean;
  render: (template: Template, data: any) => Promise<string>;
}
