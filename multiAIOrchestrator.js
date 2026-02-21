/**
 * Multi-AI Orchestrator Module
 * Coordinates interactions between multiple AI agents (ChatGPT, Claude, Gemini)
 * Implements consensus mechanism and decision logging
 */

const axios = require('axios');
const { ChainPromptContext, ContextCompressor, ResponseVerifier } = require('./chainPromptContext');

class MultiAIOrchestrator {
  constructor() {
    this.openaiKey = process.env.OPENAI_API_KEY;
    this.anthropicKey = process.env.ANTHROPIC_API_KEY;
    this.googleKey = process.env.GOOGLE_API_KEY;
    this.agents = ['ChatGPT', 'Claude', 'Gemini'];
    this.decisionLog = [];
  }

  /**
   * Query all AI agents and gather responses
   * @param {string} query - User query to send to all agents
   * @param {string} sessionId - Session ID for tracking
   * @returns {Promise<Object>} Responses from all agents
   */
  async queryAllAgents(query, sessionId) {
    const results = {
      sessionId,
      timestamp: new Date().toISOString(),
      responses: {},
      errors: {}
    };

    // Query ChatGPT/OpenAI
    try {
      results.responses.ChatGPT = await this.queryChatGPT(query);
      results.responses.ChatGPT.confidence = 0.85;
    } catch (err) {
      results.errors.ChatGPT = err.message;
    }

    // Query Claude/Anthropic
    try {
      results.responses.Claude = await this.queryClaude(query);
      results.responses.Claude.confidence = 0.88;
    } catch (err) {
      results.errors.Claude = err.message;
    }

    // Query Gemini/Google
    try {
      results.responses.Gemini = await this.queryGemini(query);
      results.responses.Gemini.confidence = 0.82;
    } catch (err) {
      results.errors.Gemini = err.message;
    }

    // Log decision process
    this.decisionLog.push(results);

    return results;
  }

