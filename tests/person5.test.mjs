import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appSource = readFileSync(join(__dirname, '../client/src/components/App.jsx'), 'utf-8');
const filterBarSource = readFileSync(join(__dirname, '../client/src/components/FilterBar.jsx'), 'utf-8');
const todoItemSource = readFileSync(join(__dirname, '../client/src/components/TodoItem.jsx'), 'utf-8');

function runTest(name, fn) {
  fn();
  console.log(`PASS person5 ${name}`);
}

runTest('filter bar supports search status priority and overdue filter', () => {
  assert.match(filterBarSource, /Search todos/);
  assert.match(filterBarSource, /Filter by status/);
  assert.match(filterBarSource, /Filter by priority/);
  assert.match(filterBarSource, /Show overdue only/);
});

runTest('app supports list board and statistics/task navigation', () => {
  assert.match(appSource, /setView\('board'\)/);
  assert.match(appSource, /setView\('list'\)/);
  assert.match(appSource, /setCurrentView\('tasks'\)/);
  assert.match(appSource, /setCurrentView\('stats'\)/);
});

runTest('todo item exposes multi-status selector', () => {
  assert.match(todoItemSource, /STATUS_OPTIONS/);
  assert.match(todoItemSource, /in-progress/);
  assert.match(todoItemSource, /review/);
});

console.log('Person 5 tests passed');
