import { Theme } from '../../types/theme';
import { Resume } from '../parser/resume-parser';
import { ProfileType, TemplateData } from '../template/types';

export interface TemplateContext {
  resume: Resume;
  profileType: ProfileType;
  theme?: Theme;
  customizations?: {
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
    };
    fonts?: {
      heading?: string;
      body?: string;
    };
    layout?: {
      maxWidth?: string;
      spacing?: {
        section?: string;
        element?: string;
      };
    };
  };
}

export class ResumeConverter {
  private defaultColors = {
    developer: {
      primary: '#0066cc',
      secondary: '#2d3748',
      accent: '#38b2ac',
    },
    entrepreneur: {
      primary: '#2c5282',
      secondary: '#2d3748',
      accent: '#38a169',
    },
    artist: {
      primary: '#805ad5',
      secondary: '#2d3748',
      accent: '#d53f8c',
    },
    musician: {
      primary: '#d53f8c',
      secondary: '#2d3748',
      accent: '#805ad5',
    },
    academic: {
      primary: '#2c5282',
      secondary: '#2d3748',
      accent: '#805ad5',
    },
  };

  private defaultFonts = {
    developer: {
      heading: 'Inter',
      body: 'Inter',
    },
    entrepreneur: {
      heading: 'Montserrat',
      body: 'Inter',
    },
    artist: {
      heading: 'Playfair Display',
      body: 'Inter',
    },
    musician: {
      heading: 'Lora',
      body: 'Inter',
    },
    academic: {
      heading: 'Merriweather',
      body: 'Inter',
    },
  };

  convert(context: TemplateContext): TemplateData {
    const { resume, profileType, theme, customizations } = context;
    const now = new Date().toISOString();

    const colors = this.generateColors(profileType, customizations?.colors);
    const fonts = this.generateFonts(profileType, customizations?.fonts);
    const layout = this.generateLayout(profileType, customizations?.layout);

    return {
      template: {
        name: this.generateTemplateName(resume, profileType),
        style: profileType,
        colors: {
          ...colors,
          background: '#ffffff',
          text: '#2d3748',
          headings: '#1a202c',
        },
        typography: {
          ...fonts,
          accent: fonts.heading,
          sizes: {
            h1: '2.5rem',
            h2: '2rem',
            h3: '1.5rem',
            body: '1rem',
            small: '0.875rem',
          },
        },
        layout,
      },
      content: {
        sections: this.generateSections(profileType, resume),
        data: this.transformResumeData(resume, profileType),
      },
      assets: {
        fonts: [fonts.heading, fonts.body],
        icons: this.generateIconList(resume),
        images: this.extractImages(resume),
      },
      meta: {
        createdAt: now,
        updatedAt: now,
        version: '1.0.0',
        theme: theme || this.generateDefaultTheme(profileType, colors, fonts, layout),
      },
    };
  }

  private generateTemplateName(resume: Resume, profileType: ProfileType): string {
    const name = resume.fullName.toLowerCase().replace(/\s+/g, '-');
    return `${name}-${profileType}-template`;
  }

  private generateColors(
    profileType: ProfileType,
    customColors?: TemplateContext['customizations']['colors']
  ): TemplateData['template']['colors'] {
    const defaults = this.defaultColors[profileType];
    return {
      primary: customColors?.primary || defaults.primary,
      secondary: customColors?.secondary || defaults.secondary,
      accent: customColors?.accent || defaults.accent,
      background: '#ffffff',
      text: '#2d3748',
      headings: '#1a202c',
    };
  }

  private generateFonts(
    profileType: ProfileType,
    customFonts?: TemplateContext['customizations']['fonts']
  ): Pick<TemplateData['template']['typography'], 'heading' | 'body'> {
    const defaults = this.defaultFonts[profileType];
    return {
      heading: customFonts?.heading || defaults.heading,
      body: customFonts?.body || defaults.body,
    };
  }

