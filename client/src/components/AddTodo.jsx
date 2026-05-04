import React, { useState } from 'react';
import { toDueDateIso } from '../utils/todoDates';

function AddTodo({ onAdd }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag) {
        setTags([...tags, tag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({
        title: title.trim(),
        dueDate: toDueDateIso(dueDate),
        priority,
        tags,
      });
      setTitle('');
      setDueDate('');
      setTags([]);
      setTagInput('');
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
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="priority-select"
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
      <input
        type="text"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleTagKeyDown}
        placeholder="Add a tag and press Enter"
        className="add-input"
      />
      {tags.length > 0 && (
        <div className="tag-chips">
          {tags.map((tag, i) => (
            <span key={i} className="tag-chip">
              {tag}
              <button
                type="button"
                className="tag-chip-remove"
                onClick={() => removeTag(i)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <button type="submit" className="add-btn" disabled={!title.trim()}>
        Add
      </button>
    </form>
  );
}

export default AddTodo;
