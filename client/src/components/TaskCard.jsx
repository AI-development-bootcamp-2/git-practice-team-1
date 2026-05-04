import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' };

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

function TaskCard({ todo, overlay = false }) {
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
        {priority && (
          <span className={`priority-badge priority-${priority}`}>
            {PRIORITY_LABELS[priority] ?? priority}
          </span>
        )}
        {dueDate && (
          <span className="due-date">{formatDate(dueDate)}</span>
        )}
      </div>

      {tags.length > 0 && (
        <div className="task-tags">
          {tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskCard;
