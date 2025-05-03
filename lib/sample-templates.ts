import type { Template } from "./template-engine";

export const sampleTemplates: Record<string, Template> = {
  "modern": {
    id: "modern",
    name: "Modern",
    description: "A clean and contemporary design with a focus on typography and whitespace",
    sections: [
      {
        id: "hero",
        type: "hero",
        blocks: [
          {
            id: "hero-1",
            type: "hero",
            heading: "{{name}}",
            subheading: "{{title}}"
          }
        ]
      },
      {
        id: "about",
        type: "about",
        blocks: [
          {
            id: "about-1",
            type: "text",
            content: "{{about}}"
          }
        ]
      },
      {
        id: "skills",
        type: "skills",
        blocks: [
          {
            id: "skills-1",
            type: "skills",
            items: "{{skills}}"
          }
        ]
      },
      {
        id: "experience",
        type: "experience",
        blocks: [
          {
            id: "experience-1",
            type: "timeline",
            entries: "{{experience}}"
          }
        ]
      },
      {
        id: "contact",
        type: "contact",
        blocks: [
          {
            id: "contact-1",
            type: "contact",
            email: "{{email}}",
            phone: "{{phone}}"
          }
        ]
      }
    ],
    styles: {
      primaryColor: "#2563eb",
      secondaryColor: "#1e40af",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      headingFont: "Inter",
      bodyFont: "Inter",
      borderRadius: "0.5rem",
      spacing: 1.5
    }
  },
  "minimal": {
    id: "minimal",
    name: "Minimal",
    description: "A minimalist design that focuses on content and readability",
    sections: [
      {
        id: "hero",
        type: "hero",
        blocks: [
          {
            id: "hero-1",
            type: "hero",
            heading: "{{name}}",
            subheading: "{{title}}",
            minimal: true
          }
        ]
      },
      {
        id: "about",
        type: "about",
        blocks: [
          {
            id: "about-1",
            type: "text",
            content: "{{about}}",
            minimal: true
          }
        ]
      },
      {
        id: "experience",
        type: "experience",
        blocks: [
          {
            id: "experience-1",
            type: "timeline",
            entries: "{{experience}}",
            minimal: true
          }
        ]
      }
    ],
    styles: {
      primaryColor: "#000000",
      secondaryColor: "#333333",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      headingFont: "Inter",
      bodyFont: "Inter",
      borderRadius: "0",
      spacing: 1
    }
  },
  "creative": {
    id: "creative",
    name: "Creative",
    description: "A bold and artistic design with unique layouts and visual elements",
    sections: [
      {
        id: "hero",
        type: "hero",
        blocks: [
          {
            id: "hero-1",
            type: "hero",
            heading: "{{name}}",
            subheading: "{{title}}",
            creative: true
          }
        ]
      },
      {
        id: "about",
        type: "about",
        blocks: [
          {
            id: "about-1",
            type: "text",
            content: "{{about}}",
            creative: true
          }
        ]
      },
      {
        id: "skills",
        type: "skills",
        blocks: [
          {
            id: "skills-1",
            type: "skills",
            items: "{{skills}}",
            creative: true
          }
        ]
      },
      {
        id: "experience",
        type: "experience",
        blocks: [
          {
            id: "experience-1",
            type: "timeline",
            entries: "{{experience}}",
            creative: true
          }
        ]
      }
    ],
    styles: {
      primaryColor: "#7c3aed",
      secondaryColor: "#5b21b6",
      backgroundColor: "#f3f4f6",
      textColor: "#1f2937",
      headingFont: "Poppins",
      bodyFont: "Inter",
      borderRadius: "1rem",
      spacing: 2
    }
  }
}; 