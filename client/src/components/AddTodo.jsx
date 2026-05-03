import React, { useState } from 'react';
import { toDueDateIso } from '../utils/todoDates';

function AddTodo({ onAdd }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
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
      <button type="submit" className="add-btn" disabled={!title.trim()}>
        Add
      </button>
    </form>
  );
}

export default AddTodo;
