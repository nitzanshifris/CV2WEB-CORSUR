import { CVData } from '../types';

export function extractEducation(text: string): CVData['education'] {
  const education: CVData['education'] = [];
  const educationSection =
    text.match(/Education:?\s*([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+:|$)/i)?.[1] || '';

  if (!educationSection) return education;

  // Split into individual education entries
  const entries = educationSection.split(/\n(?=[A-Z][a-z]+)/);

  for (const entry of entries) {
    const lines = entry.trim().split('\n');
    if (lines.length < 2) continue;

    // Extract degree and institution
    const degreeLine = lines[0].split('/');
    const degree = degreeLine[0].trim();
    const institutionLocation = degreeLine[1]?.trim() || '';
    const [institution, location] = institutionLocation.split('|').map(s => s.trim());

    // Extract graduation year
    const yearMatch = lines[1].match(/\b\d{4}\b/);
    const graduationYear = yearMatch?.[0] || '';

    // Extract GPA if present
    const gpaMatch = lines[1].match(/GPA:?\s*([\d.]+)/i);
    const gpa = gpaMatch?.[1] || '';

    // Extract achievements
    const achievements = lines
      .slice(2)
      .filter(line => line.trim())
      .map(line => line.trim());

    education.push({
      degree,
      institution,
      location,
      graduationYear,
      gpa,
      achievements,
    });
  }

  return education;
}
