# SAFETY GATING & AI CONSENSUS SPECIFICATIONS
## RideWire AI Hub - Multi-Agent Safety Framework

**Version:** 1.0  
**Status:** PRODUCTION READY  
**Owner:** AI Safety Team + MANUS (The Architect)  
**Date:** December 20, 2025

---

## I. EXECUTIVE SUMMARY

This document defines the safety gating and consensus pass/fail criteria for RideWire AI Hub's multi-agent diagnostic system. The framework ensures that AI recommendations are accurate, safe, and legally defensible while minimizing false positives and human intervention overhead.

**Key Principles:**
1. **Safety First**: Never recommend unsafe practices or liability-inducing actions
2. **Consensus-Driven**: Require agreement from multiple AI agents (2/3 minimum)
3. **Confidence-Weighted**: Higher-confidence diagnostics require less human oversight
4. **Human-in-the-Loop**: Escalate edge cases and low-confidence scenarios
5. **Audit Trail**: Log all decisions for quality improvement and legal protection

---

## II. MULTI-AI CONSENSUS ALGORITHM

### Agents in the System

**Agent 1: ChatGPT (OpenAI GPT-4)**
- Role: Broad diagnostic reasoning, pattern recognition
- Strengths: Large knowledge base, natural language understanding
- Weaknesses: Occasional hallucination, verbose responses

**Agent 2: Claude (Anthropic Claude-3)**
- Role: Deep reasoning, safety-focused analysis
- Strengths: Careful reasoning, refusal of unsafe recommendations
- Weaknesses: Conservative (may over-escalate)

**Agent 3: Gemini (Google Gemini Pro)**
- Role: Technical precision, data-driven analysis
- Strengths: Fast inference, structured outputs
- Weaknesses: Less conversational, literal interpretations

### Consensus Calculation

**Step 1: Individual Agent Analysis**
Each agent receives the same diagnostic query and returns:
```json
{
  "agent": "ChatGPT",
  "diagnosis": "P0300 Random Misfire - Check spark plugs, ignition coils, or fuel injectors",
  "confidence": 0.85,
  "recommended_action": "Inspect spark plugs for wear or fouling",
  "safety_concerns": "None",
  "reasoning": "P0300 indicates random misfire across cylinders. Most common causes are spark plugs (70%), ignition coils (20%), or fuel delivery issues (10%)."
}
```

**Step 2: Similarity Analysis**
Compare agent responses using:
- Semantic similarity (cosine similarity of embeddings)
- Keyword overlap (P-code matching, component mentions)
- Recommended action alignment (replace vs. inspect vs. ignore)

**Step 3: Consensus Score Calculation**
```
Consensus Score = (Pairwise Agreement Score) / 3

Pairwise Agreements:
- ChatGPT ↔ Claude: 0.88 (high agreement)
- ChatGPT ↔ Gemini: 0.82 (high agreement)
- Claude ↔ Gemini: 0.79 (high agreement)

Average: (0.88 + 0.82 + 0.79) / 3 = 0.83 (83% consensus)
```

**Step 4: Confidence Weighting**
```
Weighted Confidence = (Agent1_Conf * W1 + Agent2_Conf * W2 + Agent3_Conf * W3) / 3

Default Weights: W1=W2=W3=1.0 (equal weighting)

Example:
ChatGPT: 0.85 * 1.0 = 0.85
Claude: 0.78 * 1.0 = 0.78
Gemini: 0.81 * 1.0 = 0.81

Average Confidence: (0.85 + 0.78 + 0.81) / 3 = 0.81 (81%)
```

---

## III. PASS/FAIL CRITERIA

### AUTO-APPROVE (Green Light ✅)

**Conditions (ALL must be true):**
1. **Consensus Score ≥ 70%** (at least 2 out of 3 agents agree)
2. **Average Confidence ≥ 70%**
3. **No conflicting critical recommendations**
   - Example conflict: Agent A says "Replace immediately" vs. Agent B says "Safe to drive"
