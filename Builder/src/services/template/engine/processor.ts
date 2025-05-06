import Handlebars from 'handlebars';
import { Template, TemplateData } from './types';

// Register custom helpers
Handlebars.registerHelper('formatDate', (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
});

Handlebars.registerHelper('join', (array: string[], separator: string = ', ') => {
  return array.join(separator);
});

Handlebars.registerHelper(
  'ifEquals',
  function (arg1: any, arg2: any, options: Handlebars.TemplateDelegate) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  }
);

export class TemplateProcessor {
  private template: Template;

  constructor(template: Template) {
    this.template = template;
  }

  async process(data: TemplateData): Promise<string> {
    try {
      // Compile the template
      const compiledTemplate = Handlebars.compile(this.template.html);

      // Process the data
      const processedData = {
        ...data,
        sections: this.template.sections.map(section => ({
          ...section,
          content: this.getSectionContent(section.id, data),
        })),
      };

      // Generate the HTML
      const html = compiledTemplate(processedData);

      // Add responsive styles and meta tags
      const styledHtml = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="theme-color" content="${data.theme.colors.primary}">
            ${data.meta?.title ? `<title>${data.meta.title}</title>` : ''}
            ${
              data.meta?.description
                ? `<meta name="description" content="${data.meta.description}">`
                : ''
            }
            ${
              data.meta?.keywords
                ? `<meta name="keywords" content="${data.meta.keywords.join(', ')}">`
                : ''
            }
            <style>
              ${this.template.styles}
              ${data.customStyles || ''}
            </style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `;

      return styledHtml;
    } catch (error) {
      console.error('Error processing template:', error);
      throw new Error('Failed to process template');
    }
  }

  private getSectionContent(sectionId: string, data: TemplateData): any {
    switch (sectionId) {
      case 'personal':
        return {
          fullName: data.fullName,
          title: data.title,
          email: data.email,
          phone: data.phone,
          summary: data.summary,
        };
      case 'skills':
        return data.skills;
      case 'experience':
        return data.experience;
      case 'education':
        return data.education;
      default:
        return null;
    }
  }
}
