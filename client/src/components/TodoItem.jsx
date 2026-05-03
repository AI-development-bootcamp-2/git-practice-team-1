import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { resolveInlineEdit } from '../utils/todoEditing';
import { formatDueDate, isTodoOverdue } from '../utils/todoDates';

function TodoItem({ todo, onToggle, onDelete, onTitleSaved }) {
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
      // PERSON6 INTEGRATION: Person 4/5 changes in TodoItem should preserve inline title saves through onTitleSaved.
      const updatedTodo = await api.todos.update(todo.id, { title: result.title });
      onTitleSaved(updatedTodo);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

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
