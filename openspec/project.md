# Project Context

## Purpose
A simple, clean Todo application for a Git workshop. Teams will extend this base app with new features (Board View, Statistics, etc.) to practice Git workflows.

## Tech Stack
- **Client**: React 18 with Vite
- **Server**: Node.js with Fastify
- **Database**: JSON file (simple file-based persistence)
- **Styling**: Plain CSS (clean, minimal)
- **Package Manager**: npm
- **Structure**: Monorepo with client/ and server/ directories

## Project Conventions

### Code Style
- Use ES modules (type: module)
- Functional React components with hooks
- Descriptive variable names
- Minimal comments - code should be self-documenting

### Architecture Patterns
- Server: Routes → Services → Data
- Client: Components → Services (API) → Server
- Single responsibility per file
- No premature abstraction

### Testing Strategy
- Manual testing for this workshop project
- Future: Add Jest for unit tests as teams extend

### Git Workflow
- Feature branches for new features
- Merge conflicts are intentional learning opportunities
- Small, focused commits

## Domain Context
- **Todo**: A task with title, status (todo/done), and timestamps
- **Status flow**: todo → done (toggle)
- **Persistence**: JSON file on server filesystem

## Important Constraints
- Keep implementation simple for workshop participants
- No authentication required
- No external database dependencies
- Must work offline (file-based storage)

## External Dependencies
- Fastify for HTTP server
- React for UI
- Vite for development tooling
- concurrently for running multiple npm scripts

## Implementation Order

Changes should be implemented in the following order based on dependencies:

| Order | Change | Dependencies |
|-------|--------|--------------|
| 1 | `setup-project-structure` | None |
| 2 | `add-server-core` | None |
| 3 | `add-todo-persistence` | None |
| 4 | `add-server-api-routes` | add-server-core, add-todo-persistence |
| 5 | `add-client-setup` | None |
| 6 | `add-todo-components` | add-client-setup |

Steps 1-3 and 5 can be done in parallel. Step 4 requires 2 and 3. Step 6 requires 5.
