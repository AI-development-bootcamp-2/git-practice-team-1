# client-setup Specification

## Purpose
TBD - created by archiving change add-client-setup. Update Purpose after archive.
## Requirements
### Requirement: Vite React Configuration
The client SHALL use Vite with React plugin for development and builds.

#### Scenario: Development server
- **WHEN** developer runs `npm run dev`
- **THEN** Vite dev server starts on port 5173

#### Scenario: Production build
- **WHEN** developer runs `npm run build`
- **THEN** optimized bundle is created in dist/

### Requirement: React Entry Point
The client SHALL render a React 18 application to the DOM.

#### Scenario: App mounting
- **WHEN** index.html loads
- **THEN** React app mounts to #root element with StrictMode

### Requirement: API Service
The client SHALL provide an API service for communicating with the server.

#### Scenario: Fetch all todos
- **WHEN** api.todos.getAll() is called
- **THEN** GET request is made to /api/todos

#### Scenario: Fetch single todo
- **WHEN** api.todos.getById(id) is called
- **THEN** GET request is made to /api/todos/:id

#### Scenario: Create todo
- **WHEN** api.todos.create(title) is called
- **THEN** POST request is made to /api/todos with JSON body

#### Scenario: Update todo
- **WHEN** api.todos.update(id, updates) is called
- **THEN** PUT request is made to /api/todos/:id with JSON body

#### Scenario: Delete todo
- **WHEN** api.todos.delete(id) is called
- **THEN** DELETE request is made to /api/todos/:id

#### Scenario: Error handling
- **WHEN** API request fails
- **THEN** error is thrown with message from response or status code

