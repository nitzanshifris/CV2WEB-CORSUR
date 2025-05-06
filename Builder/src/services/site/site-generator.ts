import { SiteConfig } from './types';

export class SiteGenerator {
  private config: SiteConfig;

  constructor(config: SiteConfig) {
    this.config = config;
  }

  async generate(): Promise<string> {
    return this.generateHTML();
  }

  private generateHTML(): string {
    const { personalInfo, sections, style } = this.config.content;

    return `
      <!DOCTYPE html>
      <html lang="en" data-theme="${style.theme}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${personalInfo.fullName} - CV Website</title>
          <link rel="stylesheet" href="/styles.css">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=${style.fontFamily.replace(
            ' ',
            '+'
          )}&display=swap" rel="stylesheet">
        </head>
        <body class="layout-${style.layout}">
          <header class="header">
            <div class="container">
              <h1 class="name">${personalInfo.fullName}</h1>
              <h2 class="title">${personalInfo.title}</h2>
              <div class="contact-info">
                <p>${personalInfo.email} • ${personalInfo.phone}</p>
                <p>${personalInfo.location}</p>
              </div>
              <div class="social-links">
                ${this.generateSocialLinks(personalInfo.social)}
              </div>
              <p class="summary">${personalInfo.summary}</p>
            </div>
          </header>

          <main class="main">
            <div class="container">
              ${this.generateExperienceSection(sections.experience)}
              ${this.generateEducationSection(sections.education)}
              ${this.generateSkillsSection(sections.skills)}
              ${sections.projects ? this.generateProjectsSection(sections.projects) : ''}
              ${
                sections.certifications
                  ? this.generateCertificationsSection(sections.certifications)
                  : ''
              }
            </div>
          </main>

          <footer class="footer">
            <div class="container">
              <p>&copy; ${new Date().getFullYear()} ${
      personalInfo.fullName
    }. All rights reserved.</p>
            </div>
          </footer>
        </body>
      </html>
    `;
  }

  private generateSocialLinks(social: SiteConfig['content']['personalInfo']['social']): string {
    const links = [];
    if (social.linkedin)
      links.push(
        `<a href="${social.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`
      );
    if (social.github)
      links.push(`<a href="${social.github}" target="_blank" rel="noopener noreferrer">GitHub</a>`);
    if (social.twitter)
      links.push(
        `<a href="${social.twitter}" target="_blank" rel="noopener noreferrer">Twitter</a>`
      );
    if (social.website)
      links.push(
        `<a href="${social.website}" target="_blank" rel="noopener noreferrer">Website</a>`
      );
    return links.join(' • ');
  }

  private generateExperienceSection(
    experience: SiteConfig['content']['sections']['experience']
  ): string {
    return `
      <section class="section experience">
        <h2 class="section-title">Experience</h2>
        ${experience
          .map(
            exp => `
          <div class="experience-item">
            <h3 class="job-title">${exp.title}</h3>
            <div class="company-info">
              <span class="company">${exp.company}</span>
              <span class="location">${exp.location}</span>
            </div>
            <div class="date-range">
              ${exp.startDate} - ${exp.endDate}
            </div>
            <ul class="description">
              ${exp.description.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `
          )
          .join('')}
      </section>
    `;
  }

  private generateEducationSection(
    education: SiteConfig['content']['sections']['education']
  ): string {
    return `
      <section class="section education">
        <h2 class="section-title">Education</h2>
        ${education
          .map(
            edu => `
          <div class="education-item">
            <h3 class="degree">${edu.degree}</h3>
            <div class="institution-info">
              <span class="institution">${edu.institution}</span>
              <span class="location">${edu.location}</span>
            </div>
            <div class="graduation">
              ${edu.graduationYear}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
            </div>
            ${
              edu.achievements
                ? `
              <ul class="achievements">
                ${edu.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
              </ul>
            `
                : ''
            }
          </div>
        `
          )
          .join('')}
      </section>
    `;
  }

  private generateSkillsSection(skills: SiteConfig['content']['sections']['skills']): string {
    return `
      <section class="section skills">
        <h2 class="section-title">Skills</h2>
        <div class="skills-grid">
          <div class="skill-category">
            <h3>Technical Skills</h3>
            <ul class="skill-list">
              ${skills.technical.map(skill => `<li>${skill}</li>`).join('')}
            </ul>
          </div>
          <div class="skill-category">
            <h3>Soft Skills</h3>
            <ul class="skill-list">
              ${skills.soft.map(skill => `<li>${skill}</li>`).join('')}
            </ul>
          </div>
          <div class="skill-category">
            <h3>Languages</h3>
            <ul class="skill-list">
              ${skills.languages.map(lang => `<li>${lang}</li>`).join('')}
            </ul>
          </div>
        </div>
      </section>
    `;
  }

  private generateProjectsSection(
    projects: NonNullable<SiteConfig['content']['sections']['projects']>
  ): string {
    return `
      <section class="section projects">
        <h2 class="section-title">Projects</h2>
        ${projects
          .map(
            project => `
          <div class="project-item">
            <h3 class="project-name">${project.name}</h3>
            <div class="project-year">${project.year}</div>
            <p class="project-description">${project.description}</p>
            ${
              project.technologies
                ? `
              <div class="project-technologies">
                ${project.technologies
                  .map(tech => `<span class="tech-tag">${tech}</span>`)
                  .join('')}
              </div>
            `
                : ''
            }
            ${
              project.link
                ? `
              <a href="${project.link}" class="project-link" target="_blank" rel="noopener noreferrer">View Project</a>
            `
                : ''
            }
          </div>
        `
          )
          .join('')}
      </section>
    `;
  }

  private generateCertificationsSection(
    certifications: NonNullable<SiteConfig['content']['sections']['certifications']>
  ): string {
    return `
      <section class="section certifications">
        <h2 class="section-title">Certifications</h2>
        ${certifications
          .map(
            cert => `
          <div class="certification-item">
            <h3 class="certification-name">${cert.name}</h3>
            <div class="certification-info">
              <span class="issuer">${cert.issuer}</span>
              <span class="date">${cert.date}</span>
            </div>
            ${
              cert.link
                ? `
              <a href="${cert.link}" class="certification-link" target="_blank" rel="noopener noreferrer">View Certificate</a>
            `
                : ''
            }
          </div>
        `
          )
          .join('')}
      </section>
    `;
  }

  async deploy(): Promise<string> {
    // TODO: Implement deployment logic
    return `https://${this.config.domain}`;
  }
}