  private generateLayout(
    profileType: ProfileType,
    customLayout?: TemplateContext['customizations']['layout']
  ): TemplateData['template']['layout'] {
    const defaults = {
      maxWidth: '1200px',
      spacing: {
        section: '4rem',
        element: '1.5rem',
      },
      useIcons: true,
      borderRadius: '0.5rem',
      shadows: {
        light: '0 1px 3px rgba(0,0,0,0.12)',
        medium: '0 4px 6px rgba(0,0,0,0.1)',
        strong: '0 10px 15px rgba(0,0,0,0.1)',
      },
    };

    return {
      maxWidth: customLayout?.maxWidth || defaults.maxWidth,
      spacing: {
        section: customLayout?.spacing?.section || defaults.spacing.section,
        element: customLayout?.spacing?.element || defaults.spacing.element,
      },
      useIcons: true,
      borderRadius: '0.5rem',
      shadows: defaults.shadows,
    };
  }

  private generateSections(profileType: ProfileType, resume: Resume): string[] {
    const commonSections = ['hero', 'about', 'contact'];
    const typeSections: Record<ProfileType, string[]> = {
      developer: ['skills', 'projects', 'experience', 'education'],
      entrepreneur: ['ventures', 'achievements', 'expertise'],
      artist: ['portfolio', 'exhibitions', 'statement'],
      musician: ['performances', 'repertoire', 'media'],
      academic: ['research', 'publications', 'teaching', 'education'],
    };

    const sections = [...commonSections, ...typeSections[profileType]];
    return this.filterAvailableSections(sections, resume);
  }

  private filterAvailableSections(sections: string[], resume: Resume): string[] {
    const hasContent: Record<string, boolean> = {
      hero: Boolean(resume.fullName),
      about: Boolean(resume.summary),
      skills: Boolean(resume.skills?.length),
      projects: Boolean(resume.projects?.length),
      experience: Boolean(resume.experience?.length),
      education: Boolean(resume.education?.length),
      contact: Boolean(resume.email || resume.phone),
      portfolio: 'portfolio' in resume && Boolean((resume as any).portfolio?.length),
      exhibitions: 'exhibitions' in resume && Boolean((resume as any).exhibitions?.length),
      performances: 'performances' in resume && Boolean((resume as any).performances?.length),
      statement: 'statement' in resume && Boolean((resume as any).statement),
      research: 'research' in resume && Boolean((resume as any).research?.length),
      publications: 'publications' in resume && Boolean((resume as any).publications?.length),
      teaching: 'teaching' in resume && Boolean((resume as any).teaching?.length),
    };

    return sections.filter(section => hasContent[section] !== false);
  }

  private transformResumeData(resume: Resume, profileType: ProfileType): Record<string, any> {
    const baseData = {
      fullName: resume.fullName,
      title: resume.title,
      email: resume.email,
      phone: resume.phone,
      location: resume.location,
      summary: resume.summary,
      skills: resume.skills,
      experience: resume.experience,
      education: resume.education,
      links: resume.links,
    };

    const specializedData = {
      developer: {
        projects: resume.projects,
        githubUrl: resume.links?.find(link => link.type === 'github')?.url,
      },
      entrepreneur: {
        ventures: resume.experience?.map(exp => ({
          ...exp,
          impact: this.extractImpact(exp.description),
        })),
        achievements: resume.recognitions,
      },
      artist: {
        portfolio: (resume as any).portfolio,
        exhibitions: (resume as any).exhibitions,
        statement: (resume as any).statement,
        press: (resume as any).press,
      },
      musician: {
        performances: (resume as any).performances,
        repertoire: this.extractRepertoire(resume),
        media: this.extractMedia(resume),
      },
      academic: {
        research: (resume as any).research,
        publications: (resume as any).publications,
        teaching: (resume as any).teaching,
        grants: resume.recognitions?.filter(r => r.title.toLowerCase().includes('grant')),
      },
    };

    return {
      ...baseData,
      ...specializedData[profileType],
    };
  }

  private generateIconList(resume: Resume): string[] {
    const icons = ['email', 'phone', 'location'];

    if (resume.links) {
      resume.links.forEach(link => {
        const icon = this.getLinkIcon(link.type);
        if (icon) icons.push(icon);
      });
    }

    return Array.from(new Set(icons));
  }

  private extractImages(resume: Resume): string[] {
    const images: string[] = [];

    if ('portfolio' in resume) {
      const portfolio = (resume as any).portfolio;
      portfolio?.forEach((item: any) => {
        if (item.images) images.push(...item.images);
      });
    }

    return images;
  }

  private extractImpact(description: string): string[] {
    const impactRegex =
      /(?:increased|decreased|improved|reduced|achieved|generated|saved|grew|expanded|launched)\s+(?:by\s+)?(?:\d+%|\$[\d,]+|[\d,]+\s+(?:users|customers|clients|sales|revenue))/gi;
    return (description.match(impactRegex) || []).map(impact => impact.trim());
  }

  private extractRepertoire(resume: any): { category: string; pieces: string[] }[] {
    if (!resume.performances) return [];

    const repertoire: Record<string, Set<string>> = {};
    resume.performances.forEach((performance: any) => {
      performance.program?.forEach((piece: string) => {
        const category = this.classifyMusicPiece(piece);
        if (!repertoire[category]) repertoire[category] = new Set();
        repertoire[category].add(piece);
      });
    });

    return Object.entries(repertoire).map(([category, pieces]) => ({
      category,
      pieces: Array.from(pieces),
    }));
  }

  private extractMedia(resume: any): { type: string; url: string; title: string }[] {
    const media: { type: string; url: string; title: string }[] = [];

    if (resume.links) {
      resume.links.forEach((link: { type: string; url: string }) => {
        if (link.type === 'youtube' || link.type === 'vimeo') {
          media.push({
            type: 'video',
            url: link.url,
            title: this.extractVideoTitle(link.url),
          });
        }
      });
    }

    return media;
  }

  private classifyMusicPiece(piece: string): string {
    const categories = {
      Classical: /(?:sonata|symphony|concerto|quartet|opus)/i,
      Opera: /(?:aria|opera|libretto)/i,
      Contemporary: /(?:\d{4}(?:-\d{2,4})?$|\b(?:premiere|commissioned)\b)/i,
      Chamber: /(?:trio|quartet|quintet|ensemble)/i,
    };

    for (const [category, regex] of Object.entries(categories)) {
      if (regex.test(piece)) return category;
    }

    return 'Other';
  }

  private extractVideoTitle(url: string): string {
    const videoId = url.split(/[/?]/)[4];
    return `Performance ${videoId}`;
  }

  private getLinkIcon(type: string): string | null {
    const icons: Record<string, string> = {
      github: 'github',
      linkedin: 'linkedin',
      twitter: 'twitter',
      website: 'website',
      youtube: 'youtube',
      vimeo: 'video',
      behance: 'behance',
      dribbble: 'dribbble',
    };

    return icons[type] || null;
  }

  private generateDefaultTheme(
    profileType: ProfileType,
    colors: TemplateData['template']['colors'],
    fonts: Pick<TemplateData['template']['typography'], 'heading' | 'body'>,
    layout: TemplateData['template']['layout']
  ): Theme {
    return {
      id: `theme_${profileType}_${Date.now()}`,
      name: `${profileType.charAt(0).toUpperCase() + profileType.slice(1)} Theme`,
      colors,
      typography: {
        heading: fonts.heading,
        body: fonts.body,
        accent: fonts.heading,
        sizes: {
          h1: '2.5rem',
          h2: '2rem',
          h3: '1.5rem',
          body: '1rem',
          small: '0.875rem',
        },
      },
      layout,
    };
  }
}
