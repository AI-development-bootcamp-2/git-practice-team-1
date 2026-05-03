import React from 'react';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' }
];

function TodoItem({ todo, onStatusChange, onDelete }) {
  return (
    <div className={`todo-item ${todo.status === 'done' ? 'done' : ''}`}>
      <select
        className="status-select"
        value={todo.status || 'todo'}
        onChange={(e) => onStatusChange(todo.id, e.target.value)}
        aria-label={`Change status for ${todo.title}`}
      >
        {STATUS_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <span className="todo-title">{todo.title}</span>

      <button
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
      >
        Delete
      </button>
    </div>
  );
}

export default TodoItem;
