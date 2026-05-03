## ADDED Requirements

### Requirement: Fastify Server
The server SHALL use Fastify as the HTTP framework with logging enabled.

#### Scenario: Server startup
- **WHEN** server starts
- **THEN** it listens on port 3001 and logs startup message

#### Scenario: Request logging
- **WHEN** any HTTP request is received
- **THEN** request details are logged

### Requirement: CORS Configuration
The server SHALL allow cross-origin requests from the client application.

#### Scenario: Client origin allowed
- **WHEN** request comes from http://localhost:5173
- **THEN** CORS headers are included in response

#### Scenario: Preflight requests
- **WHEN** browser sends OPTIONS preflight request
- **THEN** server responds with appropriate CORS headers

### Requirement: Development Mode
The server SHALL support hot-reload during development.

#### Scenario: File change detection
- **WHEN** developer modifies server code
- **THEN** server automatically restarts with `npm run dev`
