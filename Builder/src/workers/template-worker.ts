import { Resume } from '@/types/resume';
import { Template } from '@/types/template';

// Import template processing functions
import { processTemplate } from '@/lib/template-processor';

// Cache for compiled templates
const templateCache = new Map<string, any>();

self.onmessage = async (event: MessageEvent) => {
  const { type, resume, template } = event.data;

  if (type === 'generate-preview') {
    try {
      // Generate a cache key for the template
      const templateKey = JSON.stringify(template);

      // Check if we have a cached version of this template
      let compiledTemplate = templateCache.get(templateKey);

      if (!compiledTemplate) {
        // If not in cache, compile the template
        compiledTemplate = await processTemplate(resume as Resume, template as Template);
        templateCache.set(templateKey, compiledTemplate);

        // Keep cache size manageable
        if (templateCache.size > 5) {
          const firstKey = templateCache.keys().next().value;
          templateCache.delete(firstKey);
        }
      }

      // Send the generated HTML back to the main thread
      self.postMessage({
        type: 'preview-generated',
        html: compiledTemplate,
      });
    } catch (error) {
      self.postMessage({
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }
};
