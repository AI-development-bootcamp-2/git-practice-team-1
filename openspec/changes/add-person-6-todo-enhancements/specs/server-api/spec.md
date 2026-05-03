## MODIFIED Requirements
### Requirement: Create Todo Endpoint
The API SHALL provide an endpoint to create a new todo with a required title and an optional due date.

#### Scenario: Create with valid title
- **WHEN** POST /api/todos is called with title in body
- **THEN** new todo is created and returned with 201 status

#### Scenario: Create with empty title
- **WHEN** POST /api/todos is called with empty or missing title
- **THEN** 400 status with error message is returned

#### Scenario: Create with due date
- **WHEN** POST /api/todos is called with title and dueDate in body
- **THEN** the created todo includes the persisted due date value

## ADDED Requirements
### Requirement: Todo Stats Endpoint
The API SHALL provide an endpoint to retrieve todo statistics with optional date range filters.

#### Scenario: Filtered stats request
- **WHEN** GET /api/todos/stats is called with `from` and/or `to` query params
- **THEN** the API returns stats computed from todos within the requested range
