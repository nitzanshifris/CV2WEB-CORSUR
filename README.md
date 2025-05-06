# CV2Web Project

A modern web application for CV management and generation, built with TypeScript
and React.

## Project Structure

The project is divided into three main components:

- **UI**: Frontend application built with React and TypeScript
- `Services/` - Backend services (Node.js/Express)
- `Builder/` - CV generation and templating engine

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Installation

```bash
# Install dependencies for all workspaces
npm install

# Build all packages
npm run build

# Start development servers
npm run dev
```

## Development

### Available Scripts

- `npm run format` - Format code using Prettier
- `npm run lint` - Lint code using ESLint
- `npm run type-check` - Check TypeScript types
- `npm run test` - Run tests
- `npm run build` - Build all packages
- `npm run dev` - Start development servers
- `npm run clean` - Clean build artifacts and dependencies

### Code Quality

The project uses several tools to ensure code quality:

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking
- Jest for testing
- Husky for git hooks
- Commitlint for commit message validation

### Git Workflow

1. Create a new branch for your feature/fix
2. Make your changes
3. Run tests and linting
4. Commit using conventional commit format
5. Create a pull request

### Commit Message Format

```
type(scope): subject

body

footer
```

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
Scopes: ui, services, builder, deps, config, auth, api, db, test, docs

## Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Building

```bash
# Build all packages
npm run build

# Build specific package
npm run build --workspace=UI
npm run build --workspace=Services
npm run build --workspace=Builder
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for
details.

## Related Policies & Governance

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [SECURITY.md](./SECURITY.md)
- [CODEOWNERS](./CODEOWNERS)

## Revision History

- v1.0 (2024-05-05): Initial version
- v1.1 (2025-05-06): Added governance, security, and contribution policies
