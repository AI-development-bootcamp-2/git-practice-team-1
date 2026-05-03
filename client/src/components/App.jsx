import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import TodoList from './TodoList';
import AddTodo from './AddTodo';
import FilterBar from './FilterBar';
import { isTodoOverdue } from '../utils/todoDates';
import '../App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    overdueOnly: false
  });
  const [view, setView] = useState('list');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await api.todos.getAll();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async ({ title, dueDate }) => {
    try {
      const newTodo = await api.todos.create({ title, dueDate });
      setTodos([...todos, newTodo]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await api.todos.update(id, { status: newStatus });
      setTodos(todos.map(t => t.id === id ? updated : t));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTitleSaved = (updatedTodo) => {
    setTodos(todos.map(t => t.id === updatedTodo.id ? updatedTodo : t));
  };

  const handleDelete = async (id) => {
    try {
      await api.todos.delete(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTodos = todos.filter(todo => {
    const title = String(todo.title || '').toLowerCase();
    const search = filters.search.trim().toLowerCase();
    const status = todo.status || 'todo';
    const priority = todo.priority || 'medium';

    const matchesSearch = !search || title.includes(search);
    const matchesStatus = filters.status === 'all' || status === filters.status;
    const matchesPriority = filters.priority === 'all' || priority === filters.priority;
    const matchesOverdue = !filters.overdueOnly || isTodoOverdue(todo);

    return matchesSearch && matchesStatus && matchesPriority && matchesOverdue;
  });

  return (
    <div className="app">
      <header className="header">
        <h1>Todo App</h1>
      </header>

      <main className="main">
        <AddTodo onAdd={handleAdd} />

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>x</button>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <FilterBar filters={filters} onFiltersChange={setFilters} />

            <div className="view-toggle" aria-label="Choose todo view">
              <button
                type="button"
                className={view === 'list' ? 'active' : ''}
                onClick={() => setView('list')}
              >
                List
              </button>
              <button
                type="button"
                className={view === 'board' ? 'active' : ''}
                onClick={() => setView('board')}
              >
                Board
              </button>
            </div>

            {filteredTodos.length === 0 ? (
              <div className="empty-state">
                <p>No results</p>
              </div>
            ) : view === 'board' ? (
              <div className="board-placeholder">
                Board view is not available yet.
              </div>
            ) : (
              <TodoList
                todos={filteredTodos}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onTitleSaved={handleTitleSaved}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
