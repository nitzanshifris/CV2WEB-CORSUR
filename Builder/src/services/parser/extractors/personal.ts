import { CVData } from '../types';

export function extractPersonalInfo(text: string): CVData['personalInfo'] {
  // Extract name (usually the first line)
  const lines = text.split('\n');
  const name = lines[0].trim();

  // Extract title (usually the second line)
  const title = lines[1]?.trim() || '';

  // Extract contact information
  const contactInfo: Record<string, string> = {};
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9-]+/g;
  const githubRegex = /github\.com\/[a-zA-Z0-9-]+/g;

  const email = text.match(emailRegex)?.[0] || '';
  const phone = text.match(phoneRegex)?.[0] || '';
  const linkedin = text.match(linkedinRegex)?.[0] || '';
  const github = text.match(githubRegex)?.[0] || '';

  if (email) contactInfo.email = email;
  if (phone) contactInfo.phone = phone;
  if (linkedin) contactInfo.linkedin = linkedin;
  if (github) contactInfo.github = github;

  // Extract summary/profile
  const summaryMatch = text.match(/Summary:?\s*([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+:|$)/i);
  const summary = summaryMatch?.[1]?.trim() || '';

  return {
    name,
    title,
    contact: contactInfo,
    summary,
  };
}
