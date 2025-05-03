import { SiteConfig } from './types';

export class SiteGenerator {
  private config: SiteConfig;

  constructor(config: SiteConfig) {
    this.config = config;
  }

  async generate(): Promise<string> {
    // TODO: Implement site generation logic
    return this.generateHTML();
  }

  private generateHTML(): string {
    // TODO: Implement HTML generation based on config
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${this.config.content.personalInfo.fullName} - CV Website</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
          <header>
            <h1>${this.config.content.personalInfo.fullName}</h1>
            <h2>${this.config.content.personalInfo.title}</h2>
          </header>
          <main>
            <!-- Content will be generated here -->
          </main>
        </body>
      </html>
    `;
  }

  async deploy(): Promise<string> {
    // TODO: Implement deployment logic
    return `https://${this.config.domain}`;
  }
} 