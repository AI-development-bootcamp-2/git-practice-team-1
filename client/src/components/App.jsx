import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import TodoList from './TodoList';
import AddTodo from './AddTodo';
import BoardView from './BoardView';
import '../App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handleAdd = async ({ title, dueDate, priority, tags }) => {
    try {
      const newTodo = await api.todos.create({ title, dueDate, priority, tags });
      setTodos([...todos, newTodo]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      const todo = todos.find(t => t.id === id);
      const newStatus = todo.status === 'done' ? 'todo' : 'done';
      const updated = await api.todos.update(id, { status: newStatus });
      setTodos(todos.map(t => t.id === id ? updated : t));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.todos.delete(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTitleSaved = (updatedTodo) => {
    setTodos(todos.map(t => t.id === updatedTodo.id ? updatedTodo : t));
  };

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
      </header>

      <main className="main">
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
            
            <BoardView todos={todos} onTodosChange={setTodos} />
          </>

        )}
      </main>
    </div>
  );
}

export default App;
