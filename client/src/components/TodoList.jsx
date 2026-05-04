import React from 'react';
import TodoItem from './TodoItem';

const STATUS_SECTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' }
];

function TodoList({ todos, onStatusChange, onPriorityChange, onDelete, onTitleSaved }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>No todos yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {STATUS_SECTIONS.map(section => {
        const sectionTodos = todos.filter(t => (t.status || 'todo') === section.value);

        if (sectionTodos.length === 0) return null;

        return (
          <section className="todo-section" key={section.value}>
            <h2>{section.label} ({sectionTodos.length})</h2>
            {sectionTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onStatusChange={onStatusChange}
                onPriorityChange={onPriorityChange}
                onDelete={onDelete}
                onTitleSaved={onTitleSaved}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}

export default TodoList;
