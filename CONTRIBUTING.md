# Contributing to RideWire AI Hub

Thank you for your interest in contributing to RideWire AI Hub! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Coding Standards](#coding-standards)
5. [Branch Naming Conventions](#branch-naming-conventions)
6. [Commit Message Format](#commit-message-format)
7. [Pull Request Process](#pull-request-process)
8. [Issue Reporting](#issue-reporting)
9. [Testing Requirements](#testing-requirements)
10. [Documentation Requirements](#documentation-requirements)
11. [Security Guidelines](#security-guidelines)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and professional in all interactions.

### Our Standards

**Positive behaviors include:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Accepting constructive criticism gracefully
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behaviors include:**
- Harassment, trolling, or insulting comments
- Personal or political attacks
- Publishing others' private information without permission
- Any conduct that would be inappropriate in a professional setting

### Enforcement

Instances of unacceptable behavior may be reported to: **conduct@stepheniesgem.io**

All complaints will be reviewed and investigated promptly and fairly.

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 16+ installed
- npm or yarn package manager
- PostgreSQL 12+ installed locally
- Git configured with your name and email
- A GitHub account
- Code editor (VS Code recommended)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ridewire-ai-hub.git
   cd ridewire-ai-hub
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/STEPHENIESGEM/ridewire-ai-hub.git
   ```

### Stay Updated

Regularly sync your fork with upstream:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Database
DATABASE_URL=postgres://username:password@localhost:5432/ridewire

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# AI Providers
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GOOGLE_API_KEY=your-google-key

# Server
PORT=3000
NODE_ENV=development
```

### 3. Initialize Database

```bash
npm run db:init
```

Or manually:

```bash
psql -U postgres -d ridewire -f schema.sql
```

### 4. Start Development Server

**Backend only:**
```bash
npm start
```

**Full stack (with webpack dev server):**
```bash
npm run dev
```

### 5. Verify Installation

Visit `http://localhost:3000` - you should see the RideWire landing page.

---

## Coding Standards

### JavaScript Style Guide

We follow a consistent code style throughout the project. Please adhere to these guidelines:

#### General Principles

1. **Use `const` and `let`**, never `var`
2. **Use `async/await`** for asynchronous operations (avoid callbacks)
3. **Use template literals** for string interpolation
4. **Use descriptive variable names** that reflect purpose
5. **2-space indentation** (no tabs)
6. **Semicolons required**
7. **Single quotes** for strings (except when avoiding escapes)

#### Examples

**✅ Good:**
```javascript
const userId = req.user.id;
const messages = await pool.query(
  'SELECT * FROM messages WHERE user_id = $1',
  [userId]
);

if (!messages.rows.length) {
  return res.status(404).json({ error: 'No messages found' });
}

const result = {
  userId,
  messages: messages.rows,
  count: messages.rows.length
};
```

**❌ Bad:**
```javascript
var user_id = req.user.id;
pool.query('SELECT * FROM messages WHERE user_id = $1', [user_id], function(err, messages) {
  if (err) throw err;
  if (messages.rows.length == 0) {
    res.status(404).json({error: "No messages found"})
  }
  var result = {userId: user_id, messages: messages.rows, count: messages.rows.length};
});
```

### React Component Standards

#### Functional Components with Hooks

Always use functional components with hooks (not class components):

**✅ Good:**
```javascript
import React, { useState, useEffect } from 'react';

function Chat({ userId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`);
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="chat-container">
      {messages.map(msg => (
        <MessageCard key={msg.id} message={msg} />
      ))}
    </div>
  );
}

export default Chat;
```

**❌ Bad:**
```javascript
import React from 'react';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], loading: true };
  }

  componentDidMount() {
    this.fetchMessages();
  }

  // ... class methods
}
```

### Database Query Standards

#### Always Use Parameterized Queries

**✅ Good (Prevents SQL Injection):**
```javascript
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
```

**❌ Bad (SQL Injection Vulnerability):**
```javascript
const result = await pool.query(
  `SELECT * FROM users WHERE email = '${email}'`
);
```

#### Handle Errors Properly

```javascript
try {
  const result = await pool.query(
    'INSERT INTO messages (user_id, content) VALUES ($1, $2) RETURNING id',
    [userId, content]
  );
  return result.rows[0].id;
} catch (error) {
  console.error('Database error:', error.message);
  throw new Error('Failed to store message');
}
```

### Security Standards

#### Password Hashing

Always use bcrypt with 12+ rounds:

```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

// Hashing
const hash = await bcrypt.hash(password, SALT_ROUNDS);

// Verification
const isValid = await bcrypt.compare(password, hash);
```

#### JWT Token Generation

```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { id: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

#### Input Validation

Always validate and sanitize user inputs:

```javascript
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

// Usage
if (!validateEmail(email)) {
  return res.status(400).json({ error: 'Invalid email format' });
}

if (!validatePassword(password)) {
  return res.status(400).json({ error: 'Password must be at least 8 characters' });
}
```

### API Response Standards

#### Consistent Error Format

```javascript
// Success (200, 201)
{
  "success": true,
  "data": { /* response data */ }
}

// Error (4xx, 5xx)
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": { /* optional details */ }
}
```

#### HTTP Status Codes

Use appropriate status codes:

- `200 OK`: Successful GET request
- `201 Created`: Successful POST (resource created)
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Comment Standards

#### JSDoc for Functions

```javascript
/**
 * Query all AI agents and calculate consensus
 * @param {string} query - User diagnostic query
 * @param {string} sessionId - Session identifier
 * @returns {Promise<Object>} Consensus result with agent responses
 * @throws {Error} If all AI agents fail
 */
async function queryAllAgents(query, sessionId) {
  // Implementation
}
```

#### Inline Comments

Only add comments when necessary to explain **why**, not **what**:

**✅ Good:**
```javascript
// Use longer timeout for AI queries since they can take 10-30 seconds
const TIMEOUT = 30000;
```

**❌ Bad:**
```javascript
// Set timeout to 30000
const TIMEOUT = 30000;
```

---

## Branch Naming Conventions

Use descriptive branch names that follow this pattern:

```
<type>/<short-description>
```

### Types

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### Examples

```bash
# Good branch names
feature/add-websocket-support
fix/authentication-token-expiry
docs/update-api-documentation
refactor/multi-ai-orchestrator
test/add-integration-tests
chore/update-dependencies

# Bad branch names
new-feature
bug-fix
update
my-changes
```

### Creating a Branch

```bash
git checkout -b feature/add-rate-limiting
```

---

## Commit Message Format

We follow the **Conventional Commits** specification for clear and structured commit messages.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `security`: Security fixes

### Examples

**Simple commit:**
```bash
git commit -m "feat(auth): add JWT token refresh endpoint"
```

**Detailed commit:**
```bash
git commit -m "fix(database): prevent SQL injection in message queries

- Replace string concatenation with parameterized queries
- Add input validation for user_id parameter
- Update error handling to be more specific

Fixes #42"
```

**Breaking change:**
```bash
git commit -m "feat(api): change authentication endpoint structure

BREAKING CHANGE: /api/auth/login now requires email field instead of username.
Update all clients to use email for login requests."
```

### Commit Message Rules

1. **Subject line**: Max 72 characters, present tense, no period
2. **Body**: Wrap at 72 characters, explain **what** and **why**
3. **Footer**: Reference issues (e.g., "Fixes #123", "Closes #456")
4. **Separate** subject, body, and footer with blank lines

---

## Pull Request Process

### Before Submitting

1. ✅ **Update your branch** with latest upstream changes
2. ✅ **Run tests** and ensure they pass
3. ✅ **Run linter** (if available)
4. ✅ **Test manually** in development environment
5. ✅ **Update documentation** if needed
6. ✅ **Write descriptive commit messages**

### Creating a Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub from your fork to upstream `main`

3. **Fill out the PR template** (if available) with:
   - Description of changes
   - Related issue numbers
   - Testing performed
   - Screenshots (for UI changes)
   - Breaking changes (if any)

### PR Title Format

Use the same format as commit messages:

```
feat(auth): add password reset functionality
fix(api): resolve race condition in multi-AI queries
docs(readme): update installation instructions
```

### PR Description Template

```markdown
## Description
Brief description of changes made.

## Related Issues
Closes #123
Relates to #456

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing Performed
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed my own code
- [ ] Commented complex code sections
- [ ] Updated documentation
- [ ] No new warnings generated
- [ ] Added tests that prove my fix/feature works
- [ ] All tests pass locally
```

### Code Review Process

1. **Automated checks** must pass (CI/CD, if configured)
2. **At least one maintainer approval** required
3. **Address review comments** promptly
4. **Request re-review** after making changes
5. **Squash commits** if requested by maintainers

### Merging

- **Maintainers will merge** your PR when approved
- **Delete your branch** after merge
- **Sync your fork** with upstream

---

## Issue Reporting

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check documentation** for common questions
3. **Test on latest version** to ensure issue still exists
4. **Gather information** (error messages, logs, screenshots)

### Issue Types

#### Bug Report

Use this template:

```markdown
## Bug Description
A clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g., Ubuntu 20.04]
- Node.js version: [e.g., 18.0.0]
- Browser: [e.g., Chrome 120]
- RideWire version: [e.g., 1.1.0]

## Error Logs
```
Paste error logs here
```

## Screenshots
If applicable, add screenshots.

## Additional Context
Any other relevant information.
```

#### Feature Request

```markdown
## Feature Description
A clear description of the feature you'd like.

## Problem it Solves
Explain the problem this feature would solve.

## Proposed Solution
Describe how you envision this feature working.

## Alternatives Considered
Other solutions you've considered.

## Additional Context
Any other relevant information.
```

#### Question / Support

```markdown
## Question
Clear description of your question.

## What I've Tried
Steps you've already taken to find an answer.

## Context
Why you need this information.
```

---

## Testing Requirements

### Test Structure

We use a simple test structure (formal testing framework may be added later):

```javascript
// test/multiAIOrchestrator.test.js
const MultiAIOrchestrator = require('../multiAIOrchestrator');

async function testQueryAllAgents() {
  const orchestrator = new MultiAIOrchestrator();
  const result = await orchestrator.queryAllAgents('test query', 'session-123');
  
  console.assert(result.sessionId === 'session-123', 'Session ID mismatch');
  console.assert(result.responses.ChatGPT, 'ChatGPT response missing');
  console.assert(result.consensus, 'Consensus missing');
  
  console.log('✓ testQueryAllAgents passed');
}

testQueryAllAgents().catch(console.error);
```

### Manual Testing Checklist

Before submitting a PR, manually test:

- [ ] User registration and login
- [ ] JWT authentication on protected routes
- [ ] Query submission to multi-AI hub
- [ ] Message encryption/decryption
- [ ] Error handling (invalid inputs, network errors)
- [ ] UI responsiveness (desktop, tablet, mobile)
- [ ] Browser compatibility (Chrome, Firefox, Safari)

### Running Tests

```bash
npm test
```

---

## Documentation Requirements

### When to Update Documentation

Update documentation when:

- Adding new API endpoints
- Changing existing API behavior
- Adding new features
- Modifying setup/installation process
- Changing environment variables
- Fixing bugs that affect usage

### Documentation Files

- **README.md**: Project overview, quick start, features
- **API_DOCUMENTATION.md**: Complete API reference
- **ARCHITECTURE.md**: System design and architecture
- **DEPLOYMENT_GUIDE.md**: Deployment instructions
- **CONTRIBUTING.md**: This file

### Code Documentation

Add JSDoc comments for:

- All exported functions
- Complex algorithms
- Non-obvious code sections

```javascript
/**
 * Calculate consensus from multiple AI agent responses
 * @param {Object[]} responses - Array of agent responses
 * @param {string} responses[].agent - Agent name (ChatGPT, Claude, Gemini)
 * @param {string} responses[].response - Agent response text
 * @param {number} responses[].confidence - Confidence score (0-1)
 * @returns {Object} Consensus result with recommendation and confidence
 */
function calculateConsensus(responses) {
  // Implementation
}
```

---

## Security Guidelines

### Reporting Security Vulnerabilities

**DO NOT open public issues for security vulnerabilities.**

Instead, email: **security@stepheniesgem.io**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Security Best Practices

1. **Never commit secrets**
   - API keys
   - Database credentials
   - JWT secrets
   - Private keys

2. **Use environment variables**
   - Store secrets in `.env` (never commit `.env`)
   - Use `.env.example` as template

3. **Validate all inputs**
   - Check data types
   - Sanitize user inputs
   - Use parameterized queries

4. **Implement rate limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // 100 requests per window
   });
   
   app.use('/api/', limiter);
   ```

5. **Use HTTPS in production**
   - Force HTTPS redirects
   - Set secure cookie flags
   - Enable HSTS headers

6. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

---

## Development Workflow Summary

### Standard Workflow

```bash
# 1. Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Make changes
# ... edit files ...

