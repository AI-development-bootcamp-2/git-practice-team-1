import { todoService } from '../services/todoService.js';

export default async function todosRoutes(fastify, options) {

  // PERSON6 INTEGRATION: Person 3's StatsPage date filters are wired through from/to query params here.
  // GET /api/todos/stats - Get todo stats with optional date filtering
  fastify.get('/stats', async (request, reply) => {
    const { from, to } = request.query ?? {};
    return todoService.getStats({ from, to });
  });

  // GET /api/todos - Get all todos
  fastify.get('/', async (request, reply) => {
    return todoService.getAll();
  });


  // GET /api/todos/stats - Get todo statistics
  fastify.get('/stats', async (request, reply) => {
    return todoService.getStats();

  // PATCH /api/todos/complete-all - Mark all todos as done
  fastify.patch('/complete-all', async (request, reply) => {
    return todoService.completeAll();
  });

  // DELETE /api/todos/done - Delete all completed todos
  fastify.delete('/done', async (request, reply) => {
    return todoService.deleteDone();

  });

  // GET /api/todos/:id - Get single todo
  fastify.get('/:id', async (request, reply) => {
    const todo = todoService.getById(request.params.id);
    if (!todo) {
      return reply.status(404).send({ error: 'Todo not found' });
    }
    return todo;
  });

  // POST /api/todos - Create new todo
  fastify.post('/', async (request, reply) => {
    const { title, dueDate = null, priority = 'medium', tags = [] } = request.body;
    if (!title || !title.trim()) {
      return reply.status(400).send({ error: 'Title is required' });
    }
    const todo = todoService.create({ title: title.trim(), dueDate, priority, tags });
    return reply.status(201).send(todo);
  });

  // PUT /api/todos/:id - Update todo
  fastify.put('/:id', async (request, reply) => {
    const todo = todoService.update(request.params.id, request.body);
    if (!todo) {
      return reply.status(404).send({ error: 'Todo not found' });
    }
    return todo;
  });

  // DELETE /api/todos/:id - Delete todo
  fastify.delete('/:id', async (request, reply) => {
    const deleted = todoService.delete(request.params.id);
    if (!deleted) {
      return reply.status(404).send({ error: 'Todo not found' });
    }
    return { success: true };
  });
}
