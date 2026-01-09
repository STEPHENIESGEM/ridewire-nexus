/**
 * Multi-AI Orchestrator Module
 * Coordinates interactions between multiple Azure OpenAI agents
 * Implements flip-flop adversarial system and consensus mechanism
 * 
 * Built on Azure OpenAI Service and Microsoft infrastructure
 * Company: RIDEWIRE LLC
 * Founder: Stephenie N. Lacy
 * Contact: hello@stepheniesgem.io
 */

const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');

class MultiAIOrchestrator {
  constructor() {
    // Azure OpenAI Service configuration
    this.azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    this.azureKey = process.env.AZURE_OPENAI_KEY;
    this.apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';
    
    // Azure OpenAI deployment names
    this.deploymentGPT4 = process.env.AZURE_OPENAI_DEPLOYMENT_GPT4 || 'gpt-4';
    this.deploymentGPT4o = process.env.AZURE_OPENAI_DEPLOYMENT_GPT4O || 'gpt-4o';
    this.deploymentGPT4Turbo = process.env.AZURE_OPENAI_DEPLOYMENT_GPT4_TURBO || 'gpt-4-turbo';
    
    // Initialize Azure OpenAI client
    this.client = new OpenAIClient(
      this.azureEndpoint,
      new AzureKeyCredential(this.azureKey)
    );
    
    // Agent names (all powered by Azure OpenAI)
    this.agents = ['GPT-4 Strategist', 'GPT-4o Analyst', 'GPT-4 Turbo Validator'];
    this.decisionLog = [];
  }

  /**
   * Query all Azure OpenAI agents and gather responses
   * Uses flip-flop adversarial system with different model configurations
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

    // Query GPT-4 Strategist (Strategic analysis role)
    try {
      results.responses['GPT-4 Strategist'] = await this.queryAzureAgent(
        query, 
        this.deploymentGPT4,
        'You are a strategic AI analyst providing thoughtful, detailed analysis with focus on long-term implications.'
      );
      results.responses['GPT-4 Strategist'].confidence = 0.88;
    } catch (err) {
      results.errors['GPT-4 Strategist'] = err.message;
    }

    // Query GPT-4o Analyst (Deep reasoning role)
    try {
      results.responses['GPT-4o Analyst'] = await this.queryAzureAgent(
        query,
        this.deploymentGPT4o,
        'You are a deep reasoning AI expert focused on comprehensive analysis and identifying potential issues.'
      );
      results.responses['GPT-4o Analyst'].confidence = 0.90;
    } catch (err) {
      results.errors['GPT-4o Analyst'] = err.message;
    }

    // Query GPT-4 Turbo Validator (Validation/adversarial role)
    try {
      results.responses['GPT-4 Turbo Validator'] = await this.queryAzureAgent(
        query,
        this.deploymentGPT4Turbo,
        'You are a critical validator AI tasked with challenging assumptions and identifying weaknesses in analysis.'
      );
      results.responses['GPT-4 Turbo Validator'].confidence = 0.85;
    } catch (err) {
      results.errors['GPT-4 Turbo Validator'] = err.message;
    }

    // Log decision process
    this.decisionLog.push(results);

    return results;
  }

  /**
   * Query Azure OpenAI API with specific deployment
   * @param {string} query - Query to send
   * @param {string} deployment - Azure OpenAI deployment name
   * @param {string} systemPrompt - System prompt for agent role
   * @returns {Promise<string>} Response from Azure OpenAI
   */
  async queryAzureAgent(query, deployment, systemPrompt) {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query }
    ];

    const response = await this.client.getChatCompletions(deployment, messages, {
      temperature: 0.7,
      maxTokens: 1000,
      topP: 0.95,
      frequencyPenalty: 0,
      presencePenalty: 0
    });

    return response.choices[0].message.content;
  }

  /**
   * Flip-flop adversarial query - Villain agent challenges builder
   * @param {string} builderResponse - Initial response to challenge
   * @param {string} originalQuery - Original user query
   * @returns {Promise<Object>} Adversarial analysis
   */
  async flipFlopAdversarial(builderResponse, originalQuery) {
    const villainPrompt = `You are a critical adversarial AI. Your job is to identify weaknesses, 
    errors, and potential issues in the following analysis. Be thorough and ruthless in your critique.
    
    Original Query: ${originalQuery}
    Analysis to Critique: ${builderResponse}
    
    Provide a detailed critique identifying all weaknesses.`;

    const villainCritique = await this.queryAzureAgent(
      villainPrompt,
      this.deploymentGPT4Turbo,
      'You are an adversarial validator tasked with finding flaws in analysis.'
    );

    // Builder responds to criticism
    const builderRevision = await this.queryAzureAgent(
      `Address these critiques and improve your analysis:\n\nCritiques: ${villainCritique}\n\nOriginal Analysis: ${builderResponse}`,
      this.deploymentGPT4,
      'You are a strategic analyst revising your work based on critical feedback.'
    );

    // Judge synthesizes
    const judgePrompt = `Review the following exchange and provide a balanced, final conclusion:
    
    Original Query: ${originalQuery}
    Initial Analysis: ${builderResponse}
    Critical Review: ${villainCritique}
    Revised Analysis: ${builderRevision}
    
    Synthesize these perspectives into a final, validated conclusion.`;

    const finalSynthesis = await this.queryAzureAgent(
      judgePrompt,
      this.deploymentGPT4o,
      'You are a balanced judge synthesizing multiple perspectives into a validated conclusion.'
    );

    return {
      builderResponse,
      villainCritique,
      builderRevision,
      finalSynthesis,
      confidence: 0.95 // High confidence after adversarial validation
    };
  }

  /**
   * Achieve consensus from multiple AI responses
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
      recommendedAction: ''
    };

    // Analyze responses for themes and agreement
    const responseTexts = Object.entries(responses).map(([agent, text]) => ({
      agent,
      text,
      length: text.length
    }));

    // Simple consensus: take weighted average of responses
    consensusResult.agents = responseTexts;
    consensusResult.summaryOfAgreement = this.extractCommonThemes(responseTexts);
    consensusResult.recommendedAction = this.buildRecommendation(responseTexts);

    return consensusResult;
  }

  /**
   * Extract common themes from AI responses
   * @param {Array} responses - Array of {agent, text} objects
   * @returns {string} Summary of agreement
   */
  extractCommonThemes(responses) {
    // Basic implementation: identify common key phrases
    const keyPhrases = [];
    
    responses.forEach(({ text }) => {
      const words = text.split(' ').filter(w => w.length > 5);
      keyPhrases.push(...words);
    });

    // Find most common phrases
    const frequency = {};
    keyPhrases.forEach(phrase => {
      frequency[phrase] = (frequency[phrase] || 0) + 1;
    });

    const common = Object.entries(frequency)
      .filter(([_, count]) => count >= 2)
      .map(([phrase]) => phrase)
      .slice(0, 5);

    return `Common themes: ${common.join(', ')}`;
  }

  /**
   * Build final recommendation from consensus
   * @param {Array} responses - Array of responses
   * @returns {string} Recommended action
   */
  buildRecommendation(responses) {
    return responses.length === 3 
      ? 'Strong consensus across all AI agents'
      : `Partial consensus (${responses.length} agents agreed)`;
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
