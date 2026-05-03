# todo-persistence Specification

## Purpose
TBD - created by archiving change add-todo-persistence. Update Purpose after archive.
## Requirements
### Requirement: Todo Data Model
Each todo SHALL have an id, title, status, createdAt, and updatedAt fields.

#### Scenario: New todo structure
- **WHEN** a todo is created
- **THEN** it has id (UUID), title (string), status (todo|done), createdAt (ISO date), updatedAt (ISO date)

#### Scenario: Default status
- **WHEN** a todo is created without status
- **THEN** status defaults to "todo"

### Requirement: File-Based Storage
The service SHALL persist todos to a JSON file.

#### Scenario: Read todos
- **WHEN** getAll is called
- **THEN** all todos from todos.json are returned as an array

#### Scenario: Persist changes
- **WHEN** a todo is created, updated, or deleted
- **THEN** changes are written to todos.json immediately

#### Scenario: Handle missing file
- **WHEN** todos.json does not exist
- **THEN** an empty array is returned

### Requirement: CRUD Operations
The service SHALL provide methods for create, read, update, and delete operations.

#### Scenario: Create todo
- **WHEN** create is called with title
- **THEN** a new todo with generated UUID is added and returned

#### Scenario: Get by ID
- **WHEN** getById is called with valid ID
- **THEN** the matching todo is returned

#### Scenario: Update todo
- **WHEN** update is called with ID and changes
- **THEN** the todo is updated and updatedAt is refreshed

#### Scenario: Delete todo
- **WHEN** delete is called with valid ID
- **THEN** the todo is removed and true is returned

#### Scenario: Delete non-existent
- **WHEN** delete is called with invalid ID
- **THEN** false is returned

