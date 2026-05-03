# Change: Add Person 6 Todo Enhancements

## Why
The workshop assignment adds three capabilities that do not exist in the current base app: due dates, inline title editing, and stats filtering by date range. The branch also lacks teammate-owned UI files (`FilterBar.jsx`, `StatsPage.jsx`), so the change needs explicit placeholders to keep integration clear during later merges.

## What Changes
- Add optional `dueDate` support across todo creation, persistence, and display
- Add overdue visual treatment for non-done todos with past due dates
- Add inline title editing in the todo item component using the existing update API
- Add a server-side stats date filter contract for `from` and `to` query params
- Add clearly marked placeholder integration points for teammate-owned `FilterBar` and `StatsPage` work

## Impact
- Affected specs: `todo-components`, `todo-persistence`, `server-api`
- Affected code: `client/src/components/AddTodo.jsx`, `client/src/components/TodoItem.jsx`, `client/src/components/App.jsx`, `client/src/services/api.js`, `server/src/routes/todos.js`, `server/src/services/todoService.js`
