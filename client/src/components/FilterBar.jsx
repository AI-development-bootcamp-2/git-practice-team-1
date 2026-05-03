import React from 'react';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'todo', label: 'To Do' },
  { value: 'done', label: 'Done' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' }
];

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

function FilterBar({ filters, onFiltersChange }) {
  const updateFilter = (name, value) => {
    onFiltersChange({
      ...filters,
      [name]: value
    });
  };

  return (
    <div className="filter-bar">
      <input
        type="search"
        className="filter-search"
        value={filters.search}
        onChange={(e) => updateFilter('search', e.target.value)}
        placeholder="Search todos"
        aria-label="Search todos by title"
      />

      <select
        className="filter-select"
        value={filters.status}
        onChange={(e) => updateFilter('status', e.target.value)}
        aria-label="Filter by status"
      >
        {STATUS_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        className="filter-select"
        value={filters.priority}
        onChange={(e) => updateFilter('priority', e.target.value)}
        aria-label="Filter by priority"
      >
        {PRIORITY_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label className="filter-checkbox">
        <input
          type="checkbox"
          checked={filters.overdueOnly}
          onChange={(e) => updateFilter('overdueOnly', e.target.checked)}
        />
        Show overdue only
      </label>
    </div>
  );
}

export default FilterBar;
