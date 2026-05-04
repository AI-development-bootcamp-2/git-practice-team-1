import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolveInlineEdit } from '../client/src/utils/todoEditing.js';
import { formatDueDate, isTodoOverdue, toDueDateIso } from '../client/src/utils/todoDates.js';
import { api } from '../client/src/services/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const addTodoSource = readFileSync(join(__dirname, '../client/src/components/AddTodo.jsx'), 'utf-8');
const todoItemSource = readFileSync(join(__dirname, '../client/src/components/TodoItem.jsx'), 'utf-8');

async function runTest(name, fn) {
  await fn();
  console.log(`PASS person6 ${name}`);
}

await runTest('due date helpers convert and format expected values', async () => {
  assert.equal(toDueDateIso('2026-05-10'), '2026-05-10T00:00:00.000Z');
  assert.equal(formatDueDate('2026-05-10T00:00:00.000Z'), '2026-05-10');
  assert.equal(isTodoOverdue({ status: 'todo', dueDate: '2026-05-01T00:00:00.000Z' }, new Date('2026-05-03T12:00:00.000Z')), true);
});

await runTest('inline edit resolver returns action contracts', async () => {
  assert.deepEqual(resolveInlineEdit('Keep', '   '), { action: 'cancel', title: 'Keep' });
  assert.deepEqual(resolveInlineEdit('Keep', 'Keep'), { action: 'noop', title: 'Keep' });
  assert.deepEqual(resolveInlineEdit('Keep', ' New '), { action: 'save', title: 'New' });
});

await runTest('api stats helper includes only defined filters', async () => {
  const calls = [];
  global.fetch = async (url) => {
    calls.push(url);
    return { ok: true, json: async () => ({ total: 0 }) };
  };
  await api.todos.getStats({ from: '2026-05-01', to: '' });
  assert.equal(calls[0], 'http://localhost:3001/api/todos/stats?from=2026-05-01');
});

await runTest('due date input and inline editing exist in component source', async () => {
  assert.match(addTodoSource, /const \[dueDate, setDueDate\]/);
  assert.match(todoItemSource, /onDoubleClick=\{startEditing\}/);
  assert.match(todoItemSource, /resolveInlineEdit/);
});

console.log('Person 6 tests passed');
