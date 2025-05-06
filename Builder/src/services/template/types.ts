import { Theme } from '../../types/theme';

export type ProfileType = 'developer' | 'entrepreneur' | 'artist' | 'musician' | 'academic';

export interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  highlights?: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies?: string[];
  url?: string;
  images?: string[];
  highlights?: string[];
}

export interface Education {
  degree: string;
  field?: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  achievements?: string[];
}

export interface Recognition {
  title: string;
  issuer: string;
  date: string;
  description?: string;
  url?: string;
}

export interface TemplateStyle {
  styleType: ProfileType;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    headings: string;
  };
  typography: {
    heading: string;
    body: string;
    accent: string;
    sizes: {
      h1: string;
      h2: string;
      h3: string;
      body: string;
      small: string;
    };
  };
  layout: {
    maxWidth: string;
    spacing: {
      section: string;
      element: string;
    };
    useIcons: boolean;
    borderRadius: string;
    shadows: {
      light: string;
      medium: string;
      strong: string;
    };
  };
}

export interface TemplateData {
  template: {
    name: string;
    style: ProfileType;
    colors: TemplateStyle['colors'];
    typography: TemplateStyle['typography'];
    layout: TemplateStyle['layout'];
  };
  content: {
    sections: string[];
    data: Record<string, any>;
  };
  assets: {
    fonts: string[];
    icons: string[];
    images?: string[];
  };
  meta: {
    createdAt: string;
    updatedAt: string;
    version: string;
    theme: Theme;
  };
}

export interface TemplateGenerator {
  generateTemplate(profileType: ProfileType, data: Record<string, any>): TemplateData;
  generateHTML(templateData: TemplateData): string;
  generateCSS(templateData: TemplateData): string;
  generateJS(templateData: TemplateData): string;
  saveTemplate(templateName: string, templateData: TemplateData): Promise<void>;
  generatePreview(templateData: TemplateData): string;
}
