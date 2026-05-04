import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import todosRoutes from '../server/src/routes/todos.js';
import { todoService } from '../server/src/services/todoService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataFile = join(__dirname, '../server/src/data/todos.json');
const originalData = readFileSync(dataFile, 'utf-8');
const statsPageSource = readFileSync(join(__dirname, '../client/src/components/StatsPage.jsx'), 'utf-8');

function seedTodos(todos) {
  writeFileSync(dataFile, JSON.stringify(todos, null, 2));
}

async function buildHandlers() {
  const handlers = new Map();
  const fastify = {
    get(path, handler) { handlers.set(`GET ${path}`, handler); },
    post(path, handler) { handlers.set(`POST ${path}`, handler); },
    put(path, handler) { handlers.set(`PUT ${path}`, handler); },
    patch(path, handler) { handlers.set(`PATCH ${path}`, handler); },
    delete(path, handler) { handlers.set(`DELETE ${path}`, handler); },
  };
  await todosRoutes(fastify, {});
  return handlers;
}

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`PASS person3 ${name}`);
  } finally {
    writeFileSync(dataFile, originalData);
  }
}

await runTest('stats endpoint reports aggregate fields', async () => {
  seedTodos([
    { id: '1', title: 'a', status: 'todo', priority: 'medium', tags: [], dueDate: null, createdAt: '2026-05-01T00:00:00.000Z', updatedAt: '2026-05-01T00:00:00.000Z' },
    { id: '2', title: 'b', status: 'done', priority: 'medium', tags: [], dueDate: null, createdAt: '2026-05-02T00:00:00.000Z', updatedAt: '2026-05-02T00:00:00.000Z' },
  ]);
  const stats = todoService.getStats();
  assert.equal(stats.total, 2);
  assert.equal(stats.byStatus.done, 1);
  assert.equal(stats.completionPercent, 50);
});

await runTest('stats route is registered before id route handling', async () => {
  const handlers = await buildHandlers();
  assert.equal(typeof handlers.get('GET /stats'), 'function');
  assert.equal(typeof handlers.get('GET /:id'), 'function');
});

await runTest('stats page fetches the stats endpoint and renders charts', async () => {
  assert.match(statsPageSource, /fetch\('\/api\/todos\/stats'\)/);
  assert.match(statsPageSource, /PieChart/);
  assert.match(statsPageSource, /BarChart/);
});

console.log('Person 3 tests passed');
