# GitHub Copilot Instructions for RideWire AI Hub

## Project Overview

RideWire AI Hub is a production-ready multi-AI orchestration platform for enterprise auto diagnostics. It coordinates multiple AI agents (ChatGPT, Claude, Gemini) to collaborate and reach consensus on user queries, with a foundation for AR auto diagnostic tools.

## Tech Stack

- **Frontend**: React.js with JSX, React Router, CSS3
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with parameterized queries
- **AI Integration**: OpenAI (ChatGPT), Anthropic (Claude), Google (Gemini)
- **Security**: Client-side encryption (sodium-native), bcrypt password hashing, JWT authentication
- **Package Manager**: npm

## Architecture Patterns

### Multi-AI Orchestration
- All AI agent interactions go through `multiAIOrchestrator.js`
- Each agent (ChatGPT, Claude, Gemini) has separate query methods
- Consensus mechanism resolves conflicts between AI responses
- All decisions are logged with timestamps and confidence scores

### Security-First Design
- **Client-side Encryption**: Use `encryption.js` module for all message encryption before storage
- **Password Security**: Always use bcrypt with 10+ rounds for password hashing
- **JWT Tokens**: Include expiration times (e.g., 24 hours) in all JWT tokens
- **Database Security**: Use parameterized queries exclusively (never string interpolation)
- **Environment Variables**: Store all secrets in `.env` (never commit sensitive data)

### Database Conventions
- Use PostgreSQL `Pool` from `pg` package for all database connections
- Always use parameterized queries: `pool.query('SELECT * FROM users WHERE id = $1', [userId])`
- Include proper indexes on frequently queried fields (user_id, timestamp, session_id)
- Use CASCADE for foreign key relationships where appropriate

## Code Style & Conventions

### JavaScript/Node.js
- Use `require()` for module imports in backend files
- Use ES6+ features: async/await, arrow functions, destructuring
- Always include JSDoc comments for functions with `@param` and `@returns` tags
- Handle errors with try-catch blocks and meaningful error messages
- Use `const` by default, `let` only when reassignment is needed

### React/Frontend
- Use functional components with hooks (useState, useEffect)
- Import React components with ES6 imports
- Use JSX for component templates
- Store authentication tokens in localStorage
- Handle loading states and error states in UI components

### Error Handling
- Return appropriate HTTP status codes: 400 (bad request), 401 (unauthorized), 500 (server error)
- Include descriptive error messages in JSON responses: `{ error: 'Description' }`
- Log errors with context: `console.error('Context:', err)`
- Never expose sensitive error details to clients

### Naming Conventions
- Use camelCase for JavaScript variables and functions: `queryAllAgents`, `sessionId`
- Use PascalCase for classes: `MultiAIOrchestrator`, `EncryptionModule`
- Use UPPER_SNAKE_CASE for environment variables: `JWT_SECRET`, `DATABASE_URL`
- Use snake_case for database columns: `password_hash`, `created_at`, `user_id`

## Development Workflow

### Setup
1. Copy `.env.example` to `.env` and configure environment variables
2. Install dependencies: `npm install`
3. Initialize database schema: Run `schema.sql` against PostgreSQL
4. Start server: `npm start` (runs on port 3000 by default)

### Testing
- No testing framework is currently configured
- Manual testing is done via server endpoints and frontend UI
- When adding tests in the future:
  - Use Jest or Mocha for unit and integration tests
  - Test authentication flows (registration, login, JWT validation)
  - Test AI orchestration logic and consensus mechanisms
  - Test encryption/decryption functions
  - Test database queries and error handling
  - Test API endpoints with various input scenarios
  - Mock external AI API calls to avoid rate limits

### Building
- No build step for backend (Node.js runs directly)
- Frontend may need a build step if using a bundler (check frontend configuration)

## API Patterns

### Authentication Endpoints
- `POST /register` - User registration (email, password)
- `POST /login` - User authentication (returns JWT token)
- Use JWT middleware to protect authenticated routes

### Message Encryption Flow
1. Generate session key from master key and session ID
2. Encrypt message plaintext with session key
3. Store ciphertext, nonce, salt, and hash in database
4. Decrypt on retrieval using same session key

