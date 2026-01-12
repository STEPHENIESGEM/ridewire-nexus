# RideWire Writing Style Guide

## Purpose

This guide establishes consistent, professional, and effective communication standards for all RideWire content. Use this guide for all written materials including documentation, marketing copy, support responses, social media, and code comments.

---

## Brand Voice

### Core Attributes

**Professional yet Approachable**
- We're experts, but we don't talk down to people
- Technical accuracy without unnecessary jargon
- Helpful and supportive tone

**Clear and Concise**
- Get to the point quickly
- Use short sentences and paragraphs
- Break up long content with headers and bullets

**Innovative and Forward-Thinking**
- Emphasize cutting-edge AI technology
- Focus on the future of automotive diagnostics
- Celebrate progress and innovation

**Safety-Conscious**
- Always include appropriate disclaimers
- Emphasize professional consultation
- Never make absolute guarantees

---

## Writing Principles

### 1. Clarity First

**Do:**
- "The AI analyzes your vehicle's diagnostic codes."
- "You'll receive recommendations from three AI agents."

**Don't:**
- "Our sophisticated algorithmic framework leverages multiple LLM architectures to derive actionable insights."
- "Utilize our platform to operationalize diagnostic workflows."

### 2. Active Voice

**Do:**
- "RideWire analyzes diagnostic codes in real-time."
- "Our AI agents collaborate to find solutions."

**Don't:**
- "Diagnostic codes are analyzed in real-time by RideWire."
- "Solutions are found through AI agent collaboration."

### 3. Positive Framing

**Do:**
- "Upgrade to PRO to unlock unlimited queries."
- "Our AI helps you diagnose issues faster."

**Don't:**
- "Free tier limits you to only 10 queries."
- "Without our AI, diagnosis takes longer."

---

## Grammar and Mechanics

### Capitalization

**Product Names**
- RideWire AI Hub (full name)
- RideWire (short form)
- PRO TIER (all caps when referring to subscription)

**AI Agent Names**
- ChatGPT
- Claude
- Gemini
- Multi-AI (when referring to multiple agents)

