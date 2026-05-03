# Work Plan — Task Management Workshop

## Phase 0: Do Together First (~30 min)

Before anyone writes code, agree on the shared data contract.

### Agreed Todo Shape

```js
{
  id: string,
  title: string,
  status: 'todo' | 'in-progress' | 'review' | 'done',  // was: 'todo'|'done'
  priority: 'low' | 'medium' | 'high',                  // NEW, default: 'medium'
  dueDate: string | null,                                // NEW, ISO 8601 or null
  tags: string[],                                        // NEW, default: []
  createdAt: string,
  updatedAt: string
}
```

### Agreed API Endpoints

| Method | Route             | Who adds it |
|--------|-------------------|-------------|
| GET    | `/api/todos`      | existing    |
| POST   | `/api/todos`      | existing    |
| PUT    | `/api/todos/:id`  | existing    |
| DELETE | `/api/todos/:id`  | existing    |
| GET    | `/api/statuses`   | Person 3    |
| GET    | `/api/todos/stats`| Person 3    |

### First Commit (Person 2 does this, everyone pulls before starting)

Update `server/src/data/todos.json` with sample todos that include all new fields:

```json
[
  {
    "id": "1",
    "title": "Example task",
    "status": "todo",
    "priority": "medium",
    "dueDate": null,
    "tags": [],
    "createdAt": "2026-05-03T08:00:00.000Z",
    "updatedAt": "2026-05-03T08:00:00.000Z"
  }
]
```

---

## Person 2 — Board View + Drag & Drop + Data Model

**Branch:** `person-2`

### Step 1 — Data model (do first, others depend on this)
- `server/src/services/todoService.js` → update `create()` to include `priority: 'medium'`, `tags: []`, `dueDate: null`
- `server/src/data/todos.json` → update sample data with all new fields
- Commit and push so everyone can pull

### Step 2 — Board View (client)
- Create `client/src/components/BoardView.jsx` — 4 columns side by side
- Create `client/src/components/BoardColumn.jsx` — column with title + task count + list of cards
- Create `client/src/components/TaskCard.jsx` — card showing title, priority, due date, tags
- Wire into `App.jsx` (Person 5 will add the toggle button later)

### Step 3 — Drag & Drop
- Install `dnd-kit`: `npm install @dnd-kit/core @dnd-kit/sortable`
- Wrap `BoardView.jsx` with `DndContext`
- On drop: call `api.todos.update(id, { status: newColumn })` 
- If server update fails: revert card to original column

---

## Person 3 — Statistics Page + Graphs + Server Validation

**Branch:** `person-3`

### Step 1 — Server: status validation
- `server/src/routes/todos.js` → in the PUT handler, validate that `status` is one of the 4 valid values before calling `todoService.update()`
- Add `GET /api/statuses` route that returns `['todo','in-progress','review','done']`

### Step 2 — Server: stats endpoint
- `server/src/services/todoService.js` → add `getStats()` method:
  ```js
  getStats() {
    const todos = readTodos();
    return {
      total: todos.length,
      byStatus: { todo: 0, 'in-progress': 0, review: 0, done: 0 },
      completionPercent: 0,
      createdByDate: {}   // { 'YYYY-MM-DD': count }
    };
  }
  ```
- `server/src/routes/todos.js` → add `GET /stats` route (register before `/:id` to avoid conflict)

### Step 3 — Stats Page (client)
- Install recharts: `npm install recharts`
- Create `client/src/components/StatsPage.jsx`
  - Fetch from `/api/todos/stats`
  - Show metric cards: Total, by Status, Completion %
  - Pie chart: tasks by status
  - Bar chart: tasks created by date
- Add basic navigation in `App.jsx` (two buttons: Tasks / Statistics)

---

## Person 4 — Priority + Tags + Status Badge UI

**Branch:** `person-4`

### Step 1 — Status badge (client, uses Person 2's data model)
- `client/src/components/TodoItem.jsx` → replace plain status text with a colored badge:
  - `todo` → grey
  - `in-progress` → blue
  - `review` → orange
  - `done` → green
