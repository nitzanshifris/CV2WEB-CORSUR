import { z } from 'zod';

export const SocialLinkSchema = z.object({
  platform: z.string(),
  url: z.string().url(),
});

export const PersonalInfoSchema = z.object({
  fullName: z.string(),
  title: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  socialLinks: z.array(SocialLinkSchema).optional(),
});

export const ExperienceSchema = z.object({
  title: z.string(),
  company: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).optional(),
});

export const EducationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  link: z.string().url().optional(),
});

export const SiteContentSchema = z.object({
  personalInfo: PersonalInfoSchema,
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.array(z.string()),
  projects: z.array(ProjectSchema).optional(),
});

export const SiteConfigSchema = z.object({
  id: z.string(),
  userId: z.string(),
  domain: z.string(),
  theme: z.string(),
  content: SiteContentSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
}); 