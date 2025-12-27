/**
 * SafetyRuleEngine.ts - Veto & Safety Gating
 * 
 * Applies business rules to consensus results before displaying to mechanic.
 * Blocks unsafe, expensive, or conflicting recommendations.
 */

interface SafetyConfig {
  min_confidence_threshold: number; // 70%
  high_cost_threshold: number; // $1000
  min_confidence_for_high_cost: number; // 80%
  duplicate_action_cooldown_ms: number; // 3600000 = 1 hour
  conflicting_actions: Record<string, string[]>;
}

interface ConsensusFeedback {
  query_id: string;
  action: 'accept' | 'reject' | 'request_alternative' | 'modify';
  mechanic_confidence: number;
  notes: string;
  timestamp: Date;
}

export class SafetyRuleEngine {
  private config: SafetyConfig;
  private actionHistory: Map<string, Date> = new Map();
  private feedbackLog: ConsensusFeedback[] = [];

  constructor(config: Partial<SafetyConfig> = {}) {
    this.config = {
      min_confidence_threshold: 0.70,
      high_cost_threshold: 1000,
      min_confidence_for_high_cost: 0.80,
      duplicate_action_cooldown_ms: 3600000,
      conflicting_actions: {
        'replace_engine': ['replace_transmission'],
        'flush_coolant': ['replace_coolant_hoses'],
      },
      ...config,
    };
  }

  /**
   * Check if consensus result passes all safety gates
   */
  evaluateConsensus(result: any): { passed: boolean; reason?: string } {
    // Gate 1: Confidence threshold
    if (result.consensus.confidence < this.config.min_confidence_threshold) {
      return {
        passed: false,
        reason: `Confidence ${(result.consensus.confidence * 100).toFixed(0)}% below threshold (${this.config.min_confidence_threshold * 100}%)`,
      };
    }

    // Gate 2: High-cost recommendations require higher confidence
    if (
      result.consensus.estimated_cost &&
      result.consensus.estimated_cost > this.config.high_cost_threshold &&
      result.consensus.confidence < this.config.min_confidence_for_high_cost
    ) {
      return {
        passed: false,
        reason: `High-cost recommendation ($${result.consensus.estimated_cost}) requires ${this.config.min_confidence_for_high_cost * 100}% confidence`,
      };
    }

    // Gate 3: Check for conflicting actions
    const conflict = this.checkConflictingActions(result.recommended_actions);
    if (conflict) {
      return {
        passed: false,
        reason: `Conflicting actions detected: ${conflict}`,
      };
    }

    // Gate 4: Check for duplicate actions (within cooldown period)
    const duplicate = this.checkDuplicateActions(result.recommended_actions);
    if (duplicate) {
      return {
        passed: false,
        reason: `Action '${duplicate}' already performed within cooldown period`,
      };
    }

    return { passed: true };
  }

  /**
   * Check for conflicting action pairs
   */
  private checkConflictingActions(actions: string[]): string | null {
    for (const action of actions) {
      const conflicts = this.config.conflicting_actions[action] || [];
      for (const other of actions) {
        if (conflicts.includes(other)) {
          return `${action} conflicts with ${other}`;
        }
      }
    }
    return null;
  }

  /**
   * Check if action was recently performed (within cooldown)
   */
  private checkDuplicateActions(actions: string[]): string | null {
    const now = new Date();
    for (const action of actions) {
      const lastPerformed = this.actionHistory.get(action);
      if (
        lastPerformed &&
        now.getTime() - lastPerformed.getTime() <
          this.config.duplicate_action_cooldown_ms
      ) {
        return action;
      }
    }
    return null;
  }

  /**
   * Record mechanic feedback on a consensus result
   */
  recordFeedback(feedback: Omit<ConsensusFeedback, 'timestamp'>): void {
    this.feedbackLog.push({
      ...feedback,
      timestamp: new Date(),
    });

    // Update action history if accepted
    if (feedback.action === 'accept') {
      // Record all recommended actions from the consensus
      // (implementation would need the result object)
    }
  }

  /**
   * Get audit trail of all decisions
   */
  getAuditLog(): ConsensusFeedback[] {
    return [...this.feedbackLog];
  }
}

export default SafetyRuleEngine;
