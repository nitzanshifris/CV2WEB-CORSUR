import { Resume } from '@/types/resume';
import { Template } from '@/types/template';
import { useCallback, useState } from 'react';

interface UseTemplateOptions {
  onError?: (error: Error) => void;
  onSuccess?: (result: string) => void;
}

export function useTemplate(options: UseTemplateOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [preview, setPreview] = useState<string>('');

  const generatePreview = useCallback(
    async (template: Template, resume: Resume) => {
      setIsLoading(true);
      setError(null);

      try {
        const worker = new Worker(new URL('@/workers/template-worker.ts', import.meta.url));

        return new Promise((resolve, reject) => {
          worker.onmessage = event => {
            const { type, html, error } = event.data;

            if (type === 'preview-generated') {
              setPreview(html);
              options.onSuccess?.(html);
              resolve(html);
            } else if (type === 'error') {
              const err = new Error(error);
              setError(err);
              options.onError?.(err);
              reject(err);
            }

            worker.terminate();
          };

          worker.postMessage({
            type: 'generate-preview',
            template,
            resume,
          });
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to generate preview');
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setPreview('');
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    preview,
    generatePreview,
    reset,
  };
}
