# 🤝 Contributing to RideWire AI Hub

Thank you for your interest in contributing to RideWire AI Hub! We're building the future of AI-powered automotive diagnostics, and we welcome contributions from developers, designers, technical writers, and automotive professionals worldwide.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Community](#community)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behaviors include:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what's best for the community
- Showing empathy towards other community members

**Unacceptable behaviors include:**
- Harassment, trolling, or insulting/derogatory comments
- Public or private harassment
- Publishing others' private information without permission
- Any conduct that could reasonably be considered inappropriate

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at [conduct@ridewireai.com](mailto:conduct@ridewireai.com). All complaints will be reviewed and investigated promptly and fairly.

---

## 🎯 How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check the [existing issues](https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues) to avoid duplicates.

**When filing a bug report, include:**
- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected vs. actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node.js version, browser)
- **Error messages and stack traces**

**Use this template:**
```markdown
**Description:**
Brief description of the bug

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- OS: [e.g., macOS 13.0]
- Node.js: [e.g., v18.17.0]
- Browser: [e.g., Chrome 118]

**Additional Context:**
Any other relevant information
```

### Suggesting Enhancements

We welcome feature requests and enhancement ideas!

**When suggesting an enhancement:**
- **Use a clear, descriptive title**
- **Provide a detailed description** of the proposed feature
- **Explain the use case** and why it would be valuable
- **Include mockups or examples** if applicable
- **Consider implementation complexity** and potential impact

### Contributing Code

We accept contributions in the following areas:

- 🐛 **Bug Fixes** - Resolve reported issues
- ✨ **New Features** - Add new functionality
- 📝 **Documentation** - Improve guides, API docs, or comments
- 🎨 **UI/UX** - Enhance user interface and experience
- 🧪 **Tests** - Increase test coverage
- 🔧 **Refactoring** - Improve code quality and performance
- 🌍 **Internationalization** - Add language support

### Contributing Documentation

Documentation improvements are always welcome! This includes:

- API documentation
- User guides and tutorials
- Architecture diagrams
- Code comments
- README improvements
- Setup and deployment guides

---

## 🚀 Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/ridewire-ai-hub.git
cd ridewire-ai-hub
```

### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/STEPHENIESGEM/ridewire-ai-hub.git
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your API keys (see SETUP.md for details)
```

### 6. Initialize Database

```bash
npm run db:init
```

### 7. Start Development Server

```bash
npm run dev
```

---

## 🔄 Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications

### 2. Make Your Changes

- Write clean, readable code
- Follow our coding standards (see below)
- Add tests for new functionality
- Update documentation as needed
- Keep commits focused and atomic

### 3. Test Your Changes

```bash
# Run tests
npm test

# Run linter
npm run lint

# Test locally
npm run dev
```

### 4. Commit Your Changes

Write clear, meaningful commit messages:

```bash
git add .
git commit -m "feat: add multi-AI confidence scoring"
```

**Commit message format:**
```
<type>: <subject>

<optional body>

<optional footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or modifications
- `chore`: Build process or auxiliary tool changes

**Examples:**
```
feat: implement AR overlay integration
fix: resolve JWT token expiration issue
docs: update API endpoint documentation
refactor: optimize multi-AI consensus algorithm
```

### 5. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

---

## 💻 Coding Standards

### JavaScript/Node.js

**General Principles:**
- Use `const` and `let` instead of `var`
- Use async/await for asynchronous operations
- Use template literals for string interpolation
- Follow ES6+ conventions
- Use descriptive variable and function names

**Example:**
```javascript
// Good
const fetchDiagnosticData = async (userId) => {
  try {
    const data = await db.query('SELECT * FROM diagnostics WHERE user_id = $1', [userId]);
    return data.rows;
  } catch (error) {
    console.error(`Error fetching diagnostics for user ${userId}:`, error);
    throw error;
  }
};

