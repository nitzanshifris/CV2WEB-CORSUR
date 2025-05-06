import { CVData } from '../types';

export function extractSkills(text: string): CVData['skills'] {
  const skills: CVData['skills'] = {
    technical: [],
    soft: [],
    languages: [],
  };

  // Extract technical skills
  const technicalSkillsMatch = text.match(
    /Technical Skills:?\s*([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+:|$)/i
  );
  if (technicalSkillsMatch) {
    skills.technical = technicalSkillsMatch[1]
      .split(/[,•]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  }

  // Extract soft skills
  const softSkillsMatch = text.match(/Soft Skills:?\s*([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+:|$)/i);
  if (softSkillsMatch) {
    skills.soft = softSkillsMatch[1]
      .split(/[,•]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  }

  // Extract languages
  const languagesMatch = text.match(/Languages:?\s*([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+:|$)/i);
  if (languagesMatch) {
    skills.languages = languagesMatch[1]
      .split(/[,•]/)
      .map(lang => lang.trim())
      .filter(lang => lang.length > 0);
  }

  return skills;
}
