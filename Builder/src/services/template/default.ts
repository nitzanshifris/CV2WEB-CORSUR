import { defaultTheme } from './themes/default';
import { Template } from './types';

export const defaultTemplate: Template = {
  id: 'default',
  name: 'Modern Professional',
  description: 'A clean and modern template for professionals',
  thumbnail: '/templates/default.png',
  html: `
    <div class="container">
      <header class="header">
        <h1>{{fullName}}</h1>
        <h2>{{title}}</h2>
        <div class="contact">
          {{#if email}}<a href="mailto:{{email}}">{{email}}</a>{{/if}}
          {{#if phone}}<span>{{phone}}</span>{{/if}}
        </div>
      </header>

      {{#if summary}}
      <section class="summary">
        <h3>Summary</h3>
        <p>{{summary}}</p>
      </section>
      {{/if}}

      {{#if skills.length}}
      <section class="skills">
        <h3>Skills</h3>
        <div class="skills-grid">
          {{#each skills}}
          <span class="skill-tag">{{this}}</span>
          {{/each}}
        </div>
      </section>
      {{/if}}

      {{#if experience.length}}
      <section class="experience">
        <h3>Experience</h3>
        {{#each experience}}
        <div class="experience-item">
          <div class="experience-header">
            <h4>{{title}}</h4>
            <span class="company">{{company}}</span>
            <span class="date">{{formatDate startDate}} - {{#if endDate}}{{formatDate endDate}}{{else}}Present{{/if}}</span>
          </div>
          <p>{{description}}</p>
        </div>
        {{/each}}
      </section>
      {{/if}}

      {{#if education.length}}
      <section class="education">
        <h3>Education</h3>
        {{#each education}}
        <div class="education-item">
          <div class="education-header">
            <h4>{{degree}}</h4>
            <span class="institution">{{institution}}</span>
            <span class="date">{{formatDate startDate}} - {{#if endDate}}{{formatDate endDate}}{{else}}Present{{/if}}</span>
          </div>
          {{#if description}}
          <p>{{description}}</p>
          {{/if}}
        </div>
        {{/each}}
      </section>
      {{/if}}
    </div>
  `,
  styles: `
    :root {
      --primary: ${defaultTheme.colors.primary};
      --secondary: ${defaultTheme.colors.secondary};
      --background: ${defaultTheme.colors.background};
      --text: ${defaultTheme.colors.text};
      --accent: ${defaultTheme.colors.accent};
      --spacing-small: ${defaultTheme.spacing.small};
      --spacing-medium: ${defaultTheme.spacing.medium};
      --spacing-large: ${defaultTheme.spacing.large};
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: ${defaultTheme.fonts.body};
      line-height: 1.6;
      color: var(--text);
      background: var(--background);
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: var(--spacing-large);
    }

    .header {
      text-align: center;
      margin-bottom: var(--spacing-large);
    }

    h1 {
      font-family: ${defaultTheme.fonts.heading};
      font-size: 2.5rem;
      color: var(--primary);
      margin-bottom: var(--spacing-small);
    }

    h2 {
      font-size: 1.5rem;
      color: var(--secondary);
      margin-bottom: var(--spacing-medium);
    }

    .contact {
      display: flex;
      justify-content: center;
      gap: var(--spacing-medium);
    }

    .contact a {
      color: var(--primary);
      text-decoration: none;
    }

    section {
      margin-bottom: var(--spacing-large);
    }

    h3 {
      font-family: ${defaultTheme.fonts.heading};
      font-size: 1.5rem;
      color: var(--primary);
      margin-bottom: var(--spacing-medium);
      border-bottom: 2px solid var(--primary);
      padding-bottom: var(--spacing-small);
    }

    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-small);
    }

    .skill-tag {
      background: var(--primary);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
    }

    .experience-item,
    .education-item {
      margin-bottom: var(--spacing-medium);
    }

    .experience-header,
    .education-header {
      margin-bottom: var(--spacing-small);
    }

    h4 {
      font-size: 1.25rem;
      color: var(--secondary);
    }

    .company,
    .institution {
      color: var(--primary);
      font-weight: 500;
    }

    .date {
      color: var(--secondary);
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .container {
        padding: var(--spacing-medium);
      }

      h1 {
        font-size: 2rem;
      }

      h2 {
        font-size: 1.25rem;
      }

      .contact {
        flex-direction: column;
        align-items: center;
      }
    }
  `,
  theme: defaultTheme,
  sections: [
    {
      id: 'personal',
      name: 'Personal Information',
      required: true,
      order: 1,
    },
    {
      id: 'summary',
      name: 'Professional Summary',
      required: false,
      order: 2,
    },
    {
      id: 'skills',
      name: 'Skills',
      required: false,
      order: 3,
    },
    {
      id: 'experience',
      name: 'Work Experience',
      required: false,
      order: 4,
    },
    {
      id: 'education',
      name: 'Education',
      required: false,
      order: 5,
    },
  ],
};
