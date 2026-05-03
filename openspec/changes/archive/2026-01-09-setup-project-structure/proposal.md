# Change: Setup Project Structure

## Why
The Todo Workshop needs a proper monorepo structure to organize client and server packages with shared tooling for development workflow.

## What Changes
- Create root `package.json` with workspace scripts
- Add `concurrently` for running both dev servers simultaneously
- Create `.gitignore` for Node.js projects
- Write `README.md` with quick start documentation
- Establish `client/` and `server/` directory structure

## Impact
- Affected specs: project-setup (new capability)
- Affected code: Root configuration files (package.json, .gitignore, README.md)
