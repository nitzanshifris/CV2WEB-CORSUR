# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build`
- Lint: `npm run lint`
- Type check: `npm run type-check`
- Format: `npm run format`
- Test all: `npm run test`
- Test watch: `npm run test:watch`
- Single test: `jest path/to/file.test.ts` or `jest -t "test description"`

## Code Style
- TypeScript strict mode with comprehensive type safety
- React functional components with hooks
- Import order: React, external libs, internal modules, types, styles
- Naming: camelCase variables/functions, PascalCase components/types
- Error handling: Use error-utils.ts for consistent error handling

## Tech Stack
- Next.js 14, TypeScript, Tailwind CSS, shadcn/ui components
- Testing: Jest (unit), Playwright (E2E), 80% coverage minimum
- AI services: OpenAI/Claude for CV parsing and template generation
- Database: Supabase with migrations and type safety