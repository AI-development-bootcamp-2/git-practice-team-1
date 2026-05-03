import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>No todos yet. Add one above!</p>
      </div>
    );
  }

  const pendingTodos = todos.filter(t => t.status === 'todo');
  const doneTodos = todos.filter(t => t.status === 'done');

  return (
    <div className="todo-list">
      {pendingTodos.length > 0 && (
        <section className="todo-section">
          <h2>To Do ({pendingTodos.length})</h2>
          {pendingTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </section>
      )}

      {doneTodos.length > 0 && (
        <section className="todo-section">
          <h2>Done ({doneTodos.length})</h2>
          {doneTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </section>
      )}
    </div>
  );
}

export default TodoList;
