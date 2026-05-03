# todo-components Specification

## Purpose
TBD - created by archiving change add-todo-components. Update Purpose after archive.
## Requirements
### Requirement: App Component
The App component SHALL manage todo state and coordinate child components.

#### Scenario: Initial load
- **WHEN** app mounts
- **THEN** todos are fetched from API and displayed

#### Scenario: Loading state
- **WHEN** todos are being fetched
- **THEN** loading indicator is shown

#### Scenario: Error display
- **WHEN** API error occurs
- **THEN** error message is displayed with dismiss button

### Requirement: TodoList Component
The TodoList component SHALL display todos grouped by status.

#### Scenario: Empty state
- **WHEN** no todos exist
- **THEN** message "No todos yet. Add one above!" is shown

#### Scenario: Grouped display
- **WHEN** todos exist
- **THEN** they are grouped into "To Do" and "Done" sections

#### Scenario: Section counts
- **WHEN** sections are displayed
- **THEN** each section header shows item count

### Requirement: TodoItem Component
The TodoItem component SHALL display a single todo with actions.

#### Scenario: Display todo
- **WHEN** todo is rendered
- **THEN** title, toggle button, and delete button are shown

#### Scenario: Done styling
- **WHEN** todo status is done
- **THEN** title has strikethrough and opacity is reduced

#### Scenario: Toggle action
- **WHEN** toggle button is clicked
- **THEN** onToggle callback is invoked with todo ID

#### Scenario: Delete action
- **WHEN** delete button is clicked
- **THEN** onDelete callback is invoked with todo ID

### Requirement: AddTodo Component
The AddTodo component SHALL provide a form to create new todos.

#### Scenario: Form submission
- **WHEN** form is submitted with non-empty title
- **THEN** onAdd callback is invoked and input is cleared

#### Scenario: Empty validation
- **WHEN** input is empty
- **THEN** add button is disabled

### Requirement: Visual Design
The UI SHALL follow a clean, minimal design with consistent styling.

#### Scenario: Brand header
- **WHEN** app is displayed
- **THEN** header has blue background (#4361ee) with title

#### Scenario: Interactive feedback
- **WHEN** user hovers over todo item
- **THEN** shadow increases and delete button appears

#### Scenario: Responsive layout
- **WHEN** app is viewed
- **THEN** content is centered with max-width of 600px

