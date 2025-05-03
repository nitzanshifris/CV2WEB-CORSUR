import { Resume } from "@/types/resume";
import { Template } from "@/types/template";
import Handlebars from "handlebars";

// Register custom helpers
Handlebars.registerHelper('formatDate', (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
});

Handlebars.registerHelper('formatDuration', (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = endDate === 'present' ? new Date() : new Date(endDate);
  
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  
  let duration = '';
  if (years > 0) {
    duration += `${years} ${years === 1 ? 'year' : 'years'}`;
  }
  if (months > 0) {
    if (duration) duration += ' ';
    duration += `${months} ${months === 1 ? 'month' : 'months'}`;
  }
  
  return duration || 'Less than a month';
});

// Add responsive design helpers
Handlebars.registerHelper('responsiveClass', (size: string) => {
  return `responsive-${size}`;
});

export async function processTemplate(resume: Resume, template: Template): Promise<string> {
  try {
    // Compile the template
    const compiledTemplate = Handlebars.compile(template.html);
    
    // Process the resume data
    const processedData = {
      ...resume,
      sections: resume.sections.map(section => ({
        ...section,
        items: section.items.map(item => ({
          ...item,
          // Add any additional processing for items here
        }))
      }))
    };
    
    // Generate the HTML
    const html = compiledTemplate(processedData);
    
    // Add responsive styles and meta tags
    const styledHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="theme-color" content="#ffffff">
          <style>
            ${template.styles}
            
            /* Base responsive styles */
            :root {
              --max-width: 1200px;
              --content-padding: 20px;
              --mobile-breakpoint: 768px;
              --tablet-breakpoint: 1024px;
            }
            
            body {
              margin: 0;
              padding: var(--content-padding);
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.5;
              color: #333;
            }
            
            .container {
              max-width: var(--max-width);
              margin: 0 auto;
              padding: 0 var(--content-padding);
            }
            
            /* Responsive grid system */
            .grid {
              display: grid;
              gap: 1rem;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            }
            
            /* Responsive typography */
            h1 { font-size: clamp(2rem, 5vw, 3rem); }
            h2 { font-size: clamp(1.5rem, 4vw, 2.5rem); }
            h3 { font-size: clamp(1.25rem, 3vw, 2rem); }
            p { font-size: clamp(1rem, 2vw, 1.25rem); }
            
            /* Responsive images */
            img {
              max-width: 100%;
              height: auto;
            }
            
            /* Print styles */
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              
              .no-print {
                display: none;
              }
              
              .container {
                max-width: 100%;
                padding: 0;
              }
            }
            
            /* Mobile styles */
            @media (max-width: 768px) {
              .grid {
                grid-template-columns: 1fr;
              }
              
              .container {
                padding: 0 1rem;
              }
              
              .section {
                margin-bottom: 2rem;
              }
            }
            
            /* Tablet styles */
            @media (min-width: 769px) and (max-width: 1024px) {
              .grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }
            
            /* Desktop styles */
            @media (min-width: 1025px) {
              .grid {
                grid-template-columns: repeat(3, 1fr);
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${html}
          </div>
        </body>
      </html>
    `;
    
    return styledHtml;
  } catch (error) {
    console.error('Error processing template:', error);
    throw new Error('Failed to process template');
  }
} 