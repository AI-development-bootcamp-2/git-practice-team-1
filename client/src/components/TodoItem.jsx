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

function TodoItem({ todo, onStatusChange, onDelete, onTitleSaved }) {
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraftTitle(todo.title);
  }, [todo.title]);

  const dueDateLabel = formatDueDate(todo.dueDate);
  const overdue = isTodoOverdue(todo);

  const startEditing = () => {
    setDraftTitle(todo.title);
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraftTitle(todo.title);
    setEditing(false);
  };

  const saveTitle = async () => {
    const result = resolveInlineEdit(todo.title, draftTitle);

    if (result.action === 'cancel') {
      setDraftTitle(result.title);
      setEditing(false);
      return;
    }

    if (result.action === 'noop') {
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
            {todo.title}
          </span>
        )}

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
        Delete
      </button>
    </div>
  );
}

export default TodoItem;
