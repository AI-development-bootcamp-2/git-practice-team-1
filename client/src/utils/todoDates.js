function toDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

export function toDueDateIso(dateValue) {
  return dateValue ? new Date(`${dateValue}T00:00:00.000Z`).toISOString() : null;
}

export function formatDueDate(dueDate) {
  if (!dueDate) {
    return null;
  }

  return new Date(dueDate).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function isTodoOverdue(todo, now = new Date()) {
  if (!todo?.dueDate || todo.status === 'done') {
    return false;
  }

  const dueDateKey = toDateKey(todo.dueDate);
  const todayKey = toDateKey(now);

  if (!dueDateKey || !todayKey) {
    return false;
  }

  return dueDateKey < todayKey;
}