// Bad
var getData = function(id, callback) {
  db.query('SELECT * FROM diagnostics WHERE user_id = ' + id, function(err, data) {
    if (err) callback(err);
    else callback(null, data);
  });
};
```

### React/Frontend

- Use functional components with hooks (not class components)
- Keep components focused and single-purpose
- Use prop-types or TypeScript for type checking
- Follow accessibility best practices (WCAG 2.1)

**Example:**
```javascript
// Good
const DiagnosticCard = ({ diagnostic, onView }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="diagnostic-card" role="article">
      <h3>{diagnostic.title}</h3>
      <button onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
      {isExpanded && <DiagnosticDetails data={diagnostic} />}
    </div>
  );
};
```

### Database Operations

- **Always use parameterized queries** to prevent SQL injection
- Handle errors gracefully
- Use transactions for multi-step operations

**Example:**
```javascript
// Good - Parameterized query
const user = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// Bad - SQL injection vulnerability
const user = await pool.query(
  `SELECT * FROM users WHERE email = '${email}'`
);
```

### Security Best Practices

- Never commit API keys or secrets
- Validate and sanitize all user inputs
- Use bcrypt for password hashing (12+ rounds)
- Implement rate limiting on API endpoints
- Encrypt sensitive data before storage

### Documentation

- Add JSDoc comments to functions
- Document complex logic with inline comments
- Update README.md for user-facing changes
- Keep API documentation current

**Example:**
```javascript
/**
 * Orchestrates multiple AI agents to reach consensus on a diagnostic query
 * @param {string} query - The diagnostic question from the user
 * @param {string} userId - The ID of the requesting user
 * @returns {Promise<Object>} Consensus result with AI responses
 * @throws {Error} If all AI agents fail or consensus cannot be reached
 */
async function queryMultiAI(query, userId) {
  // Implementation...
}
```

---

## 📬 Pull Request Process

### 1. Ensure Your PR Is Ready

Before submitting, verify:

- ✅ Code follows our coding standards
- ✅ All tests pass (`npm test`)
- ✅ Linter passes (`npm run lint`)
- ✅ Documentation is updated
- ✅ Commits are well-structured
- ✅ No merge conflicts with main branch

### 2. Create the Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Select your feature branch
- Fill out the PR template completely

### 3. PR Title and Description

**Title format:**
```
[Type] Brief description
```

**Example titles:**
```
[Feature] Add multi-AI confidence scoring
[Fix] Resolve JWT expiration bug
[Docs] Update API endpoint documentation
```

**Description should include:**
- Summary of changes
- Motivation and context
- Related issues (use "Fixes #123" or "Closes #456")
- Screenshots (for UI changes)
- Testing performed
- Checklist confirmation

**PR Template:**
```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (please describe)

## Related Issues
Fixes #(issue number)

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing Performed
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] All existing tests pass

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows project coding standards
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added for new features
- [ ] All tests pass locally
```

### 4. Review Process

- A maintainer will review your PR within 48-72 hours
- Address any requested changes promptly
- Keep discussion professional and constructive
- Be patient—quality reviews take time

### 5. After Approval

Once approved, a maintainer will merge your PR. Thank you for contributing! 🎉

---

## 🐛 Issue Guidelines

### Creating Issues

**Good issue titles:**
- ✅ "Bug: JWT tokens expire prematurely"
- ✅ "Feature Request: Add support for Ford diagnostic codes"
- ✅ "Docs: Missing setup instructions for Windows"

**Bad issue titles:**
- ❌ "Broken"
- ❌ "Help!"
- ❌ "Question"

### Issue Labels

We use labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested
- `wontfix` - This will not be worked on
- `duplicate` - Duplicate of another issue

---

## 👥 Community

### Communication Channels

- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/STEPHENIESGEM/ridewire-ai-hub/discussions)
- **GitHub Issues**: [Report bugs and request features](https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues)
- **Email**: [support@ridewireai.com](mailto:support@ridewireai.com)

### Recognition

Contributors are recognized in several ways:

- Name added to CONTRIBUTORS.md
- Mentioned in release notes
- Social media shoutouts for significant contributions
- Swag for major contributors (coming soon!)

---

## 🙏 Thank You

Every contribution, no matter how small, makes RideWire AI Hub better. Whether you're fixing a typo, adding a feature, or helping others in discussions, you're helping build the future of automotive diagnostics.

**Questions?** Don't hesitate to reach out to [support@ridewireai.com](mailto:support@ridewireai.com)

---

© 2026 RideWire AI Hub. All rights reserved.
