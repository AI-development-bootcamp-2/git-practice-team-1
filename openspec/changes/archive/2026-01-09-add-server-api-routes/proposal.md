# Change: Add Server API Routes

## Why
The client needs RESTful endpoints to perform CRUD operations on todos. Routes provide the HTTP interface to the todo persistence service.

## What Changes
- Create todos routes module
- Implement GET /api/todos (list all)
- Implement GET /api/todos/:id (get one)
- Implement POST /api/todos (create)
- Implement PUT /api/todos/:id (update)
- Implement DELETE /api/todos/:id (delete)
- Register routes in server with /api/todos prefix

## Impact
- Affected specs: server-api (new capability)
- Affected code: server/src/routes/todos.js, server/src/server.js
- Dependencies: Requires add-server-core, add-todo-persistence
