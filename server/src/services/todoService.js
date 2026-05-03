import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_FILE = join(__dirname, '../data/todos.json');

function readTodos() {
  try {
    const data = readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeTodos(todos) {
  writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

export const todoService = {
  getAll() {
    return readTodos();
  },

  getById(id) {
    const todos = readTodos();
    return todos.find(todo => todo.id === id);
  },

  create(todoData) {
    const todos = readTodos();
    const newTodo = {
      id: crypto.randomUUID(),
      title: todoData.title,
      status: 'todo',
      priority: 'medium',
      dueDate: null,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    todos.push(newTodo);
    writeTodos(todos);
    return newTodo;
  },

  update(id, updates) {
    const todos = readTodos();
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return null;

    todos[index] = {
      ...todos[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeTodos(todos);
    return todos[index];
  },

  delete(id) {
    const todos = readTodos();
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return false;

    todos.splice(index, 1);
    writeTodos(todos);
    return true;
  },

  getStats() {
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
  }
};
