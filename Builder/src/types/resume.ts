export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements?: string[];
}

export interface Skill {
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface Contact {
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  fullName: string;
  summary: string;
  contact: Contact;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects?: Project[];
  languages?: string[];
  certifications?: string[];
  createdAt: string;
  updatedAt: string;
  templateId?: string;
  status: 'draft' | 'published';
  metadata?: Record<string, any>;
}
