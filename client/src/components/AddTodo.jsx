import React, { useState } from 'react';
import { toDueDateIso } from '../utils/todoDates';

const MAX_TITLE_LENGTH = 100;
const MAX_TAG_LENGTH = 30;
const MAX_TAGS_COUNT = 10;

function AddTodo({ onAdd }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState({});

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (!tag) return;
      if (tag.length > MAX_TAG_LENGTH) {
        setErrors((prev) => ({ ...prev, tagInput: `Tag must be ${MAX_TAG_LENGTH} characters or fewer` }));
        return;
      }
      if (tags.length >= MAX_TAGS_COUNT) {
        setErrors((prev) => ({ ...prev, tagInput: `Cannot add more than ${MAX_TAGS_COUNT} tags` }));
        return;
      }
      setTags([...tags, tag]);
      setTagInput('');
      setErrors((prev) => ({ ...prev, tagInput: null }));
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
    setErrors((prev) => ({ ...prev, tagInput: null }));
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    if (value.length > MAX_TITLE_LENGTH) {
      setErrors((prev) => ({ ...prev, title: `Title must be ${MAX_TITLE_LENGTH} characters or fewer` }));
    } else {
      setErrors((prev) => ({ ...prev, title: null }));
    }
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);
    if (value.length > MAX_TAG_LENGTH) {
      setErrors((prev) => ({ ...prev, tagInput: `Tag must be ${MAX_TAG_LENGTH} characters or fewer` }));
    } else {
      setErrors((prev) => ({ ...prev, tagInput: null }));
    }
  };

  const isValid = title.trim() && title.length <= MAX_TITLE_LENGTH && !errors.tagInput;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
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
    setPriority('medium');
    setErrors({});
  };

  return (
    <form className="add-todo" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="What needs to be done?"
        className={`add-input${errors.title ? ' input-error' : ''}`}
      />
      {errors.title && <span className="validation-error">{errors.title}</span>}
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="add-date-input"
        aria-label="Priority"
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="add-date-input"
        aria-label="Due date"
      />
      <input
        type="text"
        value={tagInput}
        onChange={handleTagInputChange}
        onKeyDown={handleTagKeyDown}
        placeholder="Add a tag and press Enter"
        className={`add-input${errors.tagInput ? ' input-error' : ''}`}
      />
      {errors.tagInput && <span className="validation-error">{errors.tagInput}</span>}
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
      <button type="submit" className="add-btn" disabled={!isValid}>
        Add
      </button>
    </form>
  );
}

export default AddTodo;
