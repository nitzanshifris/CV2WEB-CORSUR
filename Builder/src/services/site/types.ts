export interface SiteConfig {
  domain: string;
  content: {
    personalInfo: {
      fullName: string;
      title: string;
      email: string;
      phone: string;
      location: string;
      summary: string;
      social: {
        linkedin?: string;
        github?: string;
        twitter?: string;
        website?: string;
      };
    };
    sections: {
      experience: Array<{
        title: string;
        company: string;
        location: string;
        startDate: string;
        endDate: string;
        description: string[];
      }>;
      education: Array<{
        degree: string;
        institution: string;
        location: string;
        graduationYear: string;
        gpa?: string;
        achievements?: string[];
      }>;
      skills: {
        technical: string[];
        soft: string[];
        languages: string[];
      };
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
    };
    style: {
      theme: 'light' | 'dark' | 'system';
      primaryColor: string;
      secondaryColor: string;
      fontFamily: string;
      layout: 'modern' | 'minimal' | 'creative';
    };
  };
}
