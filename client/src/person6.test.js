import assert from 'node:assert/strict';

import { api } from './services/api.js';
import { resolveInlineEdit } from './utils/todoEditing.js';
import { formatDueDate, isTodoOverdue, toDueDateIso } from './utils/todoDates.js';

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

await runTest('toDueDateIso returns null when no date is provided', async () => {
  assert.equal(toDueDateIso(''), null);
  assert.equal(toDueDateIso(null), null);
});

await runTest('toDueDateIso converts yyyy-mm-dd input into midnight UTC', async () => {
  assert.equal(toDueDateIso('2026-05-10'), '2026-05-10T00:00:00.000Z');
});

await runTest('formatDueDate returns null when due date is missing', async () => {
  assert.equal(formatDueDate(null), null);
});

await runTest('formatDueDate returns a stable yyyy-mm-dd label', async () => {
  assert.equal(formatDueDate('2026-05-10T00:00:00.000Z'), '2026-05-10');
});

await runTest('isTodoOverdue is false when due date is missing', async () => {
  assert.equal(isTodoOverdue({ status: 'todo', dueDate: null }, new Date('2026-05-03T12:00:00.000Z')), false);
});

await runTest('isTodoOverdue is false for done todos even when the due date is in the past', async () => {
  assert.equal(
    isTodoOverdue(
      { status: 'done', dueDate: '2026-05-01T00:00:00.000Z' },
      new Date('2026-05-03T12:00:00.000Z')
    ),
    false
  );
});

await runTest('isTodoOverdue is true for pending todos with a past due date', async () => {
  assert.equal(
    isTodoOverdue(
      { status: 'todo', dueDate: '2026-05-01T00:00:00.000Z' },
      new Date('2026-05-03T12:00:00.000Z')
    ),
    true
  );
});

await runTest('isTodoOverdue is false when due date is today', async () => {
  assert.equal(
    isTodoOverdue(
      { status: 'todo', dueDate: '2026-05-03T00:00:00.000Z' },
      new Date('2026-05-03T23:59:00.000Z')
    ),
    false
  );
});

await runTest('isTodoOverdue is true for in-progress todos with a past due date', async () => {
  assert.equal(
    isTodoOverdue(
      { status: 'in-progress', dueDate: '2026-05-01T00:00:00.000Z' },
      new Date('2026-05-03T12:00:00.000Z')
    ),
    true
  );
});

await runTest('isTodoOverdue is true for review todos with a past due date', async () => {
  assert.equal(
    isTodoOverdue(
      { status: 'review', dueDate: '2026-05-01T00:00:00.000Z' },
      new Date('2026-05-03T12:00:00.000Z')
    ),
    true
  );
});

await runTest('overdueOnly filter: isTodoOverdue returns false for a non-overdue todo so it is excluded', async () => {
  const futureTodo = { status: 'todo', dueDate: '2099-12-31T00:00:00.000Z' };
  const overdueTodo = { status: 'todo', dueDate: '2026-05-01T00:00:00.000Z' };
  const now = new Date('2026-05-03T12:00:00.000Z');

  assert.equal(isTodoOverdue(futureTodo, now), false);
  assert.equal(isTodoOverdue(overdueTodo, now), true);
});
await runTest('resolveInlineEdit cancels blank edits after trimming', async () => {
  assert.deepEqual(resolveInlineEdit('Keep title', '   '), {
    action: 'cancel',
    title: 'Keep title',
  });
});

await runTest('resolveInlineEdit returns noop when the trimmed draft matches the original title', async () => {
  assert.deepEqual(resolveInlineEdit('Keep title', 'Keep title'), {
    action: 'noop',
    title: 'Keep title',
  });
});

await runTest('resolveInlineEdit returns noop when whitespace-padded draft trims to the original title', async () => {
  assert.deepEqual(resolveInlineEdit('Keep title', '  Keep title  '), {
    action: 'noop',
    title: 'Keep title',
  });
});
await runTest('resolveInlineEdit saves a meaningful trimmed title change', async () => {
  assert.deepEqual(resolveInlineEdit('Old title', '  New title  '), {
    action: 'save',
    title: 'New title',
  });
});

await runTest('api.todos.create sends title and dueDate in the request body', async () => {
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({ id: '1' }),
    };
  };

  await api.todos.create({
    title: 'Write tests',
    dueDate: '2026-05-10T00:00:00.000Z',
  });

  assert.equal(calls[0].url, 'http://localhost:3001/api/todos');
  assert.equal(calls[0].options.method, 'POST');
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    title: 'Write tests',
    dueDate: '2026-05-10T00:00:00.000Z',
    priority: 'medium',
    tags: [],
  });
});

await runTest('api.todos.create sends null dueDate when it is omitted', async () => {
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({ id: '1' }),
    };
  };

  await api.todos.create({
    title: 'No due date yet',
  });

  assert.deepEqual(JSON.parse(calls[0].options.body), {
    title: 'No due date yet',
    dueDate: null,
    priority: 'medium',
    tags: [],
  });
});

await runTest('api.todos.getStats only includes defined query params', async () => {
  const calls = [];
  global.fetch = async (url) => {
    calls.push(url);
    return {
      ok: true,
      json: async () => ({ total: 0 }),
    };
  };

  await api.todos.getStats({ from: '2026-05-01', to: '2026-05-31' });
  await api.todos.getStats({ from: '2026-05-01', to: '' });

  assert.equal(calls[0], 'http://localhost:3001/api/todos/stats?from=2026-05-01&to=2026-05-31');
  assert.equal(calls[1], 'http://localhost:3001/api/todos/stats?from=2026-05-01');
});

await runTest('api.todos.getStats with no params produces a URL with no query string', async () => {
  let capturedUrl;
  global.fetch = async (url) => {
    capturedUrl = url;
    return {
      ok: true,
      json: async () => ({ total: 0 }),
    };
  };

  await api.todos.getStats();

  assert.equal(capturedUrl, 'http://localhost:3001/api/todos/stats');
});

await runTest('api.todos.update sends the correct id and body for inline title saving', async () => {
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({ id: '42', title: 'Updated title' }),
    };
  };

  await api.todos.update('42', { title: 'Updated title' });

  assert.equal(calls[0].url, 'http://localhost:3001/api/todos/42');
  assert.equal(calls[0].options.method, 'PUT');
  assert.deepEqual(JSON.parse(calls[0].options.body), { title: 'Updated title' });
});
await runTest('api propagates server error messages', async () => {
  global.fetch = async () => ({
    ok: false,
    status: 400,
    json: async () => ({ error: 'Title is required' }),
  });

  await assert.rejects(
    () => api.todos.create({ title: '', dueDate: null }),
    /Title is required/
  );
});

console.log('Person 6 client tests passed');
