const API_BASE = 'http://localhost:3001/api';

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

async function fetchApi(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  todos: {
    getAll: () => fetchApi('/todos'),

    getById: (id) => fetchApi(`/todos/${id}`),

    create: ({ title, dueDate = null, priority = 'medium', tags = [] }) => fetchApi('/todos', {
      method: 'POST',
      body: JSON.stringify({ title, dueDate, priority, tags }),
    }),

    update: (id, updates) => fetchApi(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

    // PERSON6 INTEGRATION: Person 3's stats page should call this with optional from/to query params.
    getStats: ({ from, to } = {}) => fetchApi(`/todos/stats${buildQuery({ from, to })}`),

    delete: (id) => fetchApi(`/todos/${id}`, {
      method: 'DELETE',
    }),

    completeAll: () => fetchApi('/todos/complete-all', {
      method: 'PATCH',
    }),

    deleteDone: () => fetchApi('/todos/done', {
      method: 'DELETE',
    }),
  },
};
