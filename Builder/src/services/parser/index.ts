import * as mammoth from 'mammoth';
import * as pdfParse from 'pdf-parse';
import { Theme } from '../templates/types';
import { extractEducation } from './extractors/education';
import { extractExperience } from './extractors/experience';
import {
  extractEmail,
  extractFullName,
  extractPhone,
  extractSummary,
  extractTitle,
} from './extractors/personal';
import { extractSkills } from './extractors/skills';

export interface ParsedResume {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
  theme?: Theme;
}

export async function parsePDF(file: File): Promise<ParsedResume> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const data = await pdfParse(arrayBuffer);
    const text = data.text;

    // Extract personal information
    const fullName = extractFullName(text);
    const title = extractTitle(text);
    const email = extractEmail(text);
    const phone = extractPhone(text);
    const summary = extractSummary(text);

    // Extract sections
    const skills = extractSkills(text);
    const experience = extractExperience(text);
    const education = extractEducation(text);

    return {
      fullName,
      title,
      email,
      phone,
      summary,
      skills,
      experience,
      education,
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}

export async function parseDOCX(file: File): Promise<ParsedResume> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;

    // Extract personal information
    const fullName = extractFullName(text);
    const title = extractTitle(text);
    const email = extractEmail(text);
    const phone = extractPhone(text);
    const summary = extractSummary(text);

    // Extract sections
    const skills = extractSkills(text);
    const experience = extractExperience(text);
    const education = extractEducation(text);

    return {
      fullName,
      title,
      email,
      phone,
      summary,
      skills,
      experience,
      education,
    };
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file');
  }
}

export * from './cv-parsing-service';
