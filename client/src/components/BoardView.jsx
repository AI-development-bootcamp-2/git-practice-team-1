import React, { useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import BoardColumn from './BoardColumn';
import TaskCard from './TaskCard';
import { api } from '../services/api';

const COLUMNS = [
  { status: 'todo',        title: 'To Do',      colorClass: 'col-todo' },
  { status: 'in-progress', title: 'In Progress', colorClass: 'col-in-progress' },
  { status: 'done',        title: 'Done',        colorClass: 'col-done' },
  { status: 'review',      title: 'Review',      colorClass: 'col-review' },
];

function BoardView({ todos, onTodosChange }) {
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const activeTodo = todos.find((t) => t.id === activeId);

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = async ({ active, over }) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const newStatus = over.id;
    const todo = todos.find((t) => t.id === active.id);
    if (!todo || todo.status === newStatus) return;

    onTodosChange(todos.map((t) => t.id === active.id ? { ...t, status: newStatus } : t));

    try {
      await api.todos.update(active.id, { status: newStatus });
    } catch {
      onTodosChange(todos);
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="board">
        {COLUMNS.map(({ status, title, colorClass }) => (
          <BoardColumn
            key={status}
            id={status}
            title={title}
            todos={todos.filter((t) => t.status === status)}
            colorClass={colorClass}
            activeId={activeId}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTodo ? <TaskCard todo={activeTodo} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default BoardView;
