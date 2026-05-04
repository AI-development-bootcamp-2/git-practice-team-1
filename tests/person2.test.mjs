import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { todoService } from '../server/src/services/todoService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataFile = join(__dirname, '../server/src/data/todos.json');
const originalData = readFileSync(dataFile, 'utf-8');
const boardViewSource = readFileSync(join(__dirname, '../client/src/components/BoardView.jsx'), 'utf-8');
const boardColumnSource = readFileSync(join(__dirname, '../client/src/components/BoardColumn.jsx'), 'utf-8');
const taskCardSource = readFileSync(join(__dirname, '../client/src/components/TaskCard.jsx'), 'utf-8');

function resetData() {
  writeFileSync(dataFile, originalData);
}

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`PASS person2 ${name}`);
  } finally {
    resetData();
  }
}

await runTest('create applies shared data-model defaults', async () => {
  resetData();
  const todo = todoService.create({ title: 'Defaults' });
  assert.equal(todo.status, 'todo');
  assert.equal(todo.priority, 'medium');
  assert.equal(todo.dueDate, null);
  assert.deepEqual(todo.tags, []);
});

await runTest('board view keeps drag-and-drop wiring', async () => {
  assert.match(boardViewSource, /DndContext/);
  assert.match(boardViewSource, /DragOverlay/);
  assert.match(boardViewSource, /api\.todos\.update/);
  assert.match(boardViewSource, /onTodosChange\(todos\)/);
});

await runTest('board column and task card exist for board rendering', async () => {
  assert.match(boardColumnSource, /useDroppable/);
  assert.match(taskCardSource, /useDraggable/);
  assert.match(taskCardSource, /priority-badge/);
});

console.log('Person 2 tests passed');
