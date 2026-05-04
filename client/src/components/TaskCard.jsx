import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

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

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function TaskCard({ todo, overlay = false, onPriorityChange }) {
  const { title, status, priority, dueDate, tags = [] } = todo;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: todo.id });

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      className={`task-card${isDragging && !overlay ? ' task-card-ghost' : ''}${overlay ? ' task-card-dragging' : ''}`}
      {...(overlay ? {} : { ...listeners, ...attributes })}
    >
      <p className="task-card-title">{title}</p>

      <div className="task-card-meta">
        {status && <StatusBadge status={status} />}
        {dueDate && (
          <span className="due-date">{formatDate(dueDate)}</span>
        )}
      </div>

      {(priority || tags.length > 0) && (
        <div className="task-tags">
          {priority && (!overlay && onPriorityChange ? (
            <select
              className={`priority-select priority-${priority}`}
              value={priority}
              onChange={(e) => onPriorityChange(todo.id, e.target.value)}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label={`Change priority for ${title}`}
            >
              {PRIORITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          ) : (
            <span className={`priority-badge priority-${priority}`}>{priority}</span>
          ))}
          {tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskCard;
