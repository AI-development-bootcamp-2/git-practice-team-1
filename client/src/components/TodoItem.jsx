
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { resolveInlineEdit } from '../utils/todoEditing';
import { formatDueDate, isTodoOverdue } from '../utils/todoDates';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' }
];

const STATUS_COLORS = {
  'todo': '#9e9e9e',
  'in-progress': '#2196f3',
  'review': '#ff9800',
  'done': '#4caf50',
};

const TAG_COLORS = ['#6c63ff', '#e91e8c', '#00bcd4', '#43a047', '#fb8c00', '#e53935'];

function TagChips({ tags }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="tag-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
      {tags.map((tag, i) => (
        <span
          key={tag}
          className="tag-chip"
          style={{
            backgroundColor: TAG_COLORS[i % TAG_COLORS.length],
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.72rem',
            fontWeight: 500,
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

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

function TodoItem({ todo, onStatusChange, onPriorityChange, onDelete, onTitleSaved }) {
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraftTitle(todo.title);
  }, [todo.title]);

  const dueDateLabel = formatDueDate(todo.dueDate);
  const overdue = isTodoOverdue(todo);

  const startEditing = () => setEditing(true);

  const cancelEditing = () => {
    setDraftTitle(todo.title);
    setEditing(false);
  };

  const saveTitle = async () => {
    const result = resolveInlineEdit(draftTitle, todo.title);
    if (!result.changed) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const updatedTodo = await api.todos.update(todo.id, { title: result.title });
      onTitleSaved(updatedTodo);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

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
      <select
        className="priority-select"
        value={todo.priority || 'medium'}
        onChange={(e) => onPriorityChange(todo.id, e.target.value)}
        aria-label={`Change priority for ${todo.title}`}
      >
        {PRIORITY_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="todo-content">
        {editing ? (
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={() => { void saveTitle(); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void saveTitle();
              if (e.key === 'Escape') cancelEditing();
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

        {dueDateLabel && (
          <div className={`todo-due-date ${overdue ? 'overdue' : ''}`}>
            <span>Due: {dueDateLabel}</span>
            {overdue && <span className="todo-overdue-badge">Overdue</span>}
          </div>
        )}
        <TagChips tags={todo.tags} />
      </div>

      <StatusBadge status={todo.status} />

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
