export interface SiteConfig {
  id: string;
  userId: string;
  domain: string;
  theme: string;
  content: SiteContent;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteContent {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  socialLinks: SocialLink[];
}

export interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements: string[];
}

export interface Education {
  degree: string;
  institution: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
} 