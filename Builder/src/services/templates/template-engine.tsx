import { TemplateRenderer } from './renderer';
import { TemplateProcessor } from './template-processor';
import { Template } from './types';

interface TemplateEngineProps {
  template: Template;
  data: any;
  className?: string;
}

export function TemplateEngine({ template, data, className }: TemplateEngineProps) {
  const processor = new TemplateProcessor(template);
  const processedTemplate = processor.process(data);

  return <TemplateRenderer template={processedTemplate} data={data} className={className} />;
}
