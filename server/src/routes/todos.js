import { todoService } from '../services/todoService.js';

export default async function todosRoutes(fastify, options) {

  // GET /api/todos - Get all todos
  fastify.get('/', async (request, reply) => {
    return todoService.getAll();
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
    const { title } = request.body;
    if (!title || !title.trim()) {
      return reply.status(400).send({ error: 'Title is required' });
    }
    const todo = todoService.create({ title: title.trim() });
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
