import { Experience, Recognition } from '../template/types';
import { ResumeParser } from './resume-parser';

interface Portfolio {
  title: string;
  category: string;
  description: string;
  url?: string;
  images?: string[];
  videos?: string[];
  awards?: string[];
  press?: string[];
}

interface Exhibition {
  title: string;
  venue: string;
  location: string;
  startDate: string;
  endDate?: string;
  description?: string;
  type: 'solo' | 'group' | 'featured';
  curator?: string;
  press?: string[];
}

interface Performance {
  title: string;
  venue: string;
  location: string;
  date: string;
  role: string;
  ensemble?: string;
  conductor?: string;
  program?: string[];
  reviews?: string[];
}

interface CreativeResume {
  fullName: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  summary: string;
  skills: string[];
  portfolio: Portfolio[];
  exhibitions?: Exhibition[];
  performances?: Performance[];
  experience: Experience[];
  education: Education[];
  recognitions: Recognition[];
  statement?: string;
  press?: { title: string; publication: string; date: string; url?: string }[];
  representation?: { gallery: string; location: string; url?: string }[];
  socialMedia?: { platform: string; handle: string; url: string }[];
}

export class CreativeResumeParser extends ResumeParser {
  protected portfolioRegex = /\b(PORTFOLIO|WORKS|EXHIBITIONS|PERFORMANCES|SHOWS)\b/i;
  protected statementRegex = /\b(ARTIST STATEMENT|STATEMENT|PHILOSOPHY)\b/i;
  protected pressRegex = /\b(PRESS|MEDIA|REVIEWS|PUBLICATIONS)\b/i;

  protected async parseResumeText(text: string): Promise<CreativeResume> {
    const baseResume = await super.parseResumeText(text);
    const sections = this.splitIntoSections(text);

    return {
      ...baseResume,
      portfolio: this.extractPortfolio(sections.portfolio || sections.works || ''),
      exhibitions: this.extractExhibitions(sections.exhibitions || ''),
      performances: this.extractPerformances(sections.performances || ''),
      statement: this.extractStatement(sections.statement || ''),
      press: this.extractPress(sections.press || ''),
      representation: this.extractRepresentation(sections.representation || ''),
      socialMedia: this.extractSocialMedia(text),
    };
  }

  protected splitIntoSections(text: string): Record<string, string> {
    const sections = super.splitIntoSections(text);
    const creativeRegex =
      /\n\s*(PORTFOLIO|WORKS|EXHIBITIONS|PERFORMANCES|STATEMENT|PRESS|REPRESENTATION)[:\s]*\n/gi;

    let lastIndex = 0;
    let lastSection = 'header';
    let match;

    while ((match = creativeRegex.exec(text)) !== null) {
      sections[lastSection] = text.slice(lastIndex, match.index).trim();
      lastSection = match[1].toLowerCase();
      lastIndex = match.index + match[0].length;
    }

    sections[lastSection] = text.slice(lastIndex).trim();
    return sections;
  }

  protected extractPortfolio(text: string): Portfolio[] {
    const portfolio: Portfolio[] = [];
    const portfolioBlocks = text.split(/\n{2,}/);

    for (const block of portfolioBlocks) {
      if (!block.trim()) continue;

      const lines = block.split('\n');
      const title = lines[0]?.trim() || '';
      const categoryMatch = lines[1]?.match(/\[(.*?)\]/) || [];
      const category = categoryMatch[1] || 'Other';
      const description = lines
        .slice(categoryMatch[1] ? 2 : 1)
        .join('\n')
        .trim();
      const urls = block.match(this.urlRegex) || [];
      const awards = this.extractAwards(description);
      const press = this.extractPressReferences(description);

      if (title) {
        portfolio.push({
          title,
          category,
          description,
          url: urls[0],
          images: urls.filter(url => url.match(/\.(jpg|jpeg|png|gif)$/i)),
          videos: urls.filter(
            url =>
              url.match(/\.(mp4|mov|avi)$/i) ||
              url.includes('vimeo.com') ||
              url.includes('youtube.com')
          ),
          awards,
          press,
        });
      }
    }

    return portfolio;
  }

  protected extractExhibitions(text: string): Exhibition[] {
    const exhibitions: Exhibition[] = [];
    const exhibitionBlocks = text.split(/\n{2,}/);

    for (const block of exhibitionBlocks) {
      if (!block.trim()) continue;

      const lines = block.split('\n');
      const title = lines[0]?.trim() || '';
      const venue = lines[1]?.trim() || '';
      const location = lines[2]?.trim() || '';
      const dateRange = this.extractDateRange(block);
      const typeMatch = block.match(/\[(solo|group|featured)\]/i);
      const type = (typeMatch?.[1].toLowerCase() || 'group') as 'solo' | 'group' | 'featured';
      const description = lines.slice(3).join('\n').trim();
      const curatorMatch = description.match(/Curator:?\s*([^,\n]+)/i);
      const press = this.extractPressReferences(description);

      if (title && venue) {
        exhibitions.push({
          title,
          venue,
          location,
          startDate: dateRange[0],
          endDate: dateRange[1],
          description,
          type,
          curator: curatorMatch?.[1].trim(),
          press,
        });
      }
    }

    return exhibitions;
  }