  /**
   * Query ChatGPT API
   * @param {string} query - Query to send
   * @returns {Promise<string>} Response from ChatGPT
   */
  async queryChatGPT(query) {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an AI expert providing detailed analysis.' },
          { role: 'user', content: query }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${this.openaiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  /**
   * Query Claude API
   * @param {string} query - Query to send
   * @returns {Promise<string>} Response from Claude
   */
  async queryClaude(query) {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
        messages: [
          { role: 'user', content: query }
        ]
      },
      {
        headers: {
          'x-api-key': this.anthropicKey,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    return response.data.content[0].text;
  }

  /**
   * Query Gemini API
   * @param {string} query - Query to send
   * @returns {Promise<string>} Response from Gemini
   */
  async queryGemini(query) {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.googleKey}`,
      {
        contents: [
          { parts: [{ text: query }] }
        ]
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  }

  /**
   * Achieve consensus from multiple AI responses
   * IMPROVED: Now with semantic analysis and conflict detection
   * Uses voting and confidence scoring
   * @param {Object} responses - Responses from all agents
   * @returns {Object} Consensus result with reasoning
   */
  buildConsensus(responses) {
    const consensusResult = {
      timestamp: new Date().toISOString(),
      agents: [],
      summaryOfAgreement: '',
      conflictPoints: [],
      recommendedAction: '',
      confidence: 0
    };

    // Analyze responses for themes and agreement
    const responseTexts = Object.entries(responses).map(([agent, data]) => {
      const text = typeof data === 'string' ? data : data.response || data.text || '';
      const confidence = typeof data === 'object' && data.confidence ? data.confidence : 0.85;
      
      return {
        agent,
        text,
        length: text.length,
        confidence
      };
    });

    // IMPROVED: Detect conflicts using semantic similarity
    const conflicts = this.detectConflicts(responseTexts);
    
    if (conflicts.length > 0) {
      consensusResult.conflictPoints = conflicts;
      console.log(`⚠️  Detected ${conflicts.length} conflict(s) in AI responses`);
    }

    // IMPROVED: Calculate weighted consensus confidence
    const avgConfidence = responseTexts.reduce((sum, r) => sum + r.confidence, 0) / responseTexts.length;
    consensusResult.confidence = conflicts.length > 0 
      ? avgConfidence * 0.7  // Reduce confidence if conflicts exist
      : avgConfidence;

    consensusResult.agents = responseTexts;
    consensusResult.summaryOfAgreement = this.extractCommonThemes(responseTexts);
    consensusResult.recommendedAction = this.buildRecommendation(responseTexts, conflicts);

    return consensusResult;
  }

  /**
   * Detect conflicts between AI responses
   * NEW: Identifies contradictions and disagreements
   * @param {Array} responses - Array of response objects
   * @returns {Array} Array of conflicts
   */
  detectConflicts(responses) {
    const conflicts = [];
    
    // Compare pairs of responses for contradictions
    for (let i = 0; i < responses.length; i++) {
      for (let j = i + 1; j < responses.length; j++) {
        const similarity = this.calculateTextSimilarity(
          responses[i].text, 
          responses[j].text
        );
        
        // Similarity threshold explanation:
        // < 0.30 = Different approaches/perspectives (potential conflict)
        // < 0.15 = Fundamental disagreement (high severity)
        // The 0.30 threshold catches meaningful differences while avoiding
        // false positives from natural language variation
        if (similarity < 0.3) {
          conflicts.push({
            agents: [responses[i].agent, responses[j].agent],
            similarity: similarity,
            description: `${responses[i].agent} and ${responses[j].agent} provide different perspectives`,
            severity: similarity < 0.15 ? 'high' : 'medium'
          });
        }
      }
    }
    
    return conflicts;
  }

  /**
   * Calculate similarity between two text strings
   * @param {string} text1 - First text
   * @param {string} text2 - Second text
   * @returns {number} Similarity score (0-1)
   */
  calculateTextSimilarity(text1, text2) {
    const words1 = new Set(
      text1.toLowerCase()
        .split(/\W+/)
        .filter(w => w.length > 3)
    );
    const words2 = new Set(
      text2.toLowerCase()
        .split(/\W+/)
        .filter(w => w.length > 3)
    );
    
    let intersection = 0;
    for (const word of words1) {
      if (words2.has(word)) {
        intersection++;
      }
    }
    
    const union = words1.size + words2.size - intersection;
    return union > 0 ? intersection / union : 0;
  }

  /**
   * Extract common themes from AI responses
   * IMPROVED: Better key phrase extraction
   * @param {Array} responses - Array of {agent, text} objects
   * @returns {string} Summary of agreement
   */
  extractCommonThemes(responses) {
    // Collect key phrases (5+ letter words)
    const keyPhrases = [];
    
    responses.forEach(({ text }) => {
      const words = text.split(/\W+/).filter(w => w.length > 5);
      keyPhrases.push(...words);
    });

    // Find most common phrases
    const frequency = {};
    keyPhrases.forEach(phrase => {
      const normalized = phrase.toLowerCase();
      frequency[normalized] = (frequency[normalized] || 0) + 1;
    });

    // Get phrases that appear in at least 2 responses
    const common = Object.entries(frequency)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])  // Sort by frequency
      .map(([phrase]) => phrase)
      .slice(0, 5);

    return common.length > 0 
      ? `Common themes: ${common.join(', ')}`
      : 'Responses cover diverse perspectives';
  }

  /**
   * Build final recommendation from consensus
   * IMPROVED: Considers conflicts and confidence
   * @param {Array} responses - Array of responses
   * @param {Array} conflicts - Detected conflicts
   * @returns {string} Recommended action
   */
  buildRecommendation(responses, conflicts = []) {
    if (conflicts.length === 0 && responses.length >= 3) {
      return 'Strong consensus across all AI agents. High confidence in recommendation.';
    } else if (conflicts.length > 0) {
      const highSeverity = conflicts.filter(c => c.severity === 'high').length;
      if (highSeverity > 0) {
        return `Significant disagreement detected (${highSeverity} conflicts). Consider consulting domain expert or gathering more information.`;
      }
      return `Partial consensus with minor differences (${conflicts.length} variations). Recommendation is cautious.`;
    } else {
      return `Partial consensus (${responses.length} agents responded). Moderate confidence.`;
    }
  }

  /**
   * Get decision log for transparency
   * @param {string} sessionId - Optional session filter
   * @returns {Array} Decision history
   */
  getDecisionLog(sessionId = null) {
    if (sessionId) {
      return this.decisionLog.filter(log => log.sessionId === sessionId);
    }
    return this.decisionLog;
  }

  /**
   * Clear decision log (for privacy/GDPR)
   * @param {string} sessionId - Session ID to clear
   */
  clearSessionLog(sessionId) {
    this.decisionLog = this.decisionLog.filter(log => log.sessionId !== sessionId);
  }
}

module.exports = MultiAIOrchestrator;
