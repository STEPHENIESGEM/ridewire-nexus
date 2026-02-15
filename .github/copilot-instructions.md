# GitHub Copilot Instructions for RideWire AI Hub

## 🚀 Quick Start for Copilot Agent

**Before making any changes:**
1. Read the issue carefully and understand requirements
2. Run `npm install` to install dependencies
3. Check `.env.example` for required environment variables
4. Review relevant code files before modifying
5. Run `npm test` to understand baseline test status
6. Make minimal, surgical changes to address the issue
7. Test changes locally before committing
8. Never commit secrets, API keys, or `.env` files

**Common Commands:**
- Install: `npm install`
- Test: `npm test`
- Start Backend: `npm start`
- Start Frontend Dev: `npm run dev`
- Build: `npm run build`
- Database Setup: `npm run db:init`

## Repository Overview

RideWire AI Hub is a **production-ready multi-AI orchestration platform** designed for enterprise auto diagnostics. This is a high-tech diagnostic platform company that provides AI-powered automotive analysis tools. The platform combines multiple AI agents (ChatGPT, Claude, Gemini) for consensus-based diagnostics with AR visualization capabilities.

## 🔧 Build, Test, and Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Start development server (backend on port 3000)
npm start

# Start frontend development server with hot reload
npm run dev

# Build frontend for production
npm run build

# Initialize database schema
npm run db:init

# Run tests
npm test

