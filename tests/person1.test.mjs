import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { api } from '../client/src/services/api.js';
import { todoService } from '../server/src/services/todoService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataFile = join(__dirname, '../server/src/data/todos.json');
const originalData = readFileSync(dataFile, 'utf-8');

function seedTodos(todos) {
  writeFileSync(dataFile, JSON.stringify(todos, null, 2));
}

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`PASS person1 ${name}`);
  } finally {
    writeFileSync(dataFile, originalData);
  }
}

await runTest('completeAll marks every todo as done', async () => {
  seedTodos([
    { id: '1', title: 'a', status: 'todo', priority: 'medium', tags: [], dueDate: null, createdAt: '2026-05-01T00:00:00.000Z', updatedAt: '2026-05-01T00:00:00.000Z' },
    { id: '2', title: 'b', status: 'review', priority: 'medium', tags: [], dueDate: null, createdAt: '2026-05-01T00:00:00.000Z', updatedAt: '2026-05-01T00:00:00.000Z' },
  ]);

  const result = todoService.completeAll();
  assert.equal(result.length, 2);
  assert.equal(result.every((todo) => todo.status === 'done'), true);
});

await runTest('deleteDone removes completed todos only', async () => {
  seedTodos([
    { id: '1', title: 'a', status: 'done', priority: 'medium', tags: [], dueDate: null, createdAt: '2026-05-01T00:00:00.000Z', updatedAt: '2026-05-01T00:00:00.000Z' },
    { id: '2', title: 'b', status: 'todo', priority: 'medium', tags: [], dueDate: null, createdAt: '2026-05-01T00:00:00.000Z', updatedAt: '2026-05-01T00:00:00.000Z' },
  ]);

  const result = todoService.deleteDone();
  assert.deepEqual(result.map((todo) => todo.id), ['2']);
});

await runTest('api client uses bulk-action endpoints', async () => {
  const calls = [];
  global.fetch = async (url, options = {}) => {
    calls.push({ url, options });
    return { ok: true, json: async () => [] };
  };

  await api.todos.completeAll();
  await api.todos.deleteDone();

  assert.equal(calls[0].url, 'http://localhost:3001/api/todos/complete-all');
  assert.equal(calls[0].options.method, 'PATCH');
  assert.equal(calls[1].url, 'http://localhost:3001/api/todos/done');
  assert.equal(calls[1].options.method, 'DELETE');
});

console.log('Person 1 tests passed');
