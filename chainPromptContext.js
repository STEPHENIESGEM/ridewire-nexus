/**
 * CHAIN PROMPT CONTEXT HANDLER
 * 
 * Structured handoff protocol for AI agent chain prompting.
 * Improves on raw JSON context passing with semantic compression,
 * confidence tracking, and verification loops.
 * 
 * Key improvements:
 * - Structured decision format with confidence scores
 * - Semantic compression to reduce token usage
 * - Context relevance scoring
 * - Verification and validation mechanisms
 */

class ChainPromptContext {
  /**
   * Create a structured context for chain prompting
   * @param {string} decision - The actual output/recommendation
   * @param {number} confidence - Confidence score (0-1)
   * @param {string} reasoning - Concise summary (3-5 sentences)
   * @param {Array} alternatives - Alternative options considered
   */
  constructor(decision, confidence, reasoning, alternatives = []) {
    this.decision = decision;
    this.confidence = confidence;
    this.reasoning = reasoning;
    this.alternatives = alternatives;
    this.metadata = {
      sourceAgent: null,
      timestamp: Date.now(),
      version: 1,
      verified: false
    };
  }

  /**
   * Set the source agent for this context
   */
  setSource(agentName) {
    this.metadata.sourceAgent = agentName;
    return this;
  }

  /**
   * Mark this context as verified
   */
  markVerified() {
    this.metadata.verified = true;
    return this;
  }

  /**
   * Convert to structured prompt format for chain prompting
   * This reduces token usage vs. full JSON serialization
   */
  toChainPrompt() {
    const confidence = Math.round(this.confidence * 100);
    const alternatives = this.alternatives.length > 0 
      ? `\nAlternatives Considered: ${this.alternatives.map(a => a.option).join(', ')}`
      : '';
    
    return `[PREVIOUS_DECISION]
Agent: ${this.metadata.sourceAgent}
Decision: ${this.decision}
Confidence: ${confidence}%
Reasoning: ${this.reasoning}${alternatives}
Verified: ${this.metadata.verified ? 'Yes' : 'No'}
[END]`;
  }

  /**
   * Extract context summary for memory storage
   * Significantly reduces memory footprint
   */
  toSummary() {
    return {
      agent: this.metadata.sourceAgent,
      decision: this.decision.substring(0, 200), // Truncate long decisions
      confidence: this.confidence,
      timestamp: this.metadata.timestamp,
      verified: this.metadata.verified
    };
  }

  /**
   * Create from legacy context object
   * Allows backward compatibility with existing code
   */
  static fromLegacy(legacyContext) {
    const decision = legacyContext.response || legacyContext.message || '';
    const reasoning = legacyContext.context?.reasoning || 'No reasoning provided';
    
    const ctx = new ChainPromptContext(
      decision,
      0.75, // Default confidence for legacy contexts
      reasoning,
      []
    );
    
    if (legacyContext.from) {
      ctx.setSource(legacyContext.from);
    }
    
    return ctx;
  }
}

/**
 * SMART MEMORY MANAGER
 * 
 * Manages agent memory with relevance scoring and intelligent pruning.
 * Prevents unbounded memory growth and improves context retrieval.
 */
class SmartMemory {
  constructor(maxSize = 1000) {
    this.memory = [];
    this.maxSize = maxSize;
    this.relevanceDecayRate = 0.95; // Daily decay factor
  }

  /**
   * Add interaction to memory with automatic pruning
   */
  add(interaction) {
    // Convert to ChainPromptContext if needed
    const context = interaction instanceof ChainPromptContext 
      ? interaction 
      : ChainPromptContext.fromLegacy(interaction);
    
    this.memory.push({
      context: context.toSummary(),
      timestamp: Date.now(),
      relevanceScore: 1.0,
      accessCount: 0
    });
    
    // Prune if exceeds max size
    if (this.memory.length > this.maxSize) {
      this.pruneByRelevance();
    }
  }

  /**
   * Prune memory based on relevance and recency
   * Keeps recent and frequently accessed memories
   */
  pruneByRelevance() {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    // Calculate combined score (relevance + recency + access frequency)
    this.memory.forEach(m => {
      const daysSinceCreation = (now - m.timestamp) / oneDayMs;
      const ageDecay = Math.pow(this.relevanceDecayRate, daysSinceCreation);
      const accessBoost = Math.log(m.accessCount + 1) / 10; // Log scale boost
      
      m.combinedScore = m.relevanceScore * ageDecay + accessBoost;
    });
    
    // Sort by combined score and keep top 80%
    this.memory.sort((a, b) => b.combinedScore - a.combinedScore);
    this.memory = this.memory.slice(0, Math.floor(this.maxSize * 0.8));
  }

