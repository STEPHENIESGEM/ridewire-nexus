# GitHub Copilot Instructions for RideWire AI Hub

## Legal Safety Requirements

**CRITICAL**: RideWire is a high-tech diagnostic company providing AI-powered guidance. We **CANNOT** and **DO NOT** replace licensed mechanics, CPAs, or other professionals.

### Legal Disclaimers - MANDATORY

All diagnostic features MUST include the following disclaimer:

```
⚠️ ADVISORY ONLY: This AI-powered diagnostic information is for educational and 
informational purposes only. RideWire AI Hub does NOT replace professional automotive 
technicians, mechanics, or licensed professionals. Always consult qualified professionals 
for automotive repairs and maintenance. We accept NO liability for repair outcomes.
```

### Required Disclaimer Placement

1. **Chat Component**: Display disclaimer modal on first access
2. **Diagnostic Results**: Include disclaimer in every AI response
3. **Footer**: Link to full Terms of Service and Privacy Policy
4. **Registration**: User must accept terms before creating account

## Security Requirements

### Client-Side Encryption
- Use AES-256-GCM encryption for sensitive data
- Never store encryption keys in database
- All message content must be encrypted before transmission

### Password Security
- Always use bcrypt with salt rounds >= 12
- Never store plaintext passwords
- Implement rate limiting on login attempts

### API Security
- All API keys must be stored in environment variables
- Never commit `.env` files to repository
- Use parameterized SQL queries to prevent injection

### Database Security
```javascript
// ✅ CORRECT - Parameterized query
pool.query('SELECT * FROM users WHERE id = $1', [userId])

// ❌ WRONG - SQL injection risk
pool.query(`SELECT * FROM users WHERE id = ${userId}`)
```

## Multi-AI Orchestration Patterns

### Consensus Building
```javascript
const orchestrator = new MultiAIOrchestrator();
const responses = await orchestrator.queryAllAgents(query);
const consensus = orchestrator.buildConsensus(responses);

// Always include confidence scores
if (consensus.confidence < 0.70) {
  // Low confidence - recommend professional consultation
  addDisclaimerWarning(response);
}
```

### Response Format
Every AI response must include:
- Diagnosis/recommendation
- Confidence score (0-100%)
- Disclaimer text
- Source attribution (which AIs agreed)

## Automotive Industry Compliance

### Safety Standards
- Never recommend actions that could void warranties
- Always suggest professional inspection for safety-critical systems
- Include cost estimates but mark them as approximate

### Data Handling
- Vehicle data is sensitive - treat with care
- Comply with automotive data privacy regulations
- Never share user vehicle data with third parties

## Code Style Guidelines

### JavaScript/Node.js
- Use async/await for asynchronous operations
- Add JSDoc comments for all functions
- Use camelCase for variables, PascalCase for classes

### React Components
- Use functional components with hooks
- Add PropTypes or TypeScript for type safety
- Keep components focused (single responsibility)

## Input Validation

Always validate user input:
```javascript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password requirements
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// Sanitize HTML to prevent XSS
const sanitizedInput = DOMPurify.sanitize(userInput);
```

## Common Pitfalls to Avoid

1. **SQL Injection**: Always use parameterized queries
2. **Plaintext Secrets**: Never hardcode API keys or passwords
3. **Missing Disclaimers**: Legal protection requires disclaimers everywhere
4. **Unencrypted Storage**: Encrypt sensitive data before database storage
5. **Weak Authentication**: Implement proper JWT token expiration

## Development Workflow

### Before Committing
- [ ] All API keys in environment variables
- [ ] Legal disclaimers present where required
- [ ] No console.log statements with sensitive data
- [ ] Database queries are parameterized
- [ ] Error handling implemented

### Testing Approach
- Manual testing preferred (no formal test suite currently)
- Test all user flows: Register → Login → Chat → Diagnostic
- Verify encryption/decryption works correctly
- Check database schema matches code expectations

## Architecture Context

### Database (PostgreSQL)
- Users table with encrypted credentials
- Messages table with client-side encrypted content
- Consensus_logs for AI response tracking

### Backend (Express)
- JWT authentication middleware
- Multi-AI orchestration service
- Encryption utilities

### Frontend (React)
- React Router for navigation
- Functional components with hooks
- Client-side encryption before API calls

## Contact Emails (Production)

- `coco@stepheniesgem.io` - Founder personal
- `hello@stepheniesgem.io` - General inquiries  
- `aihub@stepheniesgem.io` - AI Hub specific
- `support@stepheniesgem.io` - Customer support
- `investors@stepheniesgem.io` - Fundraising
- `press@stepheniesgem.io` - Media inquiries
- `team@stepheniesgem.io` - Internal communication
