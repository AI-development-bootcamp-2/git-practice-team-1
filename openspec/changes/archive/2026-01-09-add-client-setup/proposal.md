# Change: Add Client Setup

## Why
The Todo application needs a React frontend with Vite for fast development. An API service layer abstracts HTTP communication with the server.

## What Changes
- Configure Vite with React plugin
- Create client package.json with dependencies
- Set up main entry point and HTML template
- Create API service for todo operations

## Impact
- Affected specs: client-setup (new capability)
- Affected code: client/package.json, client/vite.config.js, client/index.html, client/src/main.jsx, client/src/services/api.js
