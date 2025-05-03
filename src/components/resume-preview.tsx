import * as React from "react";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/stores/resume-store";
import { useTemplateStore } from "@/stores/template-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useDebounce } from "@/hooks/use-debounce";

interface ResumePreviewProps {
  className?: string;
}

export function ResumePreview({ className }: ResumePreviewProps) {
  const { resume, isLoading: isResumeLoading } = useResumeStore();
  const { selectedTemplate, isLoading: isTemplateLoading } = useTemplateStore();
  const [previewHtml, setPreviewHtml] = React.useState<string>("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  // Debounce the resume and template changes
  const debouncedResume = useDebounce(resume, 300);
  const debouncedTemplate = useDebounce(selectedTemplate, 300);

  React.useEffect(() => {
    const generatePreview = async () => {
      if (!debouncedResume || !debouncedTemplate) return;
      
      setIsGenerating(true);
      try {
        const html = await window.templateEngine.generatePreview(debouncedResume, debouncedTemplate);
        setPreviewHtml(html);
      } catch (error) {
        console.error("Failed to generate preview:", error);
        // TODO: Show error toast
      } finally {
        setIsGenerating(false);
      }
    };

    generatePreview();
  }, [debouncedResume, debouncedTemplate]);

  // Show loading state only if we're actually generating
  const showLoading = isResumeLoading || isTemplateLoading || isGenerating;

  if (showLoading) {
    return (
      <div className={cn("flex items-center justify-center min-h-[500px]", className)}>
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-sm text-muted-foreground">Generating preview...</span>
      </div>
    );
  }

  if (!resume || !selectedTemplate) {
    return (
      <div className={cn("flex items-center justify-center min-h-[500px]", className)}>
        <p className="text-muted-foreground">Upload your resume to see the preview</p>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full min-h-[500px]", className)}>
      <iframe
        srcDoc={previewHtml}
        className="w-full h-full border rounded-lg"
        title="Resume Preview"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
} 