import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const files = readdirSync(__dirname)
  .filter((file) => /^person\d+\.test\.mjs$/.test(file))
  .sort();

for (const file of files) {
  console.log(`RUN ${file}`);
  await import(pathToFileURL(join(__dirname, file)).href);
}

console.log('All person-role tests passed');
