import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '../types/database.types';
import { sampleTemplates } from './sample-templates';
import type { Block, Template } from './template-engine';

export type CustomizationOptions = {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  headingFont?: string;
  bodyFont?: string;
  layout?: string;
  spacing?: number;
  borderRadius?: number;
  showSocialIcons?: boolean;
  showContactForm?: boolean;
  showSkillBars?: boolean;
  heroStyle?: string;
  imageFilter?: string;
};

export interface ProfileData {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills?: string[];
  experience?: Array<{
    company: string;
    position: string;
    duration: string;
    description?: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
  };
  social?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
    [key: string]: string | undefined;
  };
}

class TemplateService {
  private supabase = createClientComponentClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });

  /**
   * Get all available templates
   */
  async getAllTemplates(): Promise<{ id: string; name: string; description?: string }[]> {
    try {
      // First check if we have templates in the database
      const { data, error } = await this.supabase.from('templates').select('id, name, description');

      if (error) {
        console.warn('Error fetching templates from DB:', error);
        // Fall back to predefined templates
        return Object.entries(sampleTemplates).map(([id, template]) => ({
          id,
          name: template.name,
          description: template.description,
        }));
      }

      if (data && data.length > 0) {
        return data;
      }

      // Fall back to predefined templates if no DB templates
      return Object.entries(sampleTemplates).map(([id, template]) => ({
        id,
        name: template.name,
        description: template.description,
      }));
    } catch (error) {
      console.error('Error in getAllTemplates:', error);
      // Fallback to sample templates in case of error
      return Object.entries(sampleTemplates).map(([id, template]) => ({
        id,
        name: template.name,
        description: template.description,
      }));
    }
  }

  /**
   * Get a template by ID
   */
  async getTemplateById(templateId: string): Promise<Template | null> {
    try {
      // First check if the templateId exists in our predefined templates
      if (templateId in sampleTemplates) {
        return sampleTemplates[templateId as keyof typeof sampleTemplates];
      }

      // If not found in predefined templates, check the database
      const { data, error } = await this.supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) {
        console.error(`Error fetching template with id ${templateId}:`, error);
        return null;
      }

      return data as unknown as Template;
    } catch (error) {
      console.error(`Error in getTemplateById for ${templateId}:`, error);
      return null;
    }
  }

  /**
   * Apply CV data to a template
   */
  applyDataToTemplate(template: Template, cvData: ProfileData): Template {
    // Deep clone the template to avoid modifying the original
    const newTemplate = JSON.parse(JSON.stringify(template)) as Template;

    // Process each section and block to replace placeholders with actual data
    newTemplate.sections = newTemplate.sections.map(section => {
      section.blocks = section.blocks.map(block => {
        return this.processBlock(block, cvData);
      });
      return section;
    });

    return newTemplate;
  }

  /**
   * Process a block to replace placeholders with actual data
   */
  private processBlock(block: Block, cvData: ProfileData): Block {
    switch (block.type) {
      case 'hero':
        if (typeof block.heading === 'string' && block.heading.includes('{{name}}')) {
          block.heading = block.heading.replace('{{name}}', cvData.name || 'Your Name');
        }
        if (
          block.subheading &&
          typeof block.subheading === 'string' &&
          block.subheading.includes('{{title}}')
        ) {
          block.subheading = block.subheading.replace('{{title}}', cvData.title || 'Your Title');
        }
        break;
      case 'text':
        if (block.content && typeof block.content === 'string') {
          if (block.content === '{{about}}' || block.content === '{{summary}}') {
            block.content = cvData.summary || 'Your professional summary will appear here.';
          }
        }
        break;
      case 'skills':
        if (typeof block.items === 'string' && block.items === '{{skills}}') {
          block.items =
            cvData.skills?.map(skill => ({
              label: skill,
              value: 85, // Default value
            })) || [];
        }
        break;
      case 'timeline':
        if (Array.isArray(cvData.experience)) {
          block.entries =
            cvData.experience.map(exp => ({
              title: exp.position || 'Position',
              organization: exp.company || 'Company',
              period: exp.duration || 'Period',
              description: exp.description || '',
            })) || [];
        }
        break;
      case 'contact':
        if (block.email === '{{email}}') {
          block.email = cvData.email || cvData.contact?.email || '';
        }
        if (block.phone === '{{phone}}') {
          block.phone = cvData.phone || cvData.contact?.phone || '';
        }
        break;
    }
    return block;
  }

  /**
   * Apply customization options to a template
   */
  applyCustomization(template: Template, options: CustomizationOptions): Template {
    // Deep clone the template to avoid modifying the original
    const newTemplate = JSON.parse(JSON.stringify(template)) as Template;

    // Apply styles to template
    newTemplate.styles = {
      ...newTemplate.styles,
      primaryColor: options.primaryColor,
      secondaryColor: options.secondaryColor,
      backgroundColor: options.backgroundColor,
      textColor: options.textColor,
      headingFont: options.headingFont,
      bodyFont: options.bodyFont,
      borderRadius: options.borderRadius ? `${options.borderRadius}px` : undefined,
      spacing: options.spacing,
    };

    // Apply layout changes if specified
    if (options.layout && options.layout !== 'standard') {
      // Adjust section layout based on selected layout
      newTemplate.sections = newTemplate.sections.map(section => {
        switch (options.layout) {
          case 'compact':
            return { ...section, compact: true, className: 'py-3' };
          case 'spacious':
            return { ...section, compact: false, className: 'py-8' };
          case 'minimal':
            return {
              ...section,
              compact: true,
              className: 'py-4 border-none',
              blocks: section.blocks.map(block => ({ ...block, minimal: true })),
            };
          case 'creative':
            return {
              ...section,
              className: 'py-6 relative creative-section',
              blocks: section.blocks.map(block => ({ ...block, creative: true })),
            };
          default:
            return section;
        }
      });
    }

    // Toggle visibility of certain blocks based on customization
    if (
      options.showSocialIcons !== undefined ||
      options.showContactForm !== undefined ||
      options.showSkillBars !== undefined
    ) {
      newTemplate.sections = newTemplate.sections.map(section => {
        return {
          ...section,
          blocks: section.blocks.filter(block => {
            if (block.type === 'social' && options.showSocialIcons === false) return false;
            if (block.type === 'contact' && options.showContactForm === false) return false;
            if (block.type === 'skills' && options.showSkillBars === false) return false;
            return true;
          }),
        };
      });
    }

    // Apply hero style changes
    if (options.heroStyle) {
      const heroSection = newTemplate.sections.find(section =>
        section.blocks.some(block => block.type === 'hero')
      );

      if (heroSection) {
        heroSection.blocks = heroSection.blocks.map(block => {
          if (block.type === 'hero') {
            return {
              ...block,
              style: options.heroStyle,
              imageFilter: options.imageFilter,
            };
          }
          return block;
        });
      }
    }

    return newTemplate;
  }

  /**
   * Save a template for a site
   */
  async saveTemplate(siteId: string, template: Template): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('sites')
        .update({
          template_data: template,
          template_id: template.id,
        })
        .eq('id', siteId);

      if (error) {
        console.error('Error saving template:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveTemplate:', error);
      return false;
    }
  }

  /**
   * Save customization options for a site
   */
  async saveCustomization(siteId: string, options: CustomizationOptions): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('sites')
        .update({
          custom_styles: options,
        })
        .eq('id', siteId);

      if (error) {
        console.error('Error saving customization:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveCustomization:', error);
      return false;
    }
  }

  /**
   * Get customization options for a site
   */
  async getCustomization(siteId: string): Promise<CustomizationOptions | null> {
    try {
      const { data, error } = await this.supabase
        .from('sites')
        .select('custom_styles')
        .eq('id', siteId)
        .single();

      if (error || !data) {
        console.error('Error fetching customization:', error);
        return null;
      }

      return data.custom_styles as CustomizationOptions;
    } catch (error) {
      console.error('Error in getCustomization:', error);
      return null;
    }
  }
}

// Export singleton instance
const templateService = new TemplateService();
export default templateService;