# 4. Test changes
npm test
npm start  # manual testing

# 5. Commit changes
git add .
git commit -m "feat(api): add new endpoint for user stats"

# 6. Push to your fork
git push origin feature/my-feature

# 7. Open Pull Request on GitHub

# 8. Address review comments
# ... make changes ...
git add .
git commit -m "fix: address review comments"
git push origin feature/my-feature

# 9. After merge, cleanup
git checkout main
git pull upstream main
git branch -d feature/my-feature
```

---

## Getting Help

### Resources

- **Documentation**: See [README.md](README.md), [API_DOCUMENTATION.md](API_DOCUMENTATION.md), [ARCHITECTURE.md](ARCHITECTURE.md)
- **GitHub Issues**: [https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues](https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues)
- **GitHub Discussions**: [https://github.com/STEPHENIESGEM/ridewire-ai-hub/discussions](https://github.com/STEPHENIESGEM/ridewire-ai-hub/discussions)

### Contact

- **Technical Support**: support@stepheniesgem.io
- **General Inquiries**: hello@stepheniesgem.io
- **Security Issues**: security@stepheniesgem.io
- **Code of Conduct**: conduct@stepheniesgem.io

---

## Recognition

Contributors will be recognized in:

- **CONTRIBUTORS.md** file (alphabetical order)
- **GitHub Contributors** page
- **Release notes** for significant contributions

---

## License

By contributing to RideWire AI Hub, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to RideWire AI Hub! Your efforts help make automotive diagnostics more accessible and reliable through AI collaboration.** 🚗🤖✨

---

**Document Version**: 1.0.0  
**Last Updated**: February 12, 2026  
**Maintained By**: Stephenie's Gem (STEPHENIESGEM)
