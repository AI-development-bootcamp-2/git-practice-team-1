import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

function BoardColumn({ id, title, todos, colorClass, onPriorityChange }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`board-column ${colorClass}${isOver ? ' board-column-over' : ''}`}
    >
      <div className="board-column-header">
        <span className="board-column-title">{title}</span>
        <span className="board-column-count">{todos.length}</span>
      </div>

      <div className="board-column-cards">
        {todos.length === 0 ? (
          <p className="board-column-empty">No tasks</p>
        ) : (
          todos.map((todo) => <TaskCard key={todo.id} todo={todo} onPriorityChange={onPriorityChange} />)
        )}
      </div>
    </div>
  );
}

export default BoardColumn;