# Test external links
npm run test-links
```

### Development Workflow
1. Install dependencies: `npm install`
2. Set up environment variables: Copy `.env.example` to `.env` and configure
3. Initialize database: `npm run db:init` (requires PostgreSQL running)
4. Start backend: `npm start`
5. In another terminal, start frontend: `npm run dev`
6. Access the application at http://localhost:8080 (frontend) and http://localhost:3000 (backend API)

## 🚫 Repository Boundaries - DO NOT MODIFY

### Never Edit These Directories/Files
- **`.github/workflows/`** - CI/CD workflows (unless explicitly required by issue)
- **`node_modules/`** - Dependencies (managed by npm)
- **`dist/` or `build/`** - Build artifacts (generated automatically)
- **`.env`** - Environment secrets (never commit this file)
- **`package-lock.json`** - Lock file (only update via npm commands)

### Files Requiring Special Care
- **`schema.sql`** - Database schema (test thoroughly, migrations may be needed)
- **`server.js`** - Main server entry point (changes must not break existing routes)
- **`multiAIOrchestrator.js`** - Core AI orchestration logic (comprehensive testing required)
- **`encryption.js`** - Security-critical encryption module (security audit required)

### Never Commit
- API keys or secrets (use environment variables)
- `.env` files with real credentials
- Temporary files or test data
- Personal configuration files
- Large binary files or media assets without approval

## 🚨 CRITICAL LEGAL & COMPLIANCE REQUIREMENTS

### Legal Disclaimers - MUST BE INCLUDED

**IMPORTANT**: This platform provides diagnostic assistance tools ONLY. When implementing any user-facing features or documentation:

1. **Always include appropriate disclaimers** stating:
   - AI-generated diagnostics are for informational purposes only
   - Users should consult qualified mechanics and automotive professionals
   - RideWire does not replace professional automotive repair services
   - No liability for damages from following AI recommendations
   - Users are responsible for verifying all diagnostic information

2. **Professional Services Disclaimer**:
   - This platform does NOT replace certified mechanics, CPAs, or other licensed professionals
   - All AI-generated content is advisory and educational only
   - Users must verify critical automotive decisions with qualified professionals
   - Platform provides tools for analysis, not professional services

3. **Data Privacy & Security**:
   - All user data must be encrypted (AES-256)
   - API keys must never be committed to the repository
   - User authentication must use secure JWT tokens with expiration
   - Passwords must be hashed with bcrypt (12+ rounds, 12 in production recommended)
   - All diagnostic data is sensitive and must be treated accordingly

4. **Third-Party AI Services**:
   - Responses from OpenAI, Anthropic, and Google are subject to their terms of service
   - AI model outputs are not guaranteed to be accurate
   - Platform aggregates multiple AI opinions for improved reliability but cannot guarantee correctness

## Technology Stack

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.18+
- **Database**: PostgreSQL 12+ with indexed schemas
- **Authentication**: JWT tokens with bcrypt password hashing
- **Security**: AES-256 client-side encryption

### Frontend
- **Framework**: React.js
- **Styling**: CSS3 (custom styles in frontend/styles/)
- **Future**: AR.js integration for augmented reality overlays

### AI Integrations
- **OpenAI API**: ChatGPT for natural language understanding
- **Anthropic API**: Claude for deep reasoning and analysis
- **Google AI**: Gemini for additional perspective

### Key Dependencies
- `express`: Web server framework
- `pg`: PostgreSQL client
- `jsonwebtoken`: JWT token generation/validation
- `bcrypt`: Password hashing
- `dotenv`: Environment variable management
- `sodium-native`: Encryption utilities

## Coding Standards & Conventions

### General Principles
1. **Security First**: Always validate inputs, sanitize outputs, and encrypt sensitive data
2. **Minimal Dependencies**: Only add new dependencies if absolutely necessary
3. **Error Handling**: Always use try-catch blocks for async operations
4. **Logging**: Log errors with context but never log sensitive information (passwords, tokens, API keys)

### JavaScript/Node.js Style
- Use `async/await` for asynchronous operations (avoid callbacks)
- Use `const` and `let` instead of `var`
- Use template literals for string interpolation
- Follow existing code formatting (2-space indentation)
- Use descriptive variable names that reflect purpose
- Add JSDoc comments for functions, especially in API modules

### React/Frontend
- Use functional components with hooks (not class components)
- Keep components focused on single responsibilities
- Store sensitive operations on backend, not in frontend
- Never expose API keys or secrets in frontend code
- Use proper React state management

### Database Operations
- Always use parameterized queries (prevent SQL injection)
- Example: `pool.query('SELECT * FROM users WHERE email = $1', [email])`
- Never concatenate user input into SQL strings
- Use database transactions for multi-step operations
- Always handle database errors gracefully

### API Security
- All protected endpoints must verify JWT tokens
- Rate limit API calls to prevent abuse
- Validate all request parameters
- Return appropriate HTTP status codes:
  - 200: Success
  - 201: Created
  - 400: Bad Request (validation errors)
  - 401: Unauthorized (authentication failed)
  - 403: Forbidden (insufficient permissions)
  - 500: Internal Server Error

### Environment Variables
- Store all secrets in `.env` file (never commit this file)
- Use `.env.example` as a template
- Required variables:
  - `DATABASE_URL`: PostgreSQL connection string
  - `JWT_SECRET`: Secret for JWT signing
  - `OPENAI_API_KEY`: OpenAI API key
  - `ANTHROPIC_API_KEY`: Anthropic/Claude API key
  - `GOOGLE_API_KEY`: Google/Gemini API key
  - `PORT`: Server port (default 3000)
  - `NODE_ENV`: development/production

## Security Best Practices

### Encryption
- All user messages must be encrypted before storage
- Use `encryption.js` module for client-side encryption
- Never store unencrypted sensitive data
- Encryption keys should be derived securely

### Authentication
- Password minimum requirements: 8 characters
- Hash passwords with bcrypt (12+ rounds, 12 in production recommended)
- JWT tokens should expire (24 hours recommended)
- Implement session management with secure logout

### API Keys Protection
- Never log API keys
- Never commit API keys to version control
- Rotate API keys regularly
- Use separate keys for development and production
- Monitor API usage for anomalies

### Input Validation
- Validate all user inputs on both client and server
- Sanitize HTML/SQL to prevent injection attacks
- Limit request payload sizes
- Validate email formats, password strength
- Reject malformed JSON gracefully

## AI Integration Guidelines

### Multi-AI Orchestration
- Use `multiAIOrchestrator.js` for coordinating AI agents
- Always handle API failures gracefully (one AI failing shouldn't break the app)
- Implement timeouts for AI API calls (30 seconds recommended)
- Cache responses when appropriate to reduce API costs
- Log AI interactions for debugging (without sensitive user data)

### Consensus Mechanism
- Gather responses from all available AI agents
- Compare responses for consistency
- Weight responses by confidence scores
- Provide users with both consensus and individual agent opinions
- Handle conflicting responses transparently

### Error Handling for AI APIs
- Implement retry logic with exponential backoff
- Provide fallback responses if all AIs fail
- Display user-friendly error messages
- Never expose raw API error messages to users
- Monitor API quota and rate limits

## Testing & Quality Assurance

### Before Every Commit
1. Test all changed functionality locally
2. Verify no secrets or API keys are being committed
3. Check that error handling works as expected
4. Ensure all database queries use parameterization
5. Validate that legal disclaimers are present where required

### Code Review Checklist
- [ ] Security vulnerabilities addressed
- [ ] Legal disclaimers included in user-facing features
- [ ] Input validation implemented
- [ ] Error handling is comprehensive
- [ ] No sensitive data in logs or commits
- [ ] API keys are in environment variables only
- [ ] Database queries are parameterized
- [ ] Authentication/authorization works correctly

## Deployment Readiness

### Pre-Deployment Checklist
1. **Environment Configuration**
   - All production environment variables are set
   - Database connection string is correct for production
   - JWT_SECRET is a strong random string (not default)
   - All API keys are production keys (not test keys)

2. **Security Verification**
   - SSL/TLS certificates are valid
   - HTTPS is enforced
   - CORS is properly configured
   - Rate limiting is enabled
   - Security headers are set (helmet.js recommended)

3. **Database**
   - Migrations are applied
   - Indexes are created for performance
   - Backup strategy is in place
   - Connection pooling is configured

4. **Legal Compliance**
   - Disclaimer text is prominently displayed
   - Privacy policy is accessible
   - Terms of service are available
   - Cookie consent (if applicable)

5. **Monitoring & Logging**
   - Error logging is configured
   - Performance monitoring is enabled
   - API usage tracking is active
   - Alert system for critical errors

### Production Best Practices
- Use process manager (PM2) for Node.js
- Set NODE_ENV to "production"
- Enable compression middleware
- Implement proper CORS policies
- Use reverse proxy (nginx) if applicable
- Set up automated backups
- Monitor application health
- Have rollback plan ready

## File Structure Understanding

```
ridewire-ai-hub/
├── server.js                     # Main Express server & authentication
├── multiAIOrchestrator.js       # Multi-AI agent coordination
├── encryption.js                 # Client-side encryption utilities
├── schema.sql                    # PostgreSQL database schema
├── package.json                  # Dependencies and scripts
├── .env.example                  # Environment variable template
├── .gitignore                    # Exclude node_modules, .env, etc.
├── frontend/
│   ├── App.jsx                  # React root component
│   ├── components/              # React UI components
│   │   ├── Chat.jsx            # Chat interface
│   │   ├── Login.jsx           # Login form
│   │   ├── Register.jsx        # Registration form
│   │   ├── Pricing.jsx         # Pricing tiers
│   │   └── HeroSection.jsx     # Landing page hero
│   ├── styles/                  # CSS stylesheets
│   └── public/                  # Static assets
├── docs/                         # Documentation
└── schemas/                      # JSON schemas
```

## Common Tasks & Patterns

### Adding a New API Endpoint
```javascript
// Always include authentication middleware for protected routes
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Example protected endpoint
app.post('/api/query', authenticateToken, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query required' });
    
    // Process query...
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Query error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Calling Multiple AI Agents
```javascript
// Use the orchestrator for consistent multi-AI queries
const orchestrator = new MultiAIOrchestrator();
const results = await orchestrator.queryAllAgents(userQuery, sessionId);

// Always handle partial failures
if (Object.keys(results.errors).length > 0) {
  console.warn('Some AI agents failed:', results.errors);
}

// Process consensus
const consensus = orchestrator.calculateConsensus(results.responses);
```

### Database Queries
```javascript
// Always use parameterized queries
const result = await pool.query(
  'INSERT INTO messages (user_id, content, encrypted) VALUES ($1, $2, $3) RETURNING id',
  [userId, encryptedContent, true]
);

// Handle errors appropriately
try {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  if (rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
} catch (dbError) {
  console.error('Database error:', dbError.message);
  return res.status(500).json({ error: 'Database error occurred' });
}
```

## Important Reminders

1. **Legal Safety**: Always include disclaimers that this platform does NOT replace professional mechanics, CPAs, or other licensed professionals
2. **Security**: Treat all user data as sensitive and encrypt appropriately
3. **Quality**: Triple-check authentication, authorization, and data validation
4. **AI Reliability**: Never claim 100% accuracy - AI is advisory only
5. **Professional Services**: Make it clear this is a diagnostic tool, not professional service delivery
6. **Data Privacy**: User diagnostic history is private and confidential
7. **API Costs**: Be mindful of API usage costs when making multiple AI calls
8. **Error Messages**: User-friendly messages for users, detailed logs for debugging
9. **Performance**: Consider caching and rate limiting for production
10. **Compliance**: Ensure GDPR/privacy compliance for user data

## When to Ask for Help

If you encounter:
- Unclear security requirements
- Complex multi-AI coordination logic
- Database migration or schema changes
- Legal/compliance questions
- Performance optimization needs
- Third-party API integration issues

Refer to documentation or raise questions rather than making assumptions.

## Documentation Standards

When adding new features:
1. Update README.md if user-facing
2. Add JSDoc comments to functions
3. Update API documentation if endpoints change
4. Include legal disclaimers in user-facing docs
5. Document environment variables in .env.example
6. Add setup instructions if infrastructure changes

## Troubleshooting Common Issues

### Database Connection Errors
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Verify DATABASE_URL in .env
echo $DATABASE_URL

# Reinitialize schema if needed
npm run db:init
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process (replace PID with actual process ID)
kill -9 <PID>
```

### Frontend Build Failures
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear webpack cache
rm -rf .cache dist
npm run build
```

### AI API Integration Issues
- Verify API keys are set in `.env`
- Check API rate limits and quotas
- Review error logs for specific API error messages
- Ensure network connectivity to AI service endpoints
- Test with single AI agent first, then enable multi-AI

### Authentication/JWT Issues
- Verify JWT_SECRET is set in `.env`
- Check token expiration time (default 24 hours)
- Clear browser localStorage/cookies and re-login
- Verify bcrypt rounds configuration (12+ recommended)

## Code Quality and Linting

### Code Style Enforcement
```bash
# Format code (if prettier is configured)
npx prettier --write "**/*.{js,jsx,json}"

# Check for common issues
npx eslint . --ext .js,.jsx

# Type checking (if TypeScript is added)
npx tsc --noEmit
```

### Pre-Commit Checklist
- [ ] Run `npm test` and ensure all tests pass
- [ ] Check `git status` to verify only intended files are staged
- [ ] Verify no secrets or API keys in code
- [ ] Test the feature manually in browser/CLI
- [ ] Review code for security vulnerabilities
- [ ] Ensure legal disclaimers are present (if user-facing)
- [ ] Update relevant documentation

---

**Remember**: This is a high-tech diagnostic platform serving automotive professionals. Code quality, security, and legal compliance are non-negotiable for successful deployment. Always err on the side of caution with legal disclaimers and security measures.
