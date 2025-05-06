import { ParsedResume } from '../parser';

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  html: string;
  styles: string;
  theme: Theme;
  sections: {
    id: string;
    name: string;
    required: boolean;
    order: number;
  }[];
}

export interface TemplateData extends ParsedResume {
  theme: Theme;
  customStyles?: string;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}
