# project-setup Specification

## Purpose
TBD - created by archiving change setup-project-structure. Update Purpose after archive.
## Requirements
### Requirement: Monorepo Scripts
The root package.json SHALL provide scripts to run client and server together or separately.

#### Scenario: Run both apps
- **WHEN** developer runs `npm run dev`
- **THEN** both client and server start concurrently

#### Scenario: Run server only
- **WHEN** developer runs `npm run server`
- **THEN** only the server starts on port 3001

#### Scenario: Run client only
- **WHEN** developer runs `npm run client`
- **THEN** only the client starts on port 5173

#### Scenario: Install all dependencies
- **WHEN** developer runs `npm run install:all`
- **THEN** dependencies are installed in root, client, and server directories

### Requirement: Git Ignore Configuration
The project SHALL include a `.gitignore` file that excludes build artifacts and dependencies.

#### Scenario: Exclude node_modules
- **WHEN** git status is run
- **THEN** node_modules directories are not tracked

#### Scenario: Exclude build outputs
- **WHEN** client is built
- **THEN** dist/ directory is not tracked by git

### Requirement: Project Documentation
The project SHALL include a README.md with setup and usage instructions.

#### Scenario: Quick start guide
- **WHEN** developer clones the repository
- **THEN** README provides commands to install dependencies and run the app

#### Scenario: API documentation
- **WHEN** developer needs API reference
- **THEN** README lists all available endpoints with methods and descriptions

