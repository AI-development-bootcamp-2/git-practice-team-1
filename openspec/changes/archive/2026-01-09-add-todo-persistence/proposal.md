# Change: Add Todo Persistence

## Why
The Todo application needs a simple persistence layer to store todos across server restarts. A JSON file provides sufficient storage for this workshop without database complexity.

## What Changes
- Create todoService with CRUD operations
- Implement file-based storage using todos.json
- Add initial seed data for workshop participants
- Define Todo data model (id, title, status, timestamps)

## Impact
- Affected specs: todo-persistence (new capability)
- Affected code: server/src/services/todoService.js, server/src/data/todos.json
