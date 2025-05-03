import React, { memo, useMemo, Suspense, ErrorBoundary } from "react";
import { ContactBlockComponent } from "@/components/blocks/ContactBlock";
import { GalleryBlockComponent } from "@/components/blocks/GalleryBlock";
import { SkillsBlockComponent } from "@/components/blocks/SkillsBlock";
import { TimelineBlockComponent } from "@/components/blocks/TimelineBlock";
import { HeroBlockComponent } from "@/components/blocks/HeroBlock";
import { TextBlockComponent } from "@/components/blocks/TextBlock";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

// ... existing interfaces ...

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div 
    role="alert" 
    className="p-4 bg-red-50 rounded-lg flex items-start"
  >
    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
    <div>
      <h3 className="text-sm font-medium text-red-800">Something went wrong</h3>
      <p className="text-sm text-red-600 mt-1">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
      >
        Try again
      </button>
    </div>
  </div>
);

const BlockErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => window.location.reload()}
  >
    {children}
  </ErrorBoundary>
);

const BlockRenderer = memo(({ block, theme }: { block: Block; theme?: Template["styles"] }) => {
  const blockKey = useMemo(() => `${block.id}-${block.type}`, [block.id, block.type]);

  const renderBlock = () => {
    switch (block.type) {
      case "hero":
        return <HeroBlockComponent key={blockKey} block={block as HeroBlock} theme={theme} />;
      case "text":
        return <TextBlockComponent key={blockKey} block={block as TextBlock} theme={theme} />;
      case "skills":
        return <SkillsBlockComponent key={blockKey} block={block as SkillsBlock} theme={theme} />;
      case "timeline":
        return <TimelineBlockComponent key={blockKey} block={block as TimelineBlock} theme={theme} />;
      case "gallery":
        return <GalleryBlockComponent key={blockKey} block={block as GalleryBlock} theme={theme} />;
      case "contact":
        return <ContactBlockComponent key={blockKey} block={block as ContactBlock} theme={theme} />;
      default:
        return (
          <div 
            key={blockKey} 
            className="py-4"
            role="alert"
            aria-live="polite"
          >
            <p className="text-sm text-gray-400">
              Block type "{block.type}" not implemented
            </p>
          </div>
        );
    }
  };

  return (
    <BlockErrorBoundary>
      <Suspense fallback={
        <div className="py-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      }>
        {renderBlock()}
      </Suspense>
    </BlockErrorBoundary>
  );
});

BlockRenderer.displayName = "BlockRenderer";

const SectionRenderer = memo(({ section, theme }: { section: Section; theme?: Template["styles"] }) => {
  const sectionClassName = useMemo(() => 
    cn(
      "template-section",
      section.className || "py-6",
      section.compact ? "space-y-2" : "space-y-4"
    ),
    [section.className, section.compact]
  );

  return (
    <section 
      id={section.id} 
      className={sectionClassName}
      aria-labelledby={section.title ? `${section.id}-title` : undefined}
    >
      {section.title && !section.compact && (
        <h2 
          id={`${section.id}-title`}
          className="section-title text-2xl font-semibold mb-4"
          style={{ 
            color: theme?.textColor || "#333333",
            fontFamily: theme?.headingFont || "inherit"
          }}
        >
          {section.title}
        </h2>
      )}
      <div 
        className="section-blocks"
        role="region"
        aria-label={section.title || "Content blocks"}
      >
        {section.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} theme={theme} />
        ))}
      </div>
    </section>
  );
});

SectionRenderer.displayName = "SectionRenderer";

export const TemplateRenderer: React.FC<{ template: Template }> = memo(({ template }) => {
  const themeStyles = useMemo<React.CSSProperties>(() => ({
    backgroundColor: template.styles?.backgroundColor || "#ffffff",
    color: template.styles?.textColor || "#333333",
    fontFamily: template.styles?.fontFamily || template.styles?.bodyFont || "inherit",
    "--primary-color": template.styles?.primaryColor || "#FF6E35",
    "--secondary-color": template.styles?.secondaryColor || "#99B3B6",
    "--heading-font": template.styles?.headingFont || "inherit",
    "--body-font": template.styles?.bodyFont || "inherit",
  }), [template.styles]);

  return (
    <div 
      className="template-container px-4 py-8 md:px-8 md:py-12" 
      data-template-id={template.id}
      style={themeStyles}
      role="main"
      aria-label="Template content"
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        }>
          {template.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} theme={template.styles} />
          ))}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
});

TemplateRenderer.displayName = "TemplateRenderer"; 