// Mock todoService for testing

let todos = [
  {
    id: "1",
    title: "Example task 1",
    status: "todo",
    priority: "medium",
    dueDate: null,
    tags: [],
    createdAt: "2026-05-01T08:00:00.000Z",
    updatedAt: "2026-05-01T08:00:00.000Z"
  },
  {
    id: "2",
    title: "Example task 2",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-05-05T08:00:00.000Z",
    tags: ["urgent"],
    createdAt: "2026-05-02T10:00:00.000Z",
    updatedAt: "2026-05-02T12:00:00.000Z"
  },
  {
    id: "3",
    title: "Example task 3",
    status: "done",
    priority: "low",
    dueDate: null,
    tags: ["easy"],
    createdAt: "2026-05-03T09:00:00.000Z",
    updatedAt: "2026-05-03T15:00:00.000Z"
  }
];

const readTodos = () => {
  return todos;
};

const update = (id, updates) => {
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) {
    todos[index] = { ...todos[index], ...updates, updatedAt: new Date().toISOString() };
    return todos[index];
  }
  return null;
};

const getStats = () => {
  const currentTodos = readTodos();
  const byStatus = { todo: 0, 'in-progress': 0, review: 0, done: 0 };
  const createdByDate = {};

  currentTodos.forEach(todo => {
    // Count status
    if (byStatus[todo.status] !== undefined) {
      byStatus[todo.status]++;
    }

    // Count by creation date (YYYY-MM-DD)
    const dateStr = todo.createdAt.split('T')[0];
    createdByDate[dateStr] = (createdByDate[dateStr] || 0) + 1;
  });

  const total = currentTodos.length;
  const completionPercent = total > 0 ? Math.round((byStatus.done / total) * 100) : 0;

  return {
    total,
    byStatus,
    completionPercent,
    createdByDate
  };
};

module.exports = {
  readTodos,
  update,
  getStats
};
