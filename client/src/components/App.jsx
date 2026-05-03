import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import TodoList from './TodoList';
import AddTodo from './AddTodo';

import FilterBar from './FilterBar';

import StatsPage from './StatsPage';

import BoardView from './BoardView';

import '../App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all'
  });
  const [view, setView] = useState('list');


  const [currentView, setCurrentView] = useState('tasks');

  // PERSON6 INTEGRATION: Person 5's overdue-only UI should filter this list before rendering.


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

    return matchesSearch && matchesStatus && matchesPriority;
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
        {currentView === 'tasks' ? (
          <>
            <AddTodo onAdd={handleAdd} />


            {error && (
              <div className="error-message">
                {error}
                <button onClick={() => setError(null)}>x</button>
              </div>
            )}

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
              <TodoList
                todos={todos}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            )}
          </>
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


          <StatsPage />


          <>
            
            <BoardView todos={todos} onTodosChange={setTodos} />
          </>


        )}
      </main>
    </div>
  );
}

export default App;