### AI Query Flow
1. Receive user query via authenticated API endpoint
2. Pass query to `MultiAIOrchestrator.queryAllAgents()`
3. Collect responses from all available AI agents
4. Run consensus mechanism to resolve conflicts
5. Log decision with timestamp and confidence scores
6. Return consensus result and individual agent responses

## Security Requirements

### Critical Security Practices
- **Never log or expose API keys** (OpenAI, Anthropic, Google)
- **Never commit secrets** to version control (use .env.example instead)
- **Always validate user input** before processing or database insertion:
  - Check for required fields (email, password, query text)
  - Validate email format with regex or validation library
  - Enforce password minimum length and complexity
  - Sanitize input to prevent XSS attacks
  - Check data types match expected values
  - Limit input lengths to prevent buffer overflows
- **Use parameterized queries** to prevent SQL injection
- **Hash passwords** with bcrypt before storing in database
- **Verify JWT tokens** on all protected endpoints
- **Encrypt sensitive data** before storing in database

### Encryption Standards
- Use `sodium-native` for cryptographic operations
- Generate unique nonces for each encryption operation
- Always verify message integrity with hashes before decryption
- Store encryption keys securely (never in database or logs)

## File Structure

```
ridewire-ai-hub/
├── .env.example          # Environment variable template
├── server.js             # Express server & authentication
├── multiAIOrchestrator.js # Multi-AI agent coordination
├── encryption.js         # Client-side encryption module
├── schema.sql           # PostgreSQL database schema
├── package.json         # Dependencies & scripts
├── frontend/            # React frontend application
│   ├── App.jsx
│   ├── components/      # Reusable React components
│   ├── styles/          # CSS stylesheets
│   └── public/          # Static assets
├── docs/                # Documentation files
└── schemas/             # Additional schema definitions
```

## Best Practices for AI Agent Code Changes

### When Adding New Features
1. Follow existing patterns in similar files
2. Maintain consistent error handling and logging
3. Add appropriate authentication/authorization checks
4. Update database schema if needed (with indexes)
5. Document new environment variables in `.env.example`
6. Add JSDoc comments for new functions
7. Ensure security best practices are followed

### When Fixing Bugs
1. Identify root cause before making changes
2. Test the fix with various edge cases
3. Ensure fix doesn't introduce security vulnerabilities
4. Maintain backward compatibility where possible
5. Update relevant documentation if behavior changes

### When Refactoring
1. Preserve existing functionality and APIs
2. Improve code readability and maintainability
3. Don't combine refactoring with new features
4. Keep changes minimal and focused
5. Ensure all security measures remain intact

## Common Pitfalls to Avoid

- ❌ Don't use string concatenation for SQL queries
- ❌ Don't store plaintext passwords or sensitive data
- ❌ Don't expose error stack traces to clients
- ❌ Don't commit `.env` files or API keys
- ❌ Don't make synchronous blocking calls in server code
- ❌ Don't trust user input without validation
- ❌ Don't skip encryption for sensitive data

## Dependencies & Versions

**Note**: Always check `package.json` for current versions as they may be updated over time.

Current major dependencies (as of last update):
- express: ^4.18.2 - Web framework for Node.js
- pg: ^8.11.0 - PostgreSQL client for Node.js
- jsonwebtoken: ^9.0.0 - JWT authentication
- bcrypt: ^5.1.0 - Password hashing
- dotenv: ^16.0.3 - Environment variable management
- sodium-native: ^4.0.0 - Cryptographic operations

When updating dependencies:
- Ensure compatibility with existing code and security requirements
- Check for breaking changes in release notes
- Test authentication, encryption, and database operations after updates
- Review security advisories for known vulnerabilities

## Additional Resources

- Database schema: See `schema.sql` for table definitions and indexes
- API documentation: See README.md for endpoint specifications
- Security architecture: See encryption.js for encryption implementation
- Strategic roadmap: See STRATEGY-EXECUTION-PLAN.md for project goals

## Questions or Clarifications?

If you're unsure about:
- Architecture decisions → Check existing implementations in similar files
- Security patterns → Refer to encryption.js and authentication in server.js
- Database queries → See schema.sql for table structure and relationships
- AI integration → Review multiAIOrchestrator.js for patterns
