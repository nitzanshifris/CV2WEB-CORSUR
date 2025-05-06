export interface CVData {
  personalInfo: {
    name: string;
    title: string;
    contact: Record<string, string>;
    summary: string;
  };
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    description: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location?: string;
    graduationYear: string;
    gpa?: string;
    achievements?: string[];
  }>;
  projects?: Array<{
    name: string;
    year: string;
    description: string;
    technologies?: string[];
    link?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    link?: string;
  }>;
  languages?: Array<{
    name: string;
    proficiency: string;
  }>;
  awards?: Array<{
    title: string;
    year: string;
    description: string;
  }>;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Project {
  name: string;
  year: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  graduationYear: string;
}

export interface Recognition {
  title: string;
  year: string;
  description: string;
}

export interface Resume {
  name: string;
  title: string;
  profile: string;
  contact: Record<string, string>;
  expertise: string[];
  software: string[];
  experience: Experience[];
  education: Education[];
  freelanceProjects: Project[];
  recognition: Recognition[];
}

export interface ResumeParser {
  parseResumeText(text: string): Resume;
  parseDate(dateStr: string): string;
  extractDateRange(dateRange: string): [string, string];
  parseExperience(expText: string): Experience;
  parseProjects(projectText: string): Project;
  parseRecognition(recogText: string): Recognition;
}