  protected extractPerformances(text: string): Performance[] {
    const performances: Performance[] = [];
    const performanceBlocks = text.split(/\n{2,}/);

    for (const block of performanceBlocks) {
      if (!block.trim()) continue;

      const lines = block.split('\n');
      const title = lines[0]?.trim() || '';
      const venue = lines[1]?.trim() || '';
      const location = lines[2]?.trim() || '';
      const date = this.extractDate(block);
      const roleMatch = block.match(/Role:?\s*([^,\n]+)/i);
      const ensembleMatch = block.match(/Ensemble:?\s*([^,\n]+)/i);
      const conductorMatch = block.match(/Conductor:?\s*([^,\n]+)/i);
      const program = this.extractProgram(block);
      const reviews = this.extractReviews(block);

      if (title && venue && date) {
        performances.push({
          title,
          venue,
          location,
          date,
          role: roleMatch?.[1].trim() || 'Performer',
          ensemble: ensembleMatch?.[1].trim(),
          conductor: conductorMatch?.[1].trim(),
          program,
          reviews,
        });
      }
    }

    return performances;
  }

  protected extractStatement(text: string): string {
    return text.trim();
  }

  protected extractPress(
    text: string
  ): { title: string; publication: string; date: string; url?: string }[] {
    const press: { title: string; publication: string; date: string; url?: string }[] = [];
    const pressBlocks = text.split(/\n/);

    for (const block of pressBlocks) {
      if (!block.trim()) continue;

      const match = block.match(/"([^"]+)"\s*,\s*([^,]+),\s*(\d{4})/);
      if (match) {
        const [, title, publication, date] = match;
        const url = block.match(this.urlRegex)?.[0];
        press.push({
          title: title.trim(),
          publication: publication.trim(),
          date,
          url,
        });
      }
    }

    return press;
  }

  protected extractRepresentation(
    text: string
  ): { gallery: string; location: string; url?: string }[] {
    const representation: { gallery: string; location: string; url?: string }[] = [];
    const repBlocks = text.split(/\n/);

    for (const block of repBlocks) {
      if (!block.trim()) continue;

      const [gallery, location] = block.split(',').map(s => s.trim());
      const url = block.match(this.urlRegex)?.[0];

      if (gallery && location) {
        representation.push({ gallery, location, url });
      }
    }

    return representation;
  }

  protected extractSocialMedia(text: string): { platform: string; handle: string; url: string }[] {
    const socialMedia: { platform: string; handle: string; url: string }[] = [];
    const urls = text.match(this.urlRegex) || [];

    for (const url of urls) {
      const platform = this.getSocialMediaPlatform(url);
      if (platform) {
        const handle = this.extractSocialMediaHandle(url, platform);
        socialMedia.push({ platform, handle, url });
      }
    }

    return socialMedia;
  }

  private extractAwards(text: string): string[] {
    const awards: string[] = [];
    const awardRegex = /\b(Award|Prize|Grant|Fellowship|Residency|Honor)[ed]?:?\s+([^,\n]+)/gi;
    let match;

    while ((match = awardRegex.exec(text)) !== null) {
      awards.push(match[2].trim());
    }

    return awards;
  }

  private extractPressReferences(text: string): string[] {
    const press: string[] = [];
    const pressRegex = /"([^"]+)"\s*,\s*([^,]+)/g;
    let match;

    while ((match = pressRegex.exec(text)) !== null) {
      press.push(`${match[1].trim()} (${match[2].trim()})`);
    }

    return press;
  }

  private extractProgram(text: string): string[] {
    const programRegex = /Program:?\s*([^,\n]+(?:,\s*[^,\n]+)*)/i;
    const match = text.match(programRegex);
    return match ? match[1].split(',').map(item => item.trim()) : [];
  }

  private extractReviews(text: string): string[] {
    const reviews: string[] = [];
    const reviewRegex = /"([^"]+)"\s*-\s*([^,\n]+)/g;
    let match;

    while ((match = reviewRegex.exec(text)) !== null) {
      reviews.push(`${match[1].trim()} - ${match[2].trim()}`);
    }

    return reviews;
  }

  private getSocialMediaPlatform(url: string): string | null {
    if (url.includes('instagram.com')) return 'Instagram';
    if (url.includes('twitter.com')) return 'Twitter';
    if (url.includes('facebook.com')) return 'Facebook';
    if (url.includes('linkedin.com')) return 'LinkedIn';
    if (url.includes('youtube.com')) return 'YouTube';
    if (url.includes('vimeo.com')) return 'Vimeo';
    if (url.includes('behance.net')) return 'Behance';
    if (url.includes('dribbble.com')) return 'Dribbble';
    if (url.includes('artstation.com')) return 'ArtStation';
    return null;
  }

  private extractSocialMediaHandle(url: string, platform: string): string {
    const parts = url.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];
    return lastPart === '' ? parts[parts.length - 2] : lastPart;
  }
}
