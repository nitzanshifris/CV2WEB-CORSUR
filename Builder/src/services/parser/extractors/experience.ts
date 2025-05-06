import { CVData } from '../types';

function parseDate(dateStr: string): string {
  if (dateStr.toLowerCase() === 'present') {
    return new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  const dateFormats = [
    { format: 'MMM YYYY', regex: /^([A-Za-z]{3})\s+(\d{4})$/ },
    { format: 'MMMM YYYY', regex: /^([A-Za-z]+)\s+(\d{4})$/ },
    { format: 'MM/YYYY', regex: /^(\d{2})\/(\d{4})$/ },
    { format: 'YYYY', regex: /^(\d{4})$/ },
  ];

  for (const { format, regex } of dateFormats) {
    const match = dateStr.trim().match(regex);
    if (match) {
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      } catch (e) {
        continue;
      }
    }
  }

  return dateStr;
}

function extractDateRange(dateRange: string): [string, string] {
  const parts = dateRange.split('-');
  const startDate = parseDate(parts[0].trim());
  const endDate = parts.length > 1 ? parseDate(parts[1].trim()) : 'Present';
  return [startDate, endDate];
}

export function extractExperience(text: string): CVData['experience'] {
  const experience: CVData['experience'] = [];
  const experienceSection =
    text.match(/Experience:?\s*([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+:|$)/i)?.[1] || '';

  if (!experienceSection) return experience;

  // Split into individual experiences
  const experiences = experienceSection.split(/\n(?=[A-Z][a-z]+)/);

  for (const exp of experiences) {
    const lines = exp.trim().split('\n');
    if (lines.length < 2) continue;

    // Extract title and company
    const titleLine = lines[0].split('/');
    const title = titleLine[0].trim();
    const companyLocation = titleLine[1]?.trim() || '';
    const [company, location] = companyLocation.split('|').map(s => s.trim());

    // Extract dates
    const dateLine = lines.find(line => /\b\d{4}\b/.test(line)) || '';
    const [startDate, endDate] = extractDateRange(dateLine);

    // Extract description points
    const description = lines
      .slice(1)
      .filter(line => line.trim() && !/\b\d{4}\b/.test(line))
      .map(line => line.trim());

    experience.push({
      title,
      company,
      location,
      startDate,
      endDate,
      description,
    });
  }

  return experience;
}
