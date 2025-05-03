import { Resume } from "@/types/resume";
import { Template } from "@/types/template";

class TemplateEngine {
  private static instance: TemplateEngine;
  private worker: Worker | null = null;
  private cache: Map<string, string> = new Map();
  private lastResumeHash: string = '';
  private lastTemplateHash: string = '';

  private constructor() {
    this.initializeWorker();
  }

  public static getInstance(): TemplateEngine {
    if (!TemplateEngine.instance) {
      TemplateEngine.instance = new TemplateEngine();
    }
    return TemplateEngine.instance;
  }

  private initializeWorker() {
    this.worker = new Worker(new URL('../workers/template-worker.ts', import.meta.url));
  }

  private generateHash(resume: Resume, template: Template): string {
    return JSON.stringify({ resume, template });
  }

  private async generatePreviewWithCache(resume: Resume, template: Template): Promise<string> {
    const hash = this.generateHash(resume, template);
    
    // If we have a cached result and the data hasn't changed, return it
    if (this.cache.has(hash) && 
        hash === this.lastResumeHash + this.lastTemplateHash) {
      return this.cache.get(hash)!;
    }

    // Generate new preview
    const html = await this.generatePreview(resume, template);
    
    // Update cache
    this.cache.set(hash, html);
    this.lastResumeHash = JSON.stringify(resume);
    this.lastTemplateHash = JSON.stringify(template);
    
    // Keep cache size manageable
    if (this.cache.size > 10) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    return html;
  }

  public async generatePreview(resume: Resume, template: Template): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Template worker not initialized'));
        return;
      }

      const messageHandler = (event: MessageEvent) => {
        if (event.data.type === 'preview-generated') {
          this.worker?.removeEventListener('message', messageHandler);
          resolve(event.data.html);
        } else if (event.data.type === 'error') {
          this.worker?.removeEventListener('message', messageHandler);
          reject(new Error(event.data.error));
        }
      };

      this.worker.addEventListener('message', messageHandler);
      this.worker.postMessage({
        type: 'generate-preview',
        resume,
        template
      });
    });
  }

  public async updatePreview(resume: Resume, template: Template): Promise<string> {
    return this.generatePreviewWithCache(resume, template);
  }
}

// Export a singleton instance
export const templateEngine = TemplateEngine.getInstance();

// Add to window for global access
declare global {
  interface Window {
    templateEngine: TemplateEngine;
  }
}

window.templateEngine = TemplateEngine.getInstance(); 