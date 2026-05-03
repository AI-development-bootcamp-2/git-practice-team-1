import React from 'react';
import TaskCard from './TaskCard';

function BoardColumn({ title, todos, colorClass }) {
  return (
    <div className={`board-column ${colorClass}`}>
      <div className="board-column-header">
        <span className="board-column-title">{title}</span>
        <span className="board-column-count">{todos.length}</span>
      </div>

      <div className="board-column-cards">
        {todos.length === 0 ? (
          <p className="board-column-empty">No tasks</p>
        ) : (
          todos.map((todo) => <TaskCard key={todo.id} todo={todo} />)
        )}
      </div>
    </div>
  );
}

export default BoardColumn;
