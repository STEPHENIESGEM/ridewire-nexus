/**
 * Safety Gating Module
 * Implements multi-agent consensus safety framework
 * Ensures AI recommendations are accurate, safe, and legally defensible
 */

class SafetyGating {
  constructor() {
    // Consensus thresholds
    this.CONSENSUS_THRESHOLD_AUTO_APPROVE = 0.70;
    this.CONSENSUS_THRESHOLD_ESCALATE = 0.40;
    this.CONFIDENCE_THRESHOLD_AUTO_APPROVE = 0.70;
    this.CONFIDENCE_THRESHOLD_ESCALATE = 0.40;
    
    // Safety keyword blacklist
    this.SAFETY_KEYWORDS = [
      'bypass', 'disable', 'remove', 'ignore', 
      'duct tape', 'temporary fix', 'jb weld',
      'disconnect airbag', 'remove safety', 'skip recall'
    ];
    
    // P-code database (NHTSA/SAE verified codes)
    this.VERIFIED_P_CODES = new Set([
      'P0300', 'P0301', 'P0302', 'P0303', 'P0304',
      'P0420', 'P0430', 'P0171', 'P0174', 'P0505',
      'P0200', 'P0305', 'P0087'
    ]);
  }

  /**
   * Evaluate consensus and apply safety gating
   * @param {Object} consensus - Consensus result from multi-AI orchestrator
   * @param {string} pCode - OBDII diagnostic code
   * @returns {Object} Safety decision with status and reasoning
   */
  evaluateConsensus(consensus, pCode) {
    const decision = {
      timestamp: new Date().toISOString(),
      status: 'pending',
      reason: '',
      safetyFlags: [],
      consensusScore: consensus.score,
      averageConfidence: consensus.averageConfidence,
      escalationId: null
    };

    // Check for safety red flags first
    const safetyViolations = this.detectSafetyViolations(consensus);
    if (safetyViolations.length > 0) {
      decision.status = 'rejected';
      decision.reason = 'Safety violations detected';
      decision.safetyFlags = safetyViolations;
      return decision;
    }

    // Check if P-code is verified
    if (pCode && !this.VERIFIED_P_CODES.has(pCode)) {
      decision.status = 'escalated';
      decision.reason = 'Unknown P-code not in verified database';
      decision.escalationId = this.generateEscalationId();
      return decision;
    }

    // Check for conflicting critical recommendations
    if (this.hasConflictingRecommendations(consensus)) {
      decision.status = 'escalated';
      decision.reason = 'Conflicting critical recommendations detected';
      decision.escalationId = this.generateEscalationId();
      return decision;
    }

    // Apply consensus thresholds
    if (
      consensus.score >= this.CONSENSUS_THRESHOLD_AUTO_APPROVE &&
      consensus.averageConfidence >= this.CONFIDENCE_THRESHOLD_AUTO_APPROVE
    ) {
      decision.status = 'approved';
      decision.reason = 'High consensus and confidence - auto-approved';
      return decision;
    }

    if (
      consensus.score >= this.CONSENSUS_THRESHOLD_ESCALATE &&
      consensus.averageConfidence >= this.CONFIDENCE_THRESHOLD_ESCALATE
    ) {
      decision.status = 'escalated';
      decision.reason = 'Moderate consensus - requires human review';
      decision.escalationId = this.generateEscalationId();
      return decision;
    }

    // Reject if below thresholds
    decision.status = 'rejected';
    decision.reason = 'Insufficient confidence - unable to diagnose';
    return decision;
  }

  /**
   * Detect safety violations in AI responses
   * @param {Object} consensus - Consensus result
   * @returns {Array} List of safety violations
   */
  detectSafetyViolations(consensus) {
    const violations = [];
    
    // Check each agent response for safety keywords
    if (consensus.agents) {
      consensus.agents.forEach(agent => {
        const text = (agent.response || agent.diagnosis || '').toLowerCase();
        
        this.SAFETY_KEYWORDS.forEach(keyword => {
          if (text.includes(keyword.toLowerCase())) {
            violations.push({
              agent: agent.name,
              keyword: keyword,
              context: text.substring(
                Math.max(0, text.indexOf(keyword) - 50),
                Math.min(text.length, text.indexOf(keyword) + 50)
              )
            });
          }
        });
      });
    }
    
    return violations;
  }

  /**
   * Check for conflicting critical recommendations
   * @param {Object} consensus - Consensus result
   * @returns {boolean} True if conflicts detected
   */
  hasConflictingRecommendations(consensus) {
    if (!consensus.agents || consensus.agents.length < 2) {
      return false;
    }

    const recommendations = consensus.agents.map(agent => 
      (agent.recommended_action || agent.diagnosis || '').toLowerCase()
    );

    // Check for contradictory recommendations
    const hasReplace = recommendations.some(r => r.includes('replace'));
    const hasSafeToDrive = recommendations.some(r => r.includes('safe to drive'));
    const hasIgnore = recommendations.some(r => r.includes('ignore') || r.includes('do nothing'));

    // Conflicting if one says replace and another says safe/ignore
    if (hasReplace && (hasSafeToDrive || hasIgnore)) {
      return true;
    }

    return false;
  }

  /**
   * Generate unique escalation ID
   * @returns {string} Escalation ID
   */
  generateEscalationId() {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ESC-${dateStr}-${sequence}`;
  }

  /**
   * Calculate consensus score from agent responses
   * @param {Array} agents - Array of agent responses
   * @returns {Object} Consensus metrics
   */
  calculateConsensus(agents) {
    if (!agents || agents.length === 0) {
      return {
        score: 0,
        averageConfidence: 0,
        agents: []
      };
    }

    // Calculate average confidence
    const confidences = agents.map(a => a.confidence || 0);
    const averageConfidence = confidences.reduce((sum, c) => sum + c, 0) / confidences.length;

    // Calculate pairwise agreement scores
    const pairwiseScores = [];
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const score = this.calculatePairwiseAgreement(agents[i], agents[j]);
        pairwiseScores.push(score);
      }
    }

    // Average pairwise scores
    const consensusScore = pairwiseScores.length > 0
      ? pairwiseScores.reduce((sum, s) => sum + s, 0) / pairwiseScores.length
      : 0;

    return {
      score: consensusScore,
      averageConfidence: averageConfidence,
      agents: agents,
      pairwiseScores: pairwiseScores
    };
  }

  /**
   * Calculate agreement between two agents
   * @param {Object} agent1 - First agent response
   * @param {Object} agent2 - Second agent response
   * @returns {number} Agreement score (0-1)
   */
  calculatePairwiseAgreement(agent1, agent2) {
    const text1 = (agent1.response || agent1.diagnosis || '').toLowerCase();
    const text2 = (agent2.response || agent2.diagnosis || '').toLowerCase();

    // Simple keyword overlap algorithm
    const words1 = new Set(text1.split(/\s+/).filter(w => w.length > 4));
    const words2 = new Set(text2.split(/\s+/).filter(w => w.length > 4));

    // Calculate Jaccard similarity
    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Get liability disclaimer text
   * @returns {string} Disclaimer for user display
   */
  getLiabilityDisclaimer() {
    return `⚠️ IMPORTANT DISCLAIMER

RideWire AI Hub provides informational diagnostic recommendations based on AI analysis. These recommendations are NOT a substitute for professional mechanical inspection.

Always consult a certified mechanic before making repair decisions, especially for safety-critical systems (brakes, steering, airbags).

RideWire is not liable for damages resulting from following AI recommendations. Use at your own risk.`;
  }
}

module.exports = SafetyGating;
