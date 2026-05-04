import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import TodoList from './TodoList';
import AddTodo from './AddTodo';
import FilterBar from './FilterBar';
import { isTodoOverdue } from '../utils/todoDates';
import StatsPage from './StatsPage';
import BoardView from './BoardView';
import '../App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({ search: '', status: 'all', priority: 'all', overdueOnly: false });
  const [view, setView] = useState('list');
  const [currentView, setCurrentView] = useState('tasks');

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

  const handleAdd = async ({ title, dueDate, priority, tags }) => {
    try {
      const newTodo = await api.todos.create({ title, dueDate, priority, tags });
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
    // PERSON6: overdue-only filter using isTodoOverdue from todoDates
    const matchesOverdue = !filters.overdueOnly || isTodoOverdue(todo);
    return matchesSearch && matchesStatus && matchesPriority && matchesOverdue;
  });

  const handleCompleteAll = async () => {
    try {
      const updated = await api.todos.completeAll();
      setTodos(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDone = async () => {
    try {
      const remaining = await api.todos.deleteDone();
      setTodos(remaining);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Todo App</h1>
        <nav style={{ marginTop: '10px' }}>
          <button
            onClick={() => setCurrentView('tasks')}
            style={{
              marginRight: '10px',
              padding: '8px 16px',
              backgroundColor: currentView === 'tasks' ? '#007bff' : '#f8f9fa',
              color: currentView === 'tasks' ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Tasks
          </button>
          <button
            onClick={() => setCurrentView('stats')}
            style={{
              padding: '8px 16px',
              backgroundColor: currentView === 'stats' ? '#007bff' : '#f8f9fa',
              color: currentView === 'stats' ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Statistics
          </button>
        </nav>
      </header>

      <main className="main">
        {currentView === 'stats' ? (
          <StatsPage />
        ) : (
          <>
            <AddTodo onAdd={handleAdd} />

            <div className="bulk-actions">
              <button onClick={handleCompleteAll}>Mark All Done</button>
              <button onClick={handleDeleteDone}>Clear Completed</button>
            </div>

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
                  // PERSON6 INTEGRATION: BoardView gets filtered todos; merge drag-and-drop status updates back into full app state.
                  <BoardView
                    todos={filteredTodos}
                    onTodosChange={(updatedFilteredTodos) =>
                      setTodos((currentTodos) => {
                        const updatesById = new Map(
                          updatedFilteredTodos.map((todo) => [todo.id, todo])
                        );

                        return currentTodos.map(
                          (todo) => updatesById.get(todo.id) ?? todo
                        );
                      })
                    }
                  />
                ) : (
                  // PERSON6 INTEGRATION: onTitleSaved must stay here so inline title edits update app state.
                  <TodoList
                    todos={filteredTodos}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onTitleSaved={handleTitleSaved}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