4. **P-Code in verified database** (NHTSA/SAE/OBDII standard codes)
5. **No safety red flags** (agents didn't raise safety concerns)

**User Experience:**
- Diagnostic displayed immediately (< 1 second)
- "High confidence" badge shown
- Recommended action presented clearly
- Option to "Sell Diagram" or "Get More Details"

**Example Auto-Approve:**
```json
{
  "consensus_score": 0.83,
  "average_confidence": 0.81,
  "approved": true,
  "diagnosis": "P0300 Random Misfire",
  "recommended_action": "Inspect spark plugs for wear, fouling, or gap issues. Replace if necessary.",
  "estimated_cost": "$80-$200 (DIY) or $150-$350 (shop)",
  "safety_level": "Safe to drive short distances. Address soon to prevent catalytic converter damage.",
  "agreement_details": {
    "chatgpt": "Spark plugs (85% confidence)",
    "claude": "Spark plugs or ignition coils (78% confidence)",
    "gemini": "Spark plugs (81% confidence)"
  }
}
```

---

### ESCALATE TO HUMAN REVIEW (Yellow Light ⚠️)

**Conditions (ANY triggers escalation):**
1. **Consensus Score < 70%** (agents disagree significantly)
2. **Average Confidence < 70%** but > 40%
3. **One agent raises safety concerns** (even if others don't)
4. **Unknown P-Code** (not in standard database)
5. **Conflicting non-critical recommendations** (minor disagreements)

**User Experience:**
- "Analyzing... This diagnostic requires expert review" message shown
- Estimated wait time: 15-30 minutes (human mechanic reviews)
- User can opt to "Wait for Expert" or "Get AI Best Guess"
- Escalated diagnostics logged for quality improvement

**Human Review Process:**
1. **Alert sent to on-call mechanic** (SMS + app notification)
2. **Mechanic reviews all 3 agent responses** + raw diagnostic data
3. **Mechanic makes final decision** (approve, reject, or request more data)
4. **Feedback loop**: Mechanic's decision used to retrain consensus algorithm

**Example Escalation:**
```json
{
  "consensus_score": 0.45,
  "average_confidence": 0.62,
  "escalated": true,
  "reason": "Low consensus - agents disagree on root cause",
  "diagnosis": "P0171 System Too Lean (Bank 1)",
  "agent_disagreement": {
    "chatgpt": "Vacuum leak (68% confidence)",
    "claude": "Faulty MAF sensor (55% confidence)",
    "gemini": "Fuel pressure issue (59% confidence)"
  },
  "user_message": "This diagnostic requires expert review. Estimated wait: 20 minutes.",
  "escalation_id": "ESC-2025-12-20-0042"
}
```

---

### REJECT DIAGNOSTIC (Red Light 🛑)

**Conditions (ANY triggers rejection):**
1. **Average Confidence < 40%** (agents have no idea)
2. **All agents recommend different actions** (0% consensus)
3. **Safety red flag detected** (any agent flags as unsafe)
4. **Legal/liability risk** (e.g., "Bypass airbag sensor")
5. **Recommendation violates safety standards** (e.g., "Ignore recall notice")

**User Experience:**
- "Unable to diagnose with confidence" message
- "We recommend consulting a certified mechanic" disclaimer
- Option to "Submit to Community Forum" or "Schedule Shop Appointment"
- No diagram generation allowed for rejected diagnostics

**Example Rejection:**
```json
{
  "consensus_score": 0.12,
  "average_confidence": 0.28,
  "rejected": true,
  "reason": "Insufficient confidence - unable to diagnose",
  "diagnosis": "Unknown Issue (Insufficient Data)",
  "user_message": "We're unable to provide a confident diagnosis for this issue. We recommend consulting a certified mechanic for an in-person inspection.",
  "suggested_actions": [
    "Visit a local mechanic for diagnostic scan",
    "Post question in RideWire Community Forum",
    "Schedule video consultation with RideWire expert"
  ]
}
```

---

## IV. SAFETY RED FLAGS (AUTO-REJECT)

### Critical Safety Violations

**1. Recommending Unsafe Practices**
- "Bypass safety sensor"
- "Remove airbag fuse"
- "Disconnect ABS system"
- "Ignore brake warning light"

**2. Ignoring Recalls or TSBs**
- "This recall doesn't apply to you" (if it does)
- "Recall fix not necessary"

**3. Encouraging Liability-Inducing Actions**
- "This is safe to ignore" (for critical safety systems)
- "Drive at high speed to clear code"

**4. Recommending Temporary Fixes for Critical Issues**
- "Use duct tape to seal brake line"
- "JB Weld the exhaust manifold crack"

### Detection Logic

**Keyword Blacklist:**
- "bypass", "ignore", "disable", "remove" (when related to safety systems)
- "temporary fix" + "brakes" or "steering" or "airbag"

**Contextual Analysis:**
- If any agent response contains safety keywords + negative framing → Flag
- If recommendation conflicts with NHTSA safety standards → Flag

**Human Override:**
- Flagged diagnostics sent to safety review team
- False positives logged and used to refine keyword blacklist

---

## V. CONFIDENCE THRESHOLDS & TUNING

### Current Thresholds (Production)

| Metric | Auto-Approve | Escalate | Reject |
|---|---|---|---|
| **Consensus Score** | ≥ 70% | 40-70% | < 40% |
| **Average Confidence** | ≥ 70% | 40-70% | < 40% |
| **Safety Flag** | None | Any agent | Multiple agents |

### Threshold Tuning Process

**Monthly Review:**
1. Analyze escalation rate (target: <10%)
2. Analyze false positive rate (target: <2%)
3. Analyze user satisfaction with auto-approved diagnostics (target NPS: 70+)

**Adjustment Examples:**
- If escalation rate > 15% → Lower consensus threshold (70% → 65%)
- If false positive rate > 5% → Raise confidence threshold (70% → 75%)
- If user satisfaction < 60 → Tighten safety flag detection

---

## VI. AUDIT TRAIL & LOGGING

### Data Logged for Every Diagnostic

```json
{
  "diagnostic_id": "DIAG-2025-12-20-10234",
  "timestamp": "2025-12-20T14:32:18Z",
  "user_id": "USER-5892",
  "vehicle": {
    "make": "Harley-Davidson",
    "model": "Street 750",
    "year": 2022,
    "vin": "1HD1KB4..."
  },
  "query": "Check engine light on, code P0505",
  "agents": [
    {
      "name": "ChatGPT",
      "model": "gpt-4-turbo",
      "response": "Idle Air Control valve issue...",
      "confidence": 0.82,
      "latency_ms": 1240
    },
    {
      "name": "Claude",
      "model": "claude-3-opus",
      "response": "IAC valve or throttle body...",
      "confidence": 0.76,
      "latency_ms": 980
    },
    {
      "name": "Gemini",
      "model": "gemini-pro",
      "response": "P0505: Idle control system malfunction...",
      "confidence": 0.79,
      "latency_ms": 650
    }
  ],
  "consensus_score": 0.78,
  "average_confidence": 0.79,
  "decision": "auto_approved",
  "safety_flags": [],
  "human_review": null,
  "user_feedback": {
    "rating": 5,
    "comment": "Accurate diagnosis, fixed the issue!"
  }
}
```

### Audit Trail Storage

- **Database:** PostgreSQL with time-series indexing
- **Retention:** 7 years (for legal compliance)
- **Access Control:** Only authorized safety team members
- **Backup:** Daily encrypted backups to S3

---

## VII. LIABILITY PROTECTION & DISCLAIMERS

### User-Facing Disclaimer (All Diagnostics)

```
⚠️ IMPORTANT DISCLAIMER

RideWire AI Hub provides informational diagnostic recommendations based on AI analysis. These recommendations are NOT a substitute for professional mechanical inspection.

Always consult a certified mechanic before making repair decisions, especially for safety-critical systems (brakes, steering, airbags).

RideWire is not liable for damages resulting from following AI recommendations. Use at your own risk.
```

### Terms of Service (Key Clauses)

**1. No Warranties:**
"RideWire provides diagnostic information 'as-is' without warranties of any kind, express or implied."

**2. Limitation of Liability:**
"RideWire is not liable for any damages arising from use of the platform, including but not limited to vehicle damage, personal injury, or financial loss."

**3. Professional Consultation:**
"Users agree to consult certified mechanics for all safety-critical repairs and not to rely solely on AI recommendations."

**4. Data Usage:**
"RideWire may use diagnostic data to improve the platform, but will not share personal information with third parties without consent."

---

## VIII. CONTINUOUS IMPROVEMENT LOOP

### Feedback Collection

**1. User Ratings:**
- After every diagnostic: "Was this diagnosis helpful?" (1-5 stars)
- After repair completion: "Did the recommended fix solve the issue?" (Yes/No)

**2. Mechanic Feedback:**
- For escalated diagnostics: "What was the actual root cause?"
- Mechanic's diagnosis compared to AI consensus (accuracy tracking)

**3. Community Validation:**
- Users can flag incorrect diagnostics in community forum
- Flagged diagnostics reviewed by safety team

### Algorithm Retraining

**Monthly:**
- Retrain consensus algorithm using previous month's diagnostic data
- Update P-code database with new codes and known fixes
- Refine safety keyword blacklist based on false positives

**Quarterly:**
- Full model evaluation (precision, recall, F1 score)
- A/B test new consensus thresholds on 10% of users
- Publish transparency report (accuracy rates, escalation rates, user satisfaction)

---

## IX. IMPLEMENTATION CHECKLIST

### Phase 1: Core Algorithm (Week 1)
- [ ] Implement consensus scoring algorithm
- [ ] Define confidence thresholds
- [ ] Create safety keyword blacklist
- [ ] Build escalation queue for human review

### Phase 2: Logging & Audit (Week 2)
- [ ] Set up PostgreSQL logging schema
- [ ] Implement audit trail capture
- [ ] Create safety review dashboard
- [ ] Configure automated alerts for safety red flags

### Phase 3: User Experience (Week 3)
- [ ] Design diagnostic result screens (approved, escalated, rejected)
- [ ] Add disclaimers to all diagnostic pages
- [ ] Build feedback collection UI
- [ ] Create "Consult a Mechanic" referral system

### Phase 4: Testing & Validation (Week 4)
- [ ] Test with 100 known P-codes (ground truth dataset)
- [ ] Measure accuracy (target: 90%+ for auto-approved)
- [ ] Measure escalation rate (target: <10%)
- [ ] User acceptance testing with 50 beta testers

---

## X. SUCCESS METRICS

### Target KPIs (Month 1)

- ✅ **Auto-Approval Rate:** 90%+ (most diagnostics pass without escalation)
- ✅ **Accuracy Rate:** 85%+ (user feedback confirms diagnosis was correct)
- ✅ **Escalation Rate:** <10% (minimal human intervention required)
- ✅ **Safety Incidents:** 0 (no reported injuries or damages from AI recommendations)
- ✅ **User Satisfaction:** NPS 60+ (users trust the diagnostics)
- ✅ **False Positive Rate:** <5% (incorrect diagnostics rare)

### Long-Term Goals (Year 1)

- ✅ **Accuracy Rate:** 95%+
- ✅ **Auto-Approval Rate:** 95%+
- ✅ **User Satisfaction:** NPS 70+
- ✅ **Safety Incidents:** 0

---

## XI. GLOSSARY

**Consensus Score:** Percentage of agreement between AI agents on diagnosis and recommended action.

**Confidence Score:** Individual agent's self-reported certainty in its diagnosis (0.0 to 1.0).

**Escalation:** Process of routing a diagnostic to human mechanic for review when safety gating criteria are not met.

**Safety Red Flag:** Keyword or contextual pattern indicating potentially unsafe or liability-inducing recommendation.

**P-Code:** Powertrain diagnostic trouble code (OBDII standard) used to identify vehicle issues.

**Ground Truth Dataset:** Verified diagnostic cases where the actual root cause is known (used for algorithm validation).

---

**STATUS: PRODUCTION READY 🚀**

This safety gating framework is designed to balance accuracy, speed, and user safety. It will be continuously refined based on real-world usage data.

*Last Updated: December 20, 2025*  
*Next Review: January 20, 2026*  
*Owner: AI Safety Team + MANUS (The Architect)*
