# Change: Add Server Core

## Why
The Todo API needs a Fastify server with CORS support to handle requests from the React client running on a different port.

## What Changes
- Create Fastify server with logging enabled
- Configure CORS for client origin (localhost:5173)
- Set up server to listen on port 3001
- Create server package.json with dependencies

## Impact
- Affected specs: server-core (new capability)
- Affected code: server/src/server.js, server/package.json
