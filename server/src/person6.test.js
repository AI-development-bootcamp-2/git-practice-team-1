import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import todosRoutes from './routes/todos.js';
import { todoService } from './services/todoService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataFile = join(__dirname, 'data/todos.json');
const originalData = readFileSync(dataFile, 'utf-8');

function seedTodos(todos) {
  writeFileSync(dataFile, JSON.stringify(todos, null, 2));
}

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  } finally {
    writeFileSync(dataFile, originalData);
  }
}

async function buildApp() {
  const handlers = new Map();
  const fastify = {
    get(path, handler) {
      handlers.set(`GET ${path}`, handler);
    },
    post(path, handler) {
      handlers.set(`POST ${path}`, handler);
    },
    put(path, handler) {
      handlers.set(`PUT ${path}`, handler);
    },
    patch(path, handler) {
      handlers.set(`PATCH ${path}`, handler);
    },
    delete(path, handler) {
      handlers.set(`DELETE ${path}`, handler);
    },
  };

  await todosRoutes(fastify, {});
  return handlers;
}

await runTest('create persists dueDate and defaults to null when missing', async () => {
  seedTodos([]);

  const withDueDate = todoService.create({
    title: 'Has due date',
    dueDate: '2026-05-10T00:00:00.000Z',
  });
  const withoutDueDate = todoService.create({
    title: 'No due date',
  });

  assert.equal(withDueDate.dueDate, '2026-05-10T00:00:00.000Z');
  assert.equal(withoutDueDate.dueDate, null);
});

await runTest('getStats filters by createdAt range and counts overdue pending todos only', async () => {
  seedTodos([
    {
      id: 'a',
      title: 'Old pending overdue',
      status: 'todo',
      dueDate: '2026-05-01T00:00:00.000Z',
      createdAt: '2026-05-02T09:00:00.000Z',
      updatedAt: '2026-05-02T09:00:00.000Z',
    },
    {
      id: 'b',
      title: 'In range done overdue',
      status: 'done',
      dueDate: '2026-05-01T00:00:00.000Z',
      createdAt: '2026-05-03T09:00:00.000Z',
      updatedAt: '2026-05-03T09:00:00.000Z',
    },
    {
      id: 'c',
      title: 'In range pending future',
      status: 'todo',
      dueDate: '2099-05-10T00:00:00.000Z',
      createdAt: '2026-05-04T09:00:00.000Z',
      updatedAt: '2026-05-04T09:00:00.000Z',
    },
    {
      id: 'd',
      title: 'Out of range',
      status: 'todo',
      dueDate: null,
      createdAt: '2026-05-20T09:00:00.000Z',
      updatedAt: '2026-05-20T09:00:00.000Z',
    },
  ]);

  const stats = todoService.getStats({
    from: '2026-05-03',
    to: '2026-05-04',
  });

  assert.deepEqual(stats, {
    total: 2,
    todo: 1,
    done: 1,
    overdue: 0,
    from: '2026-05-03',
    to: '2026-05-04',
  });
});

await runTest('getStats ignores invalid date filters instead of dropping all data', async () => {
  seedTodos([
    {
      id: 'a',
      title: 'Keep me',
      status: 'todo',
      dueDate: null,
      createdAt: '2026-05-03T09:00:00.000Z',
      updatedAt: '2026-05-03T09:00:00.000Z',
    },
  ]);

  const stats = todoService.getStats({
    from: 'not-a-date',
    to: 'also-not-a-date',
  });

  assert.equal(stats.total, 1);
  assert.equal(stats.todo, 1);
});

await runTest('POST /api/todos creates a todo with a dueDate', async () => {
  seedTodos([]);
  const handlers = await buildApp();
  const reply = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(payload) {
      this.payload = payload;
      return payload;
    },
  };

  const result = await handlers.get('POST /')(
    {
      body: {
        title: '  Write regression tests  ',
        dueDate: '2026-05-10T00:00:00.000Z',
      },
    },
    reply
  );

  assert.equal(reply.statusCode, 201);
  assert.equal(result.title, 'Write regression tests');
  assert.equal(result.dueDate, '2026-05-10T00:00:00.000Z');
  assert.equal(result.status, 'todo');
});

await runTest('POST /api/todos rejects an empty title even when dueDate is present', async () => {
  seedTodos([]);
  const handlers = await buildApp();
  const reply = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(payload) {
      this.payload = payload;
      return payload;
    },
  };

  await handlers.get('POST /')(
    {
      body: {
        title: '   ',
        dueDate: '2026-05-10T00:00:00.000Z',
      },
    },
    reply
  );

  assert.equal(reply.statusCode, 400);
  assert.deepEqual(reply.payload, { error: 'Title is required' });
});

await runTest('GET /api/todos/stats applies from and to filters to the stats response', async () => {
  seedTodos([
    {
      id: '1',
      title: 'In range pending',
      status: 'todo',
      dueDate: '2099-05-10T00:00:00.000Z',
      createdAt: '2026-05-03T12:00:00.000Z',
      updatedAt: '2026-05-03T12:00:00.000Z',
    },
    {
      id: '2',
      title: 'Out of range',
      status: 'done',
      dueDate: null,
      createdAt: '2026-05-10T12:00:00.000Z',
      updatedAt: '2026-05-10T12:00:00.000Z',
    },
  ]);

  const handlers = await buildApp();
  const result = await handlers.get('GET /stats')(
    {
      query: {
        from: '2026-05-03',
        to: '2026-05-03',
      },
    },
    {}
  );

  assert.deepEqual(result, {
    total: 1,
    todo: 1,
    done: 0,
    overdue: 0,
    from: '2026-05-03',
    to: '2026-05-03',
  });
});

writeFileSync(dataFile, originalData);
console.log('Person 6 server tests passed');
