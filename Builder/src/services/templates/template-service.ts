import { DatabaseService } from '../database/database-service';
import { FileService } from '../storage/file-service';
import { Template } from './types';

export class TemplateService {
  private static instance: TemplateService;
  private databaseService: DatabaseService;
  private fileService: FileService;

  private constructor() {
    this.databaseService = DatabaseService.getInstance();
    this.fileService = FileService.getInstance();
  }

  public static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
    }
    return TemplateService.instance;
  }

  async getTemplates() {
    return this.databaseService.getTemplates();
  }

  async getTemplateById(id: string) {
    return this.databaseService.getTemplateById(id);
  }

  async createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const newTemplate = {
      ...template,
      createdAt: now,
      updatedAt: now,
    };

    return this.databaseService.createTemplate(newTemplate);
  }

  async updateTemplate(id: string, template: Partial<Template>) {
    const updatedTemplate = {
      ...template,
      updatedAt: new Date().toISOString(),
    };

    return this.databaseService.updateTemplate(id, updatedTemplate);
  }

  async deleteTemplate(id: string) {
    const template = await this.getTemplateById(id);
    if (template.thumbnail) {
      await this.fileService.deleteFile('templates', template.thumbnail);
    }
    return this.databaseService.deleteTemplate(id);
  }

  async uploadThumbnail(file: File, templateId: string) {
    const path = `thumbnails/${templateId}/${file.name}`;
    await this.fileService.uploadFile(file, 'templates', path);
    const publicUrl = await this.fileService.getPublicUrl('templates', path);
    await this.updateTemplate(templateId, { thumbnail: publicUrl });
    return publicUrl;
  }
}
