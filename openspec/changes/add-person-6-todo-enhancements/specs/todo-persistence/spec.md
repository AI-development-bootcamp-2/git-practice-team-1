## MODIFIED Requirements
### Requirement: Todo Data Model
Each todo SHALL have an id, title, status, createdAt, updatedAt, and optional dueDate fields.

#### Scenario: New todo structure
- **WHEN** a todo is created
- **THEN** it has id (UUID), title (string), status (todo|done), createdAt (ISO date), updatedAt (ISO date), and dueDate (ISO date or null)

#### Scenario: Default status
- **WHEN** a todo is created without status
- **THEN** status defaults to "todo"

#### Scenario: Missing due date
- **WHEN** a todo is created without a due date
- **THEN** dueDate is stored as null

### Requirement: CRUD Operations
The service SHALL provide methods for create, read, update, delete, and stats-filter support operations.

#### Scenario: Create todo
- **WHEN** create is called with title and optional due date
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

#### Scenario: Filter stats by date range
- **WHEN** stats are requested with `from` and/or `to` values
- **THEN** the service applies the range filter to the underlying todo set before computing stats
