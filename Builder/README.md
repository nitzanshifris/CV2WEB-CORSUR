# Builder Team

This directory contains the CV builder implementation of the CV2Web project.

## Directory Structure

- `src/` - Source code
  - `core/` - Core builder logic
  - `templates/` - CV templates
  - `plugins/` - Builder plugins
  - `utils/` - Helper functions

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

## Development Guidelines

- Follow the plugin architecture guidelines
- Use TypeScript for all new code
- Write unit tests for core functionality
- Document all template configurations

## Features

- PDF and DOCX file parsing
- Information extraction from CVs:
  - Personal information (name, title, contact details)
  - Skills
  - Work experience
  - Education
- Template-based website generation
- Responsive design support

## Project Structure

```
Builder/
├── src/
│   ├── parser/              # CV parsing functionality
│   │   ├── extractors/      # Information extraction functions
│   │   └── utils/           # Parser utilities
│   ├── templates/           # Website templates
│   │   ├── components/      # React components
│   │   └── themes/          # Theme definitions
│   ├── renderer/            # Website rendering
│   └── deploy/              # Deployment utilities
├── tests/                   # Test files
├── .eslintrc.js            # ESLint configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Usage

```typescript
import { parsePDF, parseDOCX } from './src/parser';

// Parse a PDF file
const pdfFile = new File(['...'], 'resume.pdf', { type: 'application/pdf' });
const pdfData = await parsePDF(pdfFile);

// Parse a DOCX file
const docxFile = new File(['...'], 'resume.docx', {
  type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
});
const docxData = await parseDOCX(docxFile);
```

## Development

- Use TypeScript for all new code
- Follow the existing code style
- Write tests for new functionality
- Update documentation as needed

## License

MIT
