import { Theme } from '../../types/theme';
import { ProfileType, TemplateData, TemplateGenerator, TemplateStyle } from './types';

class TemplateStyleImpl implements TemplateStyle {
  styleType: ProfileType;
  colors: TemplateStyle['colors'];
  typography: TemplateStyle['typography'];
  layout: TemplateStyle['layout'];

  constructor(styleType: ProfileType) {
    this.styleType = styleType;
    this.colors = this.getColorScheme();
    this.typography = this.getTypography();
    this.layout = this.getLayout();
  }

  private getColorScheme(): TemplateStyle['colors'] {
    const schemes: Record<ProfileType, TemplateStyle['colors']> = {
      developer: {
        primary: '#0066cc',
        secondary: '#2d3748',
        accent: '#38b2ac',
        background: '#ffffff',
        text: '#2d3748',
        headings: '#1a202c',
      },
      entrepreneur: {
        primary: '#2c5282',
        secondary: '#2d3748',
        accent: '#38a169',
        background: '#ffffff',
        text: '#2d3748',
        headings: '#1a202c',
      },
      artist: {
        primary: '#805ad5',
        secondary: '#2d3748',
        accent: '#d53f8c',
        background: '#ffffff',
        text: '#2d3748',
        headings: '#1a202c',
      },
      musician: {
        primary: '#d53f8c',
        secondary: '#2d3748',
        accent: '#805ad5',
        background: '#ffffff',
        text: '#2d3748',
        headings: '#1a202c',
      },
      academic: {
        primary: '#2c5282',
        secondary: '#2d3748',
        accent: '#805ad5',
        background: '#ffffff',
        text: '#2d3748',
        headings: '#1a202c',
      },
    };

    return schemes[this.styleType];
  }

  private getTypography(): TemplateStyle['typography'] {
    const typography: Record<ProfileType, TemplateStyle['typography']> = {
      developer: {
        heading: 'Inter',
        body: 'Inter',
        accent: 'Inter',
        sizes: {
          h1: '2.5rem',
          h2: '2rem',
          h3: '1.5rem',
          body: '1rem',
          small: '0.875rem',
        },
      },
      entrepreneur: {
        heading: 'Montserrat',
        body: 'Inter',
        accent: 'Montserrat',
        sizes: {
          h1: '3rem',
          h2: '2.25rem',
          h3: '1.75rem',
          body: '1rem',
          small: '0.875rem',
        },
      },
      artist: {
        heading: 'Playfair Display',
        body: 'Inter',
        accent: 'Playfair Display',
        sizes: {
          h1: '3.5rem',
          h2: '2.5rem',
          h3: '2rem',
          body: '1.125rem',
          small: '0.875rem',
        },
      },
      musician: {
        heading: 'Lora',
        body: 'Inter',
        accent: 'Lora',
        sizes: {
          h1: '3rem',
          h2: '2.25rem',
          h3: '1.75rem',
          body: '1.125rem',
          small: '0.875rem',
        },
      },
      academic: {
        heading: 'Merriweather',
        body: 'Inter',
        accent: 'Merriweather',
        sizes: {
          h1: '2.75rem',
          h2: '2.25rem',
          h3: '1.75rem',
          body: '1rem',
          small: '0.875rem',
        },
      },
    };

    return typography[this.styleType];
  }

  private getLayout(): TemplateStyle['layout'] {
    const layouts: Record<ProfileType, TemplateStyle['layout']> = {
      developer: {
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
      },
      entrepreneur: {
        maxWidth: '1400px',
        spacing: {
          section: '5rem',
          element: '2rem',
        },
        useIcons: true,
        borderRadius: '0.75rem',
        shadows: {
          light: '0 2px 4px rgba(0,0,0,0.1)',
          medium: '0 6px 12px rgba(0,0,0,0.1)',
          strong: '0 15px 25px rgba(0,0,0,0.1)',
        },
      },
      artist: {
        maxWidth: '1600px',
        spacing: {
          section: '6rem',
          element: '2.5rem',
        },
        useIcons: false,
        borderRadius: '1rem',
        shadows: {
          light: '0 2px 6px rgba(0,0,0,0.08)',
          medium: '0 8px 16px rgba(0,0,0,0.08)',
          strong: '0 20px 30px rgba(0,0,0,0.08)',
        },
      },
      musician: {
        maxWidth: '1400px',
        spacing: {
          section: '5rem',
          element: '2rem',
        },
        useIcons: false,
        borderRadius: '0.5rem',
        shadows: {
          light: '0 2px 4px rgba(0,0,0,0.1)',
          medium: '0 6px 12px rgba(0,0,0,0.1)',
          strong: '0 15px 25px rgba(0,0,0,0.1)',
        },
      },
      academic: {
        maxWidth: '1200px',
        spacing: {
          section: '4rem',
          element: '1.5rem',
        },
        useIcons: true,
        borderRadius: '0.25rem',
        shadows: {
          light: '0 1px 2px rgba(0,0,0,0.1)',
          medium: '0 3px 6px rgba(0,0,0,0.1)',
          strong: '0 8px 12px rgba(0,0,0,0.1)',
        },
      },
    };

    return layouts[this.styleType];
  }
}

export class TemplateGeneratorImpl implements TemplateGenerator {
  private templatesPath: string;
  private staticPath: string;

  constructor() {
    this.templatesPath = 'templates';
    this.staticPath = 'static';
  }

  generateTemplate(profileType: ProfileType, data: Record<string, any>): TemplateData {
    const style = new TemplateStyleImpl(profileType);
    const now = new Date().toISOString();

    return {
      template: {
        name: `${profileType}_template`,
        style: profileType,
        colors: style.colors,
        typography: style.typography,
        layout: style.layout,
      },
      content: this.generateContentStructure(data, style),
      assets: this.generateAssetList(style),
      meta: {
        createdAt: now,
        updatedAt: now,
        version: '1.0.0',
        theme: this.generateTheme(style),
      },
    };
  }

  private generateTheme(style: TemplateStyle): Theme {
    return {
      id: `theme_${style.styleType}_${Date.now()}`,
      name: `${style.styleType.charAt(0).toUpperCase() + style.styleType.slice(1)} Theme`,
      colors: style.colors,
      typography: style.typography,
      layout: style.layout,
    };
  }

  private generateContentStructure(
    data: Record<string, any>,
    style: TemplateStyle
  ): TemplateData['content'] {
    const sections = {
      developer: ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact'],
      entrepreneur: ['hero', 'about', 'ventures', 'achievements', 'expertise', 'contact'],
      artist: ['hero', 'about', 'portfolio', 'exhibitions', 'statement', 'contact'],
      musician: ['hero', 'about', 'performances', 'repertoire', 'media', 'contact'],
      academic: ['hero', 'about', 'research', 'publications', 'teaching', 'education', 'contact'],
    };

    return {
      sections: sections[style.styleType],
      data,
    };
  }

  private generateAssetList(style: TemplateStyle): TemplateData['assets'] {
    return {
      fonts: [style.typography.heading, style.typography.body, style.typography.accent],
      icons: style.layout.useIcons
        ? ['email', 'phone', 'location', 'linkedin', 'github', 'website']
        : [],
      images: [],
    };
  }

  generateHTML(templateData: TemplateData): string {
    const { template, content } = templateData;
    let html = this.generateHTMLBoilerplate(template);

    content.sections.forEach(section => {
      html = html.replace(
        '<!-- CONTENT -->',
        `${this.generateSectionHTML(section, template)}\n<!-- CONTENT -->`
      );
    });

    return html.replace('<!-- CONTENT -->', '');
  }

  private generateHTMLBoilerplate(template: TemplateData['template']): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.name}</title>
    <link rel="stylesheet" href="styles.css">
    ${this.generateFontLinks(template)}
</head>
<body class="theme-${template.style}">
    <!-- CONTENT -->
    <script src="script.js"></script>
</body>
</html>`;
  }

  private generateFontLinks(template: TemplateData['template']): string {
    const fonts = new Set([
      template.typography.heading,
      template.typography.body,
      template.typography.accent,
    ]);

    return Array.from(fonts)
      .map(
        font =>
          `<link href="https://fonts.googleapis.com/css2?family=${font.replace(
            ' ',
            '+'
          )}&display=swap" rel="stylesheet">`
      )
      .join('\n    ');
  }

  generateCSS(templateData: TemplateData): string {
    const { template } = templateData;
    return `
    :root {
      --color-primary: ${template.colors.primary};
      --color-secondary: ${template.colors.secondary};
      --color-accent: ${template.colors.accent};
      --color-background: ${template.colors.background};
      --color-text: ${template.colors.text};
      --color-headings: ${template.colors.headings};
      
      --font-heading: '${template.typography.heading}', sans-serif;
      --font-body: '${template.typography.body}', sans-serif;
      --font-accent: '${template.typography.accent}', sans-serif;
      
      --size-h1: ${template.typography.sizes.h1};
      --size-h2: ${template.typography.sizes.h2};
      --size-h3: ${template.typography.sizes.h3};
      --size-body: ${template.typography.sizes.body};
      --size-small: ${template.typography.sizes.small};
      
      --spacing-section: ${template.layout.spacing.section};
      --spacing-element: ${template.layout.spacing.element};
      
      --border-radius: ${template.layout.borderRadius};
      --shadow-light: ${template.layout.shadows.light};
      --shadow-medium: ${template.layout.shadows.medium};
      --shadow-strong: ${template.layout.shadows.strong};
      
      --max-width: ${template.layout.maxWidth};
    }
    
    /* Reset and base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: var(--font-body);
      color: var(--color-text);
      background-color: var(--color-background);
      line-height: 1.6;
    }
    
    h1, h2, h3 {
      font-family: var(--font-heading);
      color: var(--color-headings);
      margin-bottom: var(--spacing-element);
    }
    
    h1 { font-size: var(--size-h1); }
    h2 { font-size: var(--size-h2); }
    h3 { font-size: var(--size-h3); }
    
    p { margin-bottom: 1rem; }
    
    .container {
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .section {
      padding: var(--spacing-section) 0;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      :root {
        --size-h1: calc(${template.typography.sizes.h1} * 0.8);
        --size-h2: calc(${template.typography.sizes.h2} * 0.8);
        --size-h3: calc(${template.typography.sizes.h3} * 0.8);
        --spacing-section: calc(${template.layout.spacing.section} * 0.8);
        --spacing-element: calc(${template.layout.spacing.element} * 0.8);
      }
    }
    `;
  }

  generateJS(templateData: TemplateData): string {
    return `
    document.addEventListener('DOMContentLoaded', function() {
      // Initialize smooth scrolling
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
          });
        });
      });
      
      // Initialize intersection observer for animations
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.1 }
      );
      
      document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
      });
    });
    `;
  }

  async saveTemplate(templateName: string, templateData: TemplateData): Promise<void> {
    // TODO: Implement template saving logic
    console.log(`Saving template: ${templateName}`);
  }

  generatePreview(templateData: TemplateData): string {
    return this.generateHTML(templateData);
  }
}
