import React, { useState } from 'react';
import { toDueDateIso } from '../utils/todoDates';

function AddTodo({ onAdd }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({
        title: title.trim(),
        dueDate: toDueDateIso(dueDate),
      });
      setTitle('');
      setDueDate('');
    }
  };

  return (
    <form className="add-todo" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="add-input"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="add-date-input"
        aria-label="Due date"
      />
      {/* PERSON6 INTEGRATION: Person 4 changes in AddTodo may need to merge around this optional due-date field. */}
      <button type="submit" className="add-btn" disabled={!title.trim()}>
        Add
      </button>
    </form>
  );
}

export default AddTodo;
