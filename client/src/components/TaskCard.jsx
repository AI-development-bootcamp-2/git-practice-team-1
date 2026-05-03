import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' };

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function TaskCard({ todo, overlay = false }) {
  const { title, priority, dueDate, tags = [] } = todo;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: todo.id });

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      className={`task-card${isDragging && !overlay ? ' task-card-ghost' : ''}${overlay ? ' task-card-dragging' : ''}`}
      {...(overlay ? {} : { ...listeners, ...attributes })}
    >
      <p className="task-card-title">{title}</p>

      <div className="task-card-meta">
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
