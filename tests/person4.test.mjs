import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const addTodoSource = readFileSync(join(__dirname, '../client/src/components/AddTodo.jsx'), 'utf-8');
const todoItemSource = readFileSync(join(__dirname, '../client/src/components/TodoItem.jsx'), 'utf-8');
const taskCardSource = readFileSync(join(__dirname, '../client/src/components/TaskCard.jsx'), 'utf-8');

function runTest(name, fn) {
  fn();
  console.log(`PASS person4 ${name}`);
}

runTest('add todo exposes priority selection and tag entry', () => {
  assert.match(addTodoSource, /priority-select|Priority/);
  assert.match(addTodoSource, /Add a tag and press Enter/);
});

runTest('todo item renders priority and status badge styling', () => {
  assert.match(todoItemSource, /PRIORITY_OPTIONS|PRIORITY_COLORS|priority/);
  assert.match(todoItemSource, /StatusBadge/);
  assert.match(todoItemSource, /TAG_COLORS|tag/);
});

runTest('task card includes shared status badge and priority badge', () => {
  assert.match(taskCardSource, /StatusBadge/);
  assert.match(taskCardSource, /priority-badge/);
});

console.log('Person 4 tests passed');
