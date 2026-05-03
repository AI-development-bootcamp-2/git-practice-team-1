# server-api Specification

## Purpose
TBD - created by archiving change add-server-api-routes. Update Purpose after archive.
## Requirements
### Requirement: List Todos Endpoint
The API SHALL provide an endpoint to list all todos.

#### Scenario: Get all todos
- **WHEN** GET /api/todos is called
- **THEN** all todos are returned as JSON array

### Requirement: Get Single Todo Endpoint
The API SHALL provide an endpoint to get a single todo by ID.

#### Scenario: Get existing todo
- **WHEN** GET /api/todos/:id is called with valid ID
- **THEN** the todo is returned as JSON

#### Scenario: Get non-existent todo
- **WHEN** GET /api/todos/:id is called with invalid ID
- **THEN** 404 status with error message is returned

### Requirement: Create Todo Endpoint
The API SHALL provide an endpoint to create a new todo.

#### Scenario: Create with valid title
- **WHEN** POST /api/todos is called with title in body
- **THEN** new todo is created and returned with 201 status

#### Scenario: Create with empty title
- **WHEN** POST /api/todos is called with empty or missing title
- **THEN** 400 status with error message is returned

### Requirement: Update Todo Endpoint
The API SHALL provide an endpoint to update an existing todo.

#### Scenario: Update existing todo
- **WHEN** PUT /api/todos/:id is called with updates
- **THEN** the todo is updated and returned

#### Scenario: Update non-existent todo
- **WHEN** PUT /api/todos/:id is called with invalid ID
- **THEN** 404 status with error message is returned

### Requirement: Delete Todo Endpoint
The API SHALL provide an endpoint to delete a todo.

#### Scenario: Delete existing todo
- **WHEN** DELETE /api/todos/:id is called with valid ID
- **THEN** the todo is deleted and success response returned

#### Scenario: Delete non-existent todo
- **WHEN** DELETE /api/todos/:id is called with invalid ID
- **THEN** 404 status with error message is returned

