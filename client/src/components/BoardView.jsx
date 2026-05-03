import React from 'react';
import BoardColumn from './BoardColumn';

const COLUMNS = [
  { status: 'todo',        title: 'To Do',       colorClass: 'col-todo' },
  { status: 'in-progress', title: 'In Progress',  colorClass: 'col-in-progress' },
  { status: 'done',        title: 'Done',         colorClass: 'col-done' },
  { status: 'review',   title: 'Review',    colorClass: 'col-review' },
];

function BoardView({ todos }) {
  return (
    <div className="board">
      {COLUMNS.map(({ status, title, colorClass }) => (
        <BoardColumn
          key={status}
          title={title}
          todos={todos.filter((t) => t.status === status)}
          colorClass={colorClass}
        />
      ))}
    </div>
  );
}

export default BoardView;