  /**
   * Get relevant context for a given agent and task
   * @param {string} agent - Agent name
   * @param {string} topic - Topic/task description
   * @param {number} topK - Number of results to return
   */
  getRelevant(agent, topic = '', topK = 5) {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    // Filter by agent and calculate relevance
    const relevant = this.memory
      .filter(m => !agent || m.context.agent === agent || m.context.agent === null)
      .map(m => {
        const daysSinceCreation = (now - m.timestamp) / oneDayMs;
        const recency = Math.exp(-daysSinceCreation / 7); // 1-week half-life
        
        // Simple text matching for relevance (could be improved with embeddings)
        const topicRelevance = topic 
          ? this.calculateTextRelevance(m.context.decision, topic)
          : 1.0;
        
        const score = (
          0.4 * recency + 
          0.4 * topicRelevance + 
          0.2 * m.context.confidence
        );
        
        return { ...m, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
    
    // Increment access count for retrieved memories
    relevant.forEach(m => m.accessCount++);
    
    return relevant.map(m => m.context);
  }

  /**
   * Simple text relevance calculation
   * Could be improved with embeddings/semantic search
   */
  calculateTextRelevance(text1, text2) {
    const words1 = new Set(text1.toLowerCase().split(/\W+/).filter(w => w.length > 3));
    const words2 = new Set(text2.toLowerCase().split(/\W+/).filter(w => w.length > 3));
    
    let intersection = 0;
    for (const word of words1) {
      if (words2.has(word)) intersection++;
    }
    
    const union = words1.size + words2.size - intersection;
    return union > 0 ? intersection / union : 0;
  }

  /**
   * Clear memory for specific agent or session
   */
  clear(agent = null) {
    if (agent) {
      this.memory = this.memory.filter(m => m.context.agent !== agent);
    } else {
      this.memory = [];
    }
  }

  /**
   * Get memory statistics
   */
  getStats() {
    return {
      totalMemories: this.memory.length,
      oldestMemory: this.memory.length > 0 
        ? new Date(Math.min(...this.memory.map(m => m.timestamp))).toISOString()
        : null,
      averageConfidence: this.memory.length > 0
        ? this.memory.reduce((sum, m) => sum + m.context.confidence, 0) / this.memory.length
        : 0,
      verifiedCount: this.memory.filter(m => m.context.verified).length
    };
  }
}

/**
 * CONTEXT COMPRESSOR
 * 
 * Compresses context to reduce token usage in chain prompts.
 * Extracts key information and discards verbosity.
 */
class ContextCompressor {
  /**
   * Compress array of contexts into concise summary
   * @param {Array} contexts - Array of context objects
   * @param {number} maxLength - Maximum length in characters
   */
  static compress(contexts, maxLength = 1000) {
    if (!contexts || contexts.length === 0) {
      return '';
    }
    
    const summaries = contexts.map((ctx, idx) => {
      const confidence = Math.round(ctx.confidence * 100);
      return `${idx + 1}. ${ctx.agent}: ${ctx.decision.substring(0, 150)}... (${confidence}% confident)`;
    });
    
    let compressed = summaries.join('\n');
    
    // Truncate if too long
    if (compressed.length > maxLength) {
      compressed = compressed.substring(0, maxLength - 20) + '... [truncated]';
    }
    
    return `[CONTEXT SUMMARY]\n${compressed}\n[END SUMMARY]`;
  }

  /**
   * Extract key decisions from context history
   */
  static extractKeyDecisions(contexts, limit = 3) {
    return contexts
      .filter(ctx => ctx.verified)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit)
      .map(ctx => `- ${ctx.agent} decided: ${ctx.decision.substring(0, 100)}`);
  }
}

/**
 * RESPONSE VERIFIER
 * 
 * Validates agent responses before propagating to downstream agents.
 * Catches hallucinations, inconsistencies, and low-quality outputs.
 */
class ResponseVerifier {
  /**
   * Verify response quality and consistency
   * @param {string} request - Original request
   * @param {string} response - Agent's response
   * @param {Object} context - Additional context
   */
  static verify(request, response, context = {}) {
    const issues = [];
    
    // Check 1: Response is not empty
    if (!response || response.trim().length === 0) {
      issues.push('Empty response');
    }
    
    // Check 2: Response is not too short (likely incomplete)
    if (response && response.length < 20) {
      issues.push('Response too short, possibly incomplete');
    }
    
    // Check 3: Response doesn't just repeat the request
    if (response && request && 
        response.toLowerCase().includes(request.toLowerCase().substring(0, 50))) {
      issues.push('Response appears to repeat the request');
    }
    
    // Check 4: Check for common error patterns
    const errorPatterns = [
      /sorry.*cannot/i,
      /I don't have/i,
      /as an AI/i,
      /I cannot access/i,
      /error/i
    ];
    
    for (const pattern of errorPatterns) {
      if (response && pattern.test(response)) {
        issues.push(`Response contains error pattern: ${pattern.source}`);
        break;
      }
    }
    
    // Check 5: Verify response addresses the request topic
    if (request && response) {
      const relevance = this.calculateRelevance(request, response);
      if (relevance < 0.1) {
        issues.push('Response may not address the request');
      }
    }
    
    return {
      valid: issues.length === 0,
      issues,
      confidence: issues.length === 0 ? 0.9 : Math.max(0.1, 0.9 - (issues.length * 0.2))
    };
  }

  /**
   * Simple relevance check between request and response
   */
  static calculateRelevance(request, response) {
    const requestWords = new Set(
      request.toLowerCase()
        .split(/\W+/)
        .filter(w => w.length > 3)
    );
    
    const responseWords = response.toLowerCase().split(/\W+/);
    let matches = 0;
    
    for (const word of responseWords) {
      if (requestWords.has(word)) {
        matches++;
      }
    }
    
    return matches / Math.max(responseWords.length, 1);
  }
}

module.exports = {
  ChainPromptContext,
  SmartMemory,
  ContextCompressor,
  ResponseVerifier
};
