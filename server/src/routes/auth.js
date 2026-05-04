import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const USERS_FILE = join(__dirname, '../data/users.json');

async function loadUsers() {
  const data = await readFile(USERS_FILE, 'utf-8');
  return JSON.parse(data);
}

export default async function authRoutes(fastify) {
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body || {};

    const users = await loadUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return reply.code(401).send({ error: 'Invalid username or password' });
    }

    return { token: `token-${username}`, username };
  });
}
