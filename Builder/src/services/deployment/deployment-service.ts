import { FileService } from '../storage/file-service';
import { Template } from '../templates/types';

export interface DeploymentConfig {
  domain: string;
  template: Template;
  data: any;
  customDomain?: string;
}

export class DeploymentService {
  private static instance: DeploymentService;
  private fileService: FileService;

  private constructor() {
    this.fileService = FileService.getInstance();
  }

  public static getInstance(): DeploymentService {
    if (!DeploymentService.instance) {
      DeploymentService.instance = new DeploymentService();
    }
    return DeploymentService.instance;
  }

  async deployWebsite(config: DeploymentConfig) {
    try {
      // Generate the website files
      const files = await this.generateWebsiteFiles(config);

      // Upload files to hosting service
      const deploymentId = await this.uploadFiles(files);

      // Configure domain if custom domain is provided
      if (config.customDomain) {
        await this.configureDomain(deploymentId, config.customDomain);
      }

      return {
        deploymentId,
        url: config.customDomain || `${config.domain}/${deploymentId}`,
      };
    } catch (error) {
      console.error('Deployment failed:', error);
      throw new Error('Failed to deploy website');
    }
  }

  private async generateWebsiteFiles(config: DeploymentConfig) {
    const { template, data } = config;

    // Process template with data
    const processedHtml = this.processTemplate(template.html, data);
    const processedCss = this.processTemplate(template.css, data);
    const processedJs = this.processTemplate(template.js, data);

    return {
      'index.html': processedHtml,
      'styles.css': processedCss,
      'script.js': processedJs,
    };
  }

  private processTemplate(template: string, data: any): string {
    // Replace placeholders with actual data
    return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const value = key.split('.').reduce((obj: any, k: string) => obj?.[k], data);
      return value || '';
    });
  }

  private async uploadFiles(files: Record<string, string>): Promise<string> {
    const deploymentId = this.generateDeploymentId();

    // Upload each file
    for (const [filename, content] of Object.entries(files)) {
      const path = `deployments/${deploymentId}/${filename}`;
      const file = new File([content], filename, { type: 'text/plain' });
      await this.fileService.uploadFile(file, 'websites', path);
    }

    return deploymentId;
  }

  private async configureDomain(deploymentId: string, domain: string) {
    // Implement domain configuration logic here
    // This would typically involve DNS configuration and SSL certificate setup
    console.log(`Configuring domain ${domain} for deployment ${deploymentId}`);
  }

  private generateDeploymentId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
