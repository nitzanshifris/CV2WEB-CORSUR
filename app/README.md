# CV-to-Website Generator

## Project Structure

### Projects
- `projects/main-app/` - Main Next.js application
  - Core application with user interface and API
  - Uses Next.js, React, and TypeScript
  - Integrates with Supabase for backend services

- `projects/cv2web/` - CV to Website Generator
  - AI-powered CV parsing and website generation
  - Built with Next.js and TypeScript
  - Uses Supabase for data storage

- `projects/joshwcomeau-clone/` - Josh W. Comeau website clone
  - Learning project based on Josh's website
  - Implements modern web development practices
  - Uses Next.js and TypeScript

- `projects/python-legacy/` - Legacy Python implementation
  - Original Python-based CV parser
  - Kept for reference and comparison
  - Uses Python and OpenCV

### Configuration
- `config/next/` - Next.js configuration files
  - `next.config.js` - Next.js configuration
  - `tailwind.config.js` - Tailwind CSS configuration
  - `tsconfig.json` - TypeScript configuration
  - `vercel.json` - Vercel deployment configuration
  - `docker-compose.yml` - Docker configuration

- `config/typescript/` - TypeScript configuration
  - Type definitions and configurations
  - Shared types between projects

- `config/docker/` - Docker configuration
  - Docker compose files
  - Container configurations

- `config/vercel/` - Vercel deployment configuration
  - Deployment settings
  - Environment configurations

- `config/supabase/` - Supabase configuration
  - Database schemas
  - Migration scripts
  - Seed data

### System
- `system/public/` - Static files
  - Images, fonts, and other assets
  - Shared between projects

- `system/uploads/` - User uploads
  - CV documents
  - Profile pictures
  - Temporary files

- `system/logs/` - Application logs
  - Error logs
  - Access logs
  - Debug information

- `system/temp/` - Temporary files
  - Processing files
  - Cache files
  - Session data

## Getting Started

1. Clone the repository
2. Install dependencies in each project directory:
   ```bash
   cd projects/[project-name]
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in each project
   - Update the values as needed

4. Start the development servers:
   ```bash
   # For main-app
   cd projects/main-app
   npm run dev

   # For cv2web
   cd projects/cv2web
   npm run dev

   # For joshwcomeau-clone
   cd projects/joshwcomeau-clone
   npm run dev
   ```

## Development

Each project has its own README.md with specific instructions.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details 