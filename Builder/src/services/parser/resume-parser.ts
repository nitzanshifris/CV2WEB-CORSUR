import * as mammoth from 'mammoth';
import * as pdfParse from 'pdf-parse';
import { Education, Experience, Project, Recognition } from '../template/types';

export interface Resume {
  fullName: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  recognitions: Recognition[];
  languages?: { language: string; proficiency: string }[];
  links?: { type: string; url: string }[];
}

export class ResumeParser {
  protected dateRegex = /(\d{4})(\/|-|\s)(\d{1,2}|\w+)|\b(Present|Current|Now)\b/gi;
  protected emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  protected phoneRegex = /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/;
  protected urlRegex = /https?:\/\/[^\s]+/g;

  async parseFile(file: File): Promise<Resume> {
    try {
      const fileType = file.type;
      let text = '';

      switch (fileType) {
        case 'application/pdf':
          text = await this.parsePDF(file);
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          text = await this.parseDocx(file);
          break;
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }

      return this.parseResumeText(text);
    } catch (error) {
      throw new Error(`Failed to parse resume: ${error.message}`);
    }
  }

  protected async parsePDF(file: File): Promise<string> {
    try {
      const buffer = await file.arrayBuffer();
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }

  protected async parseDocx(file: File): Promise<string> {
    try {
      const buffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      return result.value;
    } catch (error) {
      throw new Error(`Failed to parse DOCX: ${error.message}`);
    }
  }

  protected parseResumeText(text: string): Resume {
    try {
      const sections = this.splitIntoSections(text);

      return {
        fullName: this.extractFullName(sections.header || ''),
        title: this.extractTitle(sections.header || ''),
        email: this.extractEmail(text),
        phone: this.extractPhone(text),
        location: this.extractLocation(sections.header || ''),
        summary: this.extractSummary(sections.summary || ''),
        skills: this.extractSkills(sections.skills || ''),
        experience: this.extractExperience(sections.experience || ''),
        projects: this.extractProjects(sections.projects || ''),
        education: this.extractEducation(sections.education || ''),
        recognitions: this.extractRecognitions(sections.recognitions || ''),
        languages: this.extractLanguages(sections.languages || ''),
        links: this.extractLinks(text),
      };
    } catch (error) {
      throw new Error(`Failed to parse resume text: ${error.message}`);
    }
  }

  protected splitIntoSections(text: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const sectionRegex =
      /\n\s*(EXPERIENCE|EDUCATION|SKILLS|PROJECTS|SUMMARY|RECOGNITIONS|LANGUAGES|AWARDS|CERTIFICATIONS)[:\s]*\n/gi;

    let lastIndex = 0;
    let lastSection = 'header';
    let match;

    while ((match = sectionRegex.exec(text)) !== null) {
      sections[lastSection] = text.slice(lastIndex, match.index).trim();
      lastSection = match[1].toLowerCase();
      lastIndex = match.index + match[0].length;
    }

    sections[lastSection] = text.slice(lastIndex).trim();
    return sections;
  }

  protected extractFullName(text: string): string {
    const lines = text.split('\n');
    return lines[0].trim();
  }

  protected extractTitle(text: string): string {
    const lines = text.split('\n');
    return lines[1]?.trim() || '';
  }

  protected extractEmail(text: string): string {
    const match = text.match(this.emailRegex);
    return match ? match[0] : '';
  }

  protected extractPhone(text: string): string | undefined {
    const match = text.match(this.phoneRegex);
    return match ? match[0] : undefined;
  }

  protected extractLocation(text: string): string | undefined {
    const lines = text.split('\n');
    const locationLine = lines.find(
      line => /^[A-Za-z\s]+,\s*[A-Za-z\s]+$/.test(line.trim()) || /^[A-Za-z\s]+$/.test(line.trim())
    );
    return locationLine?.trim();
  }

  protected extractSummary(text: string): string {
    return text.trim();
  }

  protected extractSkills(text: string): string[] {
    return text
      .split(/[,\n•]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  }

  protected extractExperience(text: string): Experience[] {
    const experiences: Experience[] = [];
    const experienceBlocks = text.split(/\n{2,}/);

    for (const block of experienceBlocks) {
      if (!block.trim()) continue;

      const lines = block.split('\n');
      const title = lines[0]?.trim() || '';
      const company = lines[1]?.trim() || '';
      const dateRange = this.extractDateRange(block);
      const description = lines.slice(2).join('\n').trim();

      if (title && company) {
        experiences.push({
          title,
          company,
          startDate: dateRange[0],
          endDate: dateRange[1],
          description,
          highlights: this.extractBulletPoints(description),
        });
      }
    }

    return experiences;
  }

  protected extractProjects(text: string): Project[] {
    const projects: Project[] = [];
    const projectBlocks = text.split(/\n{2,}/);

    for (const block of projectBlocks) {
      if (!block.trim()) continue;

      const lines = block.split('\n');
      const name = lines[0]?.trim() || '';
      const description = lines.slice(1).join('\n').trim();
      const urls = block.match(this.urlRegex) || [];

      if (name) {
        projects.push({
          name,
          description,
          url: urls[0],
          highlights: this.extractBulletPoints(description),
          technologies: this.extractTechnologies(description),
        });
      }
    }

    return projects;
  }

  protected extractEducation(text: string): Education[] {
    const education: Education[] = [];
    const educationBlocks = text.split(/\n{2,}/);

    for (const block of educationBlocks) {
      if (!block.trim()) continue;

      const lines = block.split('\n');
      const degree = lines[0]?.trim() || '';
      const institution = lines[1]?.trim() || '';
      const dateRange = this.extractDateRange(block);
      const description = lines.slice(2).join('\n').trim();

      if (degree && institution) {
        education.push({
          degree,
          institution,
          startDate: dateRange[0],
          endDate: dateRange[1],
          description,
          achievements: this.extractBulletPoints(description),
        });
      }
    }

    return education;
  }

  protected extractRecognitions(text: string): Recognition[] {
    const recognitions: Recognition[] = [];
    const recognitionBlocks = text.split(/\n{2,}/);

    for (const block of recognitionBlocks) {
      if (!block.trim()) continue;

      const lines = block.split('\n');
      const title = lines[0]?.trim() || '';
      const issuer = lines[1]?.trim() || '';
      const date = this.extractDate(block) || '';
      const description = lines.slice(2).join('\n').trim();

      if (title && issuer) {
        recognitions.push({
          title,
          issuer,
          date,
          description,
        });
      }
    }

    return recognitions;
  }

  protected extractLanguages(text: string): { language: string; proficiency: string }[] {
    return text
      .split(/\n/)
      .map(line => {
        const [language, proficiency] = line.split('-').map(s => s.trim());
        return language && proficiency ? { language, proficiency } : null;
      })
      .filter((lang): lang is { language: string; proficiency: string } => lang !== null);
  }

  protected extractLinks(text: string): { type: string; url: string }[] {
    const links = text.match(this.urlRegex) || [];
    return links.map(url => {
      const type = this.getLinkType(url);
      return { type, url };
    });
  }

  protected extractDateRange(text: string): [string, string] {
    const dates = text.match(this.dateRegex) || [];
    return [dates[0] || '', dates[1] || dates.find(d => /present|current|now/i.test(d)) || ''];
  }

  protected extractDate(text: string): string {
    const match = text.match(this.dateRegex);
    return match ? match[0] : '';
  }

  protected extractBulletPoints(text: string): string[] {
    return text
      .split(/\n[•\-\*]\s*/)
      .map(point => point.trim())
      .filter(point => point.length > 0);
  }

  protected extractTechnologies(text: string): string[] {
    const techRegex =
      /\b(?:React|Angular|Vue|Node\.js|Python|Java|JavaScript|TypeScript|HTML|CSS|AWS|Docker|Kubernetes|SQL|MongoDB|Git)\b/g;
    const matches = text.match(techRegex) || [];
    return Array.from(new Set(matches));
  }

  protected getLinkType(url: string): string {
    if (url.includes('github.com')) return 'github';
    if (url.includes('linkedin.com')) return 'linkedin';
    if (url.includes('twitter.com')) return 'twitter';
    if (url.includes('medium.com')) return 'medium';
    return 'website';
  }
}