**General Rules**
- Sentence case for headings (not Title Case unless it's a proper noun)
- Don't capitalize common nouns for emphasis

### Numbers

**Spell out**
- Numbers one through nine
- Numbers at the start of a sentence

**Use numerals**
- 10 and above
- Percentages: 70%, not seventy percent
- Currency: $50, not fifty dollars
- Technical specifications: 256-bit encryption

**Examples:**
- "Three AI agents analyze your query."
- "We support 24/7 customer service."
- "The platform processes over 1,000 queries per day."

### Punctuation

**Commas**
- Use Oxford comma: "ChatGPT, Claude, and Gemini"
- Use in lists of three or more items

**Em Dashes**
- Use for emphasis or interruption: "RideWire—the future of diagnostics—launches today."
- No spaces around em dashes

**Ellipses**
- Avoid in professional content
- Only use in informal quotes if needed

---

## Word Usage

### Preferred Terms

| Use This | Not This |
|----------|----------|
| diagnostic | diagnostics (unless plural) |
| sign in / log in | signin / login (noun forms: "sign-in" or "login") |
| email | e-mail |
| website | web site |
| AI agent | bot, chatbot |
| mechanic | technician (unless specifically certified) |
| vehicle | car (unless specifically an automobile) |

### Terms to Avoid

- **Jargon**: synergy, leverage, utilize, operationalize
- **Absolutes**: always, never, guaranteed (unless legally true)
- **Clichés**: game-changer, revolutionary, paradigm shift
- **Vague modifiers**: very, really, quite

### Technical Terms

**Always Explain on First Use**
- "OBD-II (On-Board Diagnostics)" on first mention
- "DTC (Diagnostic Trouble Code)" on first mention
- Then use abbreviation consistently

**Be Consistent**
- Once you choose AR (not augmented reality), stick with it throughout the document

---

## Content Types

### Documentation

**Structure:**
1. Brief overview (what is this?)
2. Why it matters (use case)
3. How to use it (step-by-step)
4. Troubleshooting (common issues)
5. Next steps (links to related content)

**Tone:** Instructional, helpful, clear

**Example:**
```markdown
## Setting Up Your Account

RideWire requires an account to save your diagnostic history and preferences.

### Create Your Account

1. Visit the registration page
2. Enter your email and create a password
3. Verify your email address
4. Log in to access your dashboard

If you encounter issues during registration, contact support@stepheniesgem.io.

Next: [Submit Your First Diagnostic Query →]
```

---

### Marketing Copy

**Structure:**
1. Hook (attention-grabbing opening)
2. Problem (what pain point are we solving?)
3. Solution (how RideWire helps)
4. Benefits (what you'll gain)
5. Call to action (what to do next)

**Tone:** Enthusiastic, clear, benefit-focused

**Example:**
```
Tired of guessing what's wrong with your vehicle?

RideWire AI Hub brings three powerful AI agents together to diagnose your automotive issues. Get consensus-based recommendations in seconds—not hours of trial and error.

✅ Faster diagnostics
✅ More accurate results
✅ Professional AI guidance

Start your free trial today →
```

---

### Support Responses

**Structure:**
1. Acknowledge the issue
2. Show empathy
3. Provide solution or next steps
4. Offer additional help

**Tone:** Friendly, helpful, professional

**Example:**
```
Hi [Name],

Thank you for reaching out about the login issue.

I understand how frustrating it can be when you can't access your account. Let's get this resolved quickly.

Please try these steps:
1. Clear your browser cache
2. Try logging in again
3. If that doesn't work, use the "Forgot Password" link

If you're still having trouble, reply to this email and I'll personally assist you.

Best regards,
[Name]
RideWire Support
```

---

### Code Comments

**Be Helpful, Not Obvious**

**Do:**
```javascript
// Check if user has accepted legal disclaimer before allowing diagnostics
if (!hasAcceptedDisclaimer) {
  return <LegalDisclaimer onAccept={handleAccept} />;
}
```

**Don't:**
```javascript
// Check if hasAcceptedDisclaimer is false
if (!hasAcceptedDisclaimer) {
  // Return LegalDisclaimer component
  return <LegalDisclaimer onAccept={handleAccept} />;
}
```

**Use Comments to Explain "Why," Not "What"**
- Good: `// Rate limit to prevent API abuse`
- Bad: `// Set rate limit to 100`

---

## Legal and Disclaimers

### When to Include Disclaimers

**Always include on:**
- Diagnostic result pages
- Repair recommendations
- Cost estimates
- Any AI-generated advice

### Standard Disclaimer Format

```
DISCLAIMER: [Statement of what this is not]. RideWire [what we don't replace]. 
Always consult [who to consult]. RideWire assumes no liability for [scope].
```

### Example Disclaimers

**Diagnostic:**
```
This AI-powered diagnostic tool provides informational guidance only. 
RideWire does NOT replace professional automotive mechanics. Always consult 
a qualified mechanic before performing repairs.
```

**Financial:**
```
Cost estimates are approximate and for informational purposes only. 
Actual costs may vary. RideWire is not a financial advisor.
```

---

## Formatting Standards

### Headers

Use markdown-style headers:
```markdown
# Page Title (H1) - One per page
## Main Section (H2)
### Subsection (H3)
#### Minor Heading (H4)
```

### Lists

**Numbered lists** for sequential steps:
```markdown
1. First step
2. Second step
3. Third step
```

**Bulleted lists** for non-sequential items:
```markdown
- Feature one
- Feature two
- Feature three
```

### Emphasis

- **Bold** for important terms or UI elements: "Click the **Submit** button"
- *Italic* for emphasis or titles: "See our guide, *Getting Started*"
- `Code formatting` for technical terms, code, or file names: "Edit the `config.js` file"

### Links

**Descriptive link text:**
- Do: "Read our [Privacy Policy](link)"
- Don't: "Click [here](link) for our Privacy Policy"

**Email links:**
- Format: `contact@stepheniesgem.io` or `[Contact Support](mailto:support@stepheniesgem.io)`

---

## Accessibility

### Alt Text for Images

**Be descriptive:**
- Do: "Dashboard showing three AI agent responses with consensus recommendation"
- Don't: "Dashboard screenshot"

### Avoid Ambiguous Terms

- Don't say "click here" or "above" or "below"
- Do say "select the Submit button" or "see the Authentication section"

### Use Semantic HTML

- Use proper heading hierarchy (H1 → H2 → H3)
- Use `<button>` for actions, `<a>` for navigation
- Provide labels for form fields

---

## Common Mistakes to Avoid

### 1. It's vs. Its

- **It's** = It is or It has
- **Its** = Possessive

Example: "It's important to check its diagnostic codes."

### 2. Their, They're, There

- **Their** = Possessive
- **They're** = They are
- **There** = Location or existence

Example: "They're checking their vehicle over there."

### 3. Your vs. You're

- **Your** = Possessive
- **You're** = You are

Example: "You're going to love your new diagnostic tool."

### 4. Affect vs. Effect

- **Affect** = Verb (to influence)
- **Effect** = Noun (the result)

Example: "The software update will affect performance. The effect should be noticeable."

### 5. Then vs. Than

- **Then** = Time sequence
- **Than** = Comparison

Example: "First analyze, then repair. This is better than guessing."

---

## Brand-Specific Guidelines

### RideWire Specific Terms

**Capitalize:**
- RideWire AI Hub (full product name)
- PRO TIER (subscription level)
- Multi-AI Orchestrator (technical component)

**Don't capitalize:**
- free tier (lowercase unless at start of sentence)
- consensus engine (generic term)
- diagnostic query (generic action)

### Talking About Competition

**Do:**
- Focus on our strengths
- Be factual and objective
- Acknowledge the broader ecosystem

**Don't:**
- Name competitors directly in negative contexts
- Make unverifiable claims
- Disparage other solutions

---

## Review Checklist

Before publishing any content, verify:

- [ ] Spelling and grammar checked
- [ ] Consistent terminology throughout
- [ ] Links tested and working
- [ ] Legal disclaimers included where needed
- [ ] Tone matches brand voice
- [ ] Headers and formatting correct
- [ ] Alt text added to images
- [ ] No jargon without explanation
- [ ] Clear call to action (if applicable)
- [ ] Reviewed by second person (for important content)

---

## Resources

### Tools

- **Grammar Check**: Grammarly, Hemingway Editor
- **Readability**: Aim for 8th grade reading level for general content
- **Plagiarism**: Always write original content

### Quick Reference

- **Email Contacts**: See EMAIL_TEMPLATES.md
- **Legal Disclaimers**: See .github/copilot-instructions.md
- **Brand Assets**: [To be added]

---

## Updates

This guide is a living document. Suggest updates by:
1. Opening an issue on GitHub
2. Emailing team@stepheniesgem.io
3. Submitting a pull request

---

**Last Updated:** January 5, 2026

**Maintained by:** RideWire Team (team@stepheniesgem.io)
