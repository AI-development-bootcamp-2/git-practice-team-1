const express = require('express');
const router = express.Router();
const todoService = require('../services/todoService');

// Valid statuses for validation
const VALID_STATUSES = ['todo', 'in-progress', 'review', 'done'];

// GET /api/statuses
router.get('/statuses', (req, res) => {
  res.json(VALID_STATUSES);
});

// GET /api/todos/stats
// IMPORTANT: Registered before /:id to avoid treating "stats" as an id
router.get('/stats', (req, res) => {
  const stats = todoService.getStats();
  res.json(stats);
});

// GET /api/todos
router.get('/', (req, res) => {
  res.json(todoService.readTodos());
});

// PUT /api/todos/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Person 3: Validate status
  if (updates.status && !VALID_STATUSES.includes(updates.status)) {
    return res.status(400).json({ 
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` 
    });
  }

  const updatedTodo = todoService.update(id, updates);
  if (!updatedTodo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(updatedTodo);
});

module.exports = router;
