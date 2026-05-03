
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { resolveInlineEdit } from '../utils/todoEditing';
import { formatDueDate, isTodoOverdue } from '../utils/todoDates';


const STATUS_COLORS = {
  'todo': '#9e9e9e',
  'in-progress': '#2196f3',
  'review': '#ff9800',
  'done': '#4caf50',
};

const PRIORITY_CONFIG = {
  'high':   { icon: '!', color: '#f44336' },
  'medium': { icon: '~', color: '#ffc107' },
  'low':    { icon: '↓', color: '#9e9e9e' },
};

function PriorityIndicator({ priority }) {
  const config = PRIORITY_CONFIG[priority];
  if (!config) return null;
  return (
    <span
      style={{ color: config.color, fontWeight: 700, marginRight: '6px', fontSize: '0.9rem' }}
      aria-label={`Priority: ${priority}`}
    >
      {config.icon}
    </span>
  );
}

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
        {todo.status === 'done' ? 'Done' : 'Open'}
      </button>

      <div className="todo-content">
        {editing ? (
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={() => {
              void saveTitle();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void saveTitle();
              }

              if (e.key === 'Escape') {
                cancelEditing();
              }
            }}
            className="todo-edit-input"
            disabled={saving}
            autoFocus
          />
        ) : (
          <span className="todo-title" onDoubleClick={startEditing} title="Double-click to edit">
            <PriorityIndicator priority={todo.priority} />
            {todo.title}
          </span>
        )}

        {/* PERSON6 INTEGRATION: Person 5 styling/filter changes in TodoItem should keep due-date and overdue rendering intact. */}
        {dueDateLabel && (
          <div className={`todo-due-date ${overdue ? 'overdue' : ''}`}>
            <span>Due: {dueDateLabel}</span>
            {overdue && <span className="todo-overdue-badge">Overdue</span>}
          </div>
        )}
      </div>

      <button
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
      >
        Del
      </button>
    </div>
  );
}

export default TodoItem;