- Also apply the same badge to `TaskCard.jsx` (coordinate with Person 2)

### Step 2 — Priority (client + minimal server awareness)
- `client/src/components/AddTodo.jsx` → add priority select (low / medium / high), default medium
- `client/src/services/api.js` → pass `priority` in the POST body
- `client/src/components/TodoItem.jsx` → show priority icon/color:
  - `high` → red `!`
  - `medium` → yellow `~`
  - `low` → grey `↓`

### Step 3 — Tags (client)
- `client/src/components/AddTodo.jsx` → add tag input (type and press Enter to add a tag)
- `client/src/components/TodoItem.jsx` → render colored tag chips
- `client/src/services/api.js` → pass `tags` array in the POST body

---

## Person 5 — Search & Filter + View Toggle + Status Change UI

**Branch:** `person-5`

### Step 1 — Status change UI (depends on Person 2's data model)
- `client/src/components/TodoItem.jsx` → replace the toggle checkbox with a `<select>` showing all 4 statuses
- `client/src/components/App.jsx` → update `handleToggle` → rename to `handleStatusChange(id, newStatus)` and call `api.todos.update(id, { status: newStatus })`

### Step 2 — Search & Filter
- Create `client/src/components/FilterBar.jsx`:
  - Text input for title search
  - Dropdown for status filter (All / todo / in-progress / review / done)
  - Dropdown for priority filter (All / low / medium / high)
- `client/src/components/App.jsx` → apply filters to the `todos` array before passing to `TodoList` and `BoardView`
- Show "No results" message when filters return nothing

### Step 3 — View Toggle
- `client/src/components/App.jsx` → add `const [view, setView] = useState('list')`
- Add two buttons: `List` and `Board`
- Render `<TodoList>` or `<BoardView>` based on `view`
- Pass active filters down to both views

---

## Person 6 — Due Date + Inline Editing + Advanced Stats Filters

**Branch:** `person-6`

### Step 1 — Due Date (client)
- `client/src/components/AddTodo.jsx` → add optional date input (`<input type="date">`)
- `client/src/services/api.js` → pass `dueDate` in the POST body (convert to ISO string or null)
- `client/src/components/TodoItem.jsx` → show due date below the title
  - If `dueDate < today` and status is not `done`: show date in red + "Overdue" label
- `client/src/components/FilterBar.jsx` (coordinate with Person 5) → add "Show overdue only" checkbox

### Step 2 — Inline Editing (no server changes needed)
- `client/src/components/TodoItem.jsx`:
  - Add `const [editing, setEditing] = useState(false)`
  - When `editing` is false: render title as a `<span>` — double-click sets `editing = true`
  - When `editing` is true: render `<input>` with current title value
    - `Enter` or `blur` → validate not empty → call `api.todos.update(id, { title })` → set `editing = false`
    - `Escape` → discard changes → set `editing = false`

### Step 3 — Advanced Stats Filters (depends on Person 3's StatsPage)
- `client/src/components/StatsPage.jsx` → add date range inputs (start / end)
- Pass date range as query params: `GET /api/todos/stats?from=...&to=...`
- `server/src/services/todoService.js` → update `getStats()` to accept and apply date filter
- Add "Reset" button to clear the date filter

---

## Sync Points

```
Start of day
  └── Phase 0: everyone agrees on Todo shape + API (30 min together)

After Phase 0
  └── Person 2 commits updated todos.json → everyone pulls main

~1 hour in
  └── Quick sync: is the data model stable? Any API changes to share?

Mid-day
  └── Merge basic features to main (Features 1-4 server side)
  └── Everyone pulls and resolves conflicts

End of day
  └── Integration check: run the app, test all features together
  └── Fix cross-feature bugs
```

## Git Rules

- Branch name: `person-N`
- Commit often — small commits are easier to review and merge
- Pull from `main` before starting a new feature chunk
- Communicate any API changes in the group chat immediately
- Do not merge to `main` without testing the app runs end-to-end
