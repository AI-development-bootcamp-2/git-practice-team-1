## MODIFIED Requirements
### Requirement: App Component
The App component SHALL manage todo state, coordinate child components, and pass optional due date data through todo creation flows.

#### Scenario: Initial load
- **WHEN** app mounts
- **THEN** todos are fetched from API and displayed

#### Scenario: Loading state
- **WHEN** todos are being fetched
- **THEN** loading indicator is shown

#### Scenario: Error display
- **WHEN** API error occurs
- **THEN** error message is displayed with dismiss button

#### Scenario: Create with optional due date
- **WHEN** a user submits a new todo with a due date
- **THEN** the due date is passed to the API and stored with the created todo

### Requirement: TodoItem Component
The TodoItem component SHALL display a single todo with actions, due date status, and inline title editing.

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

#### Scenario: Show due date
- **WHEN** a todo has a due date
- **THEN** the due date is displayed below the title

#### Scenario: Show overdue state
- **WHEN** a todo due date is before today and the todo is not done
- **THEN** the due date is highlighted and an overdue label is shown

#### Scenario: Start inline editing
- **WHEN** the user double-clicks the title
- **THEN** the title switches to an input initialized with the current value

#### Scenario: Save inline editing
- **WHEN** the user presses Enter or blurs the input with a non-empty edited title
- **THEN** the title update is sent to the API and editing mode exits

#### Scenario: Cancel inline editing
- **WHEN** the user presses Escape while editing
- **THEN** unsaved title changes are discarded and editing mode exits

### Requirement: AddTodo Component
The AddTodo component SHALL provide a form to create new todos with an optional due date.

#### Scenario: Form submission
- **WHEN** form is submitted with non-empty title
- **THEN** onAdd callback is invoked and input is cleared

#### Scenario: Empty validation
- **WHEN** input is empty
- **THEN** add button is disabled

#### Scenario: Optional due date
- **WHEN** the add form is rendered
- **THEN** it includes an optional date input for due date selection

## ADDED Requirements
### Requirement: Integration Placeholders
The client SHALL include clearly marked placeholder integration points for teammate-owned overdue filtering and stats filtering work when those files are absent on the branch.

#### Scenario: Missing FilterBar component
- **WHEN** the branch does not yet include `FilterBar.jsx`
- **THEN** the codebase documents where overdue-only filtering will connect later

#### Scenario: Missing StatsPage component
- **WHEN** the branch does not yet include `StatsPage.jsx`
- **THEN** the codebase documents where date-range stats filtering will connect later
