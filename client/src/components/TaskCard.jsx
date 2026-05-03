import React from 'react';

const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' };

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function TaskCard({ todo }) {
  const { title, priority, dueDate, tags = [] } = todo;

  return (
    <div className="task-card">
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
