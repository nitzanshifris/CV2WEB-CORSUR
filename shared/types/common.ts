export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Site {
  id: string;
  user_id: string;
  name: string;
  content: any;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  html: string;
  css: string;
  js: string;
  created_at: string;
  updated_at: string;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  links?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
}
