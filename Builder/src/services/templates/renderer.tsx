import { Template } from './types';

interface TemplateRendererProps {
  template: Template;
  data: any;
  className?: string;
}

export function TemplateRenderer({ template, data, className }: TemplateRendererProps) {
  return (
    <div className={className}>
      <style>{template.css}</style>
      <div dangerouslySetInnerHTML={{ __html: template.html }} />
      <script dangerouslySetInnerHTML={{ __html: template.js }} />
    </div>
  );
}
