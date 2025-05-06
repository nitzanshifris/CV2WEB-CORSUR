import { PDFDocument } from 'pdf-lib';
import { extractEducation } from './extractors/education';
import { extractExperience } from './extractors/experience';
import { extractPersonalInfo } from './extractors/personal';
import { extractSkills } from './extractors/skills';
import { CVData } from './types';

export class CVParsingService {
  private static instance: CVParsingService;

  private constructor() {}

  public static getInstance(): CVParsingService {
    if (!CVParsingService.instance) {
      CVParsingService.instance = new CVParsingService();
    }
    return CVParsingService.instance;
  }

  public async parseCV(file: File): Promise<CVData> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const text = await this.extractTextFromPDF(pdfDoc);

      const personalInfo = extractPersonalInfo(text);
      const skills = extractSkills(text);
      const experience = extractExperience(text);
      const education = extractEducation(text);

      return {
        personalInfo,
        skills,
        experience,
        education,
      };
    } catch (error) {
      console.error('Error parsing CV:', error);
      throw new Error('Failed to parse CV');
    }
  }

  private async extractTextFromPDF(pdfDoc: PDFDocument): Promise<string> {
    // TODO: Implement PDF text extraction
    // This is a placeholder implementation
    return '';
  }
}
