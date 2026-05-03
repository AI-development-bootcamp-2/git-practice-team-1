import React from 'react';

const STATUS_COLORS = {
  'todo': '#9e9e9e',
  'in-progress': '#2196f3',
  'review': '#ff9800',
  'done': '#4caf50',
};

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || '#9e9e9e';
  return (
    <span
      className="status-badge"
      style={{
        backgroundColor: color,
        color: '#fff',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: 500,
        textTransform: 'capitalize',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
}

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className={`todo-item ${todo.status === 'done' ? 'done' : ''}`}>
      <button
        className="toggle-btn"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.status === 'done' ? 'Mark as pending' : 'Mark as done'}
      >
        {todo.status === 'done' ? '✓' : '○'}
      </button>

      <span className="todo-title">{todo.title}</span>

      <StatusBadge status={todo.status} />

      <button
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
      >
        🗑️
      </button>
    </div>
  );
}

export default TodoItem;
