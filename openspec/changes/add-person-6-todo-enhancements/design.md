## Context
This change spans the existing todo form, item rendering, API client, route layer, and persistence service. The current branch does not contain the expected `FilterBar.jsx` or `StatsPage.jsx` files from other teammates, so implementation must avoid inventing final merge structures while still documenting the intended connection points.

## Goals / Non-Goals
- Goals:
- Add due date support without changing the app's simple architecture
- Add inline editing using the current `PUT /api/todos/:id` endpoint
- Define the server-side stats filter behavior expected by the future stats UI
- Leave explicit mock markers where teammate code will later connect
- Non-Goals:
- Build a full stats page from scratch if Person 3's work is absent
- Invent a final filter bar design that may conflict with Person 5's branch
- Introduce new dependencies or complex validation layers

## Decisions
- Decision: Store `dueDate` as an ISO timestamp or `null`.
- Alternatives considered: Storing a raw `YYYY-MM-DD` string would simplify the form but would make server/client comparisons less consistent with existing timestamp fields.

- Decision: Keep inline editing local to `TodoItem` and persist via the existing `api.todos.update`.
- Alternatives considered: Lifting editing state into `App` would add unnecessary coordination for a simple item-level behavior.

- Decision: Implement stats filtering at the service layer so a future route can delegate cleanly.
- Alternatives considered: Route-only filtering would duplicate logic and scale poorly once the stats endpoint grows.

## Risks / Trade-offs
- Missing teammate files mean the final merge will still require manual wiring.
- Date parsing can drift across time zones, so the UI should compare on normalized day boundaries rather than raw local strings.

## Migration Plan
1. Extend the todo data model with optional `dueDate`.
2. Update client create and item-render flows.
3. Add service-level stats filtering support.
4. Add mock markers for branch integrations that are not yet present.

## Open Questions
- Whether Person 3's stats page expects aggregated counts by `createdAt`, `updatedAt`, or `dueDate`
- Whether Person 5's overdue-only filter will live in `App.jsx` or a dedicated filter component
