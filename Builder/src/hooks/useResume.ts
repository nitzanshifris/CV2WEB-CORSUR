import { databaseService } from '@/services/database-service';
import { Resume } from '@/types/resume';
import { useCallback, useState } from 'react';

interface UseResumeOptions {
  onError?: (error: Error) => void;
  onSuccess?: (resume: Resume) => void;
}

export function useResume(options: UseResumeOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);

  const loadResume = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await databaseService.getResume(id);
        setResume(result);
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load resume');
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const saveResume = useCallback(
    async (resumeData: Partial<Resume>) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await databaseService.updateResume(resumeData);
        setResume(result);
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to save resume');
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const createResume = useCallback(
    async (resumeData: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await databaseService.createResume(resumeData);
        setResume(result);
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create resume');
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const deleteResume = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await databaseService.deleteResume(id);
        setResume(null);
        options.onSuccess?.(resume!);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to delete resume');
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options, resume]
  );

  const reset = useCallback(() => {
    setResume(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    resume,
    loadResume,
    saveResume,
    createResume,
    deleteResume,
    reset,
  };
}
