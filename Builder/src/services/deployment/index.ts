import { createClient } from '@supabase/supabase-js';
import { ParsedResume } from '../parser';

interface DeploymentOptions {
  domain?: string;
  customDomain?: string;
  ssl?: boolean;
  analytics?: boolean;
}

interface DeploymentResult {
  url: string;
  deploymentId: string;
  status: 'success' | 'failed';
  error?: string;
}

export class Deployer {
  private supabase;
  private userId: string;

  constructor(supabaseUrl: string, supabaseKey: string, userId: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.userId = userId;
  }

  async deploy(
    resume: ParsedResume,
    html: string,
    options: DeploymentOptions = {}
  ): Promise<DeploymentResult> {
    try {
      // Generate a unique deployment ID
      const deploymentId = `cv-${this.userId}-${Date.now()}`;

      // Upload the website files
      const { data: filesData, error: filesError } = await this.supabase.storage
        .from('websites')
        .upload(`${deploymentId}/index.html`, html, {
          contentType: 'text/html',
          upsert: true,
        });

      if (filesError) throw filesError;

      // Create deployment record
      const { data: deploymentData, error: deploymentError } = await this.supabase
        .from('deployments')
        .insert({
          id: deploymentId,
          user_id: this.userId,
          resume_data: resume,
          domain: options.domain || `${deploymentId}.cv2web.app`,
          custom_domain: options.customDomain,
          ssl_enabled: options.ssl ?? true,
          analytics_enabled: options.analytics ?? false,
          status: 'deployed',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (deploymentError) throw deploymentError;

      // If custom domain is provided, set up DNS
      if (options.customDomain) {
        await this.setupCustomDomain(deploymentId, options.customDomain);
      }

      return {
        url: options.customDomain || `https://${deploymentId}.cv2web.app`,
        deploymentId,
        status: 'success',
      };
    } catch (error) {
      console.error('Deployment failed:', error);
      return {
        url: '',
        deploymentId: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async setupCustomDomain(deploymentId: string, domain: string): Promise<void> {
    // Verify domain ownership
    const { data: verificationData, error: verificationError } = await this.supabase
      .from('domain_verifications')
      .insert({
        deployment_id: deploymentId,
        domain,
        status: 'pending',
      })
      .select()
      .single();

    if (verificationError) throw verificationError;

    // Set up DNS records
    // This would typically involve calling a DNS provider's API
    // For now, we'll just update the verification status
    await this.supabase
      .from('domain_verifications')
      .update({ status: 'verified' })
      .eq('id', verificationData.id);
  }

  async getDeploymentStatus(deploymentId: string): Promise<{
    status: 'deployed' | 'failed' | 'pending';
    url?: string;
    error?: string;
  }> {
    const { data, error } = await this.supabase
      .from('deployments')
      .select('status, domain, custom_domain')
      .eq('id', deploymentId)
      .single();

    if (error) throw error;

    return {
      status: data.status,
      url: data.custom_domain || `https://${data.domain}`,
    };
  }

  async deleteDeployment(deploymentId: string): Promise<void> {
    // Delete website files
    await this.supabase.storage.from('websites').remove([`${deploymentId}/index.html`]);

    // Delete deployment record
    await this.supabase.from('deployments').delete().eq('id', deploymentId);

    // If custom domain was used, clean up DNS records
    const { data } = await this.supabase
      .from('deployments')
      .select('custom_domain')
      .eq('id', deploymentId)
      .single();

    if (data?.custom_domain) {
      await this.cleanupCustomDomain(deploymentId, data.custom_domain);
    }
  }

  private async cleanupCustomDomain(deploymentId: string, domain: string): Promise<void> {
    // Remove DNS records
    // This would typically involve calling a DNS provider's API
    // For now, we'll just delete the verification record
    await this.supabase.from('domain_verifications').delete().eq('deployment_id', deploymentId);
  }
}

export * from './deployment-service';
