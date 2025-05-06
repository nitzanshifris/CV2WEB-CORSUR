import { Resume } from './types';

export interface TemplateContext {
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  fonts: string[];
  professionType: string;
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
  };
  sections: {
    about: string;
    experience: Array<{
      title: string;
      company: string;
      location: string;
      dates: string;
      description: string[];
    }>;
    education: Array<{
      degree: string;
      institution: string;
      year: string;
    }>;
    projects: Array<{
      title: string;
      year: string;
      description: string;
      image: string;
      link: string;
    }>;
    recognition: Array<{
      title: string;
      year: string;
      description: string;
    }>;
  };
  skills: string[];
  software: string[];
  socialLinks: Record<string, string>;
  contactMessage: string;
}

export class ResumeConverter {
  static toTemplateContext(resume: Resume): TemplateContext {
    return {
      meta: {
        title: `${resume.name} - ${resume.title}`,
        description: resume.profile,
        keywords: [...resume.expertise, ...resume.software],
      },
      fonts: ['Roboto', 'Open Sans'], // Default fonts, can be customized
      professionType: 'creative', // Can be determined based on resume content
      personalInfo: {
        name: resume.name,
        title: resume.title,
        email: resume.contact['email'] || '',
        phone: resume.contact['phone'] || '',
        location: resume.contact['location'] || '',
        website: resume.contact['website'] || '',
        summary: resume.profile,
      },
      sections: {
        about: resume.profile,
        experience: resume.experience.map(exp => ({
          title: exp.title,
          company: exp.company,
          location: exp.location,
          dates: `${exp.startDate} - ${exp.endDate}`,
          description: exp.description,
        })),
        education: resume.education.map(edu => ({
          degree: edu.degree,
          institution: edu.institution,
          year: edu.graduationYear,
        })),
        projects: resume.freelanceProjects.map(proj => ({
          title: proj.name,
          year: proj.year,
          description: proj.description,
          image: '', // Placeholder for project image
          link: '', // Placeholder for project link
        })),
        recognition: resume.recognition.map(rec => ({
          title: rec.title,
          year: rec.year,
          description: rec.description,
        })),
      },
      skills: resume.expertise,
      software: resume.software,
      socialLinks: {}, // Can be extracted from contact info if available
      contactMessage: "I'm always interested in hearing about new projects and opportunities.",
    };
  }

  static generateCssVariables(resume: Resume): Record<string, string> {
    // This could be customized based on the resume's industry/profession
    return {
      'creative-primary': '#FF6B6B', // Warm red for creative professionals
      'creative-secondary': '#4ECDC4', // Teal for balance
      'creative-accent': '#FFE66D', // Yellow for emphasis
      'creative-dark': '#2C3E50', // Navy for text
      'creative-light': '#F7F7F7', // Light gray for backgrounds
    };
  }

  static getTemplateName(resume: Resume): string {
    const title = resume.title.toLowerCase();

    if (this.matchesKeywords(title, ['designer', 'artist', 'creative', 'photographer'])) {
      return 'creative';
    } else if (this.matchesKeywords(title, ['developer', 'engineer', 'programmer'])) {
      return 'technical';
    } else if (this.matchesKeywords(title, ['professor', 'researcher', 'phd'])) {
      return 'academic';
    } else {
      return 'professional';
    }
  }

  private static matchesKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(kw => text.includes(kw));
  }
}
