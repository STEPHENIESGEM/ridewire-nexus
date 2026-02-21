/**
 * Model Providers Configuration
 * API endpoints and configurations for open-source LLM providers
 * Cost tracking and provider-specific settings
 */

const modelProviders = {
  // FREE - Cerebras Llama 3.1 70B (Fastest inference on Earth)
  cerebras: {
    name: 'Cerebras',
    model: 'llama3.1-70b',
    endpoint: 'https://api.cerebras.ai/v1/chat/completions',
    apiKeyEnv: 'CEREBRAS_API_KEY',
    cost: 0, // FREE - unlimited
    maxTokens: 1000,
    temperature: 0.7,
    timeout: 30000, // 30 seconds
    retries: 3,
    description: 'Cerebras Llama 3.1 70B - Free, fastest inference',
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    formatRequest: (query) => ({
      model: 'llama3.1-70b',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert automotive diagnostic AI assistant. Provide detailed, accurate analysis of vehicle issues including OBD2 codes, symptoms, and repair recommendations.' 
        },
        { role: 'user', content: query }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }),
    parseResponse: (data) => data.choices[0].message.content
  },

  // FREE - Groq Llama 3.1 70B (14,400 free requests/day)
  groq: {
    name: 'Groq',
    model: 'llama-3.1-70b-versatile',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    apiKeyEnv: 'GROQ_API_KEY',
    cost: 0, // FREE - 14,400 requests/day
    maxTokens: 1000,
    temperature: 0.7,
    timeout: 30000,
    retries: 3,
    description: 'Groq Llama 3.1 70B - Free tier, very fast',
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    formatRequest: (query) => ({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert automotive diagnostic AI assistant. Provide detailed, accurate analysis of vehicle issues including OBD2 codes, symptoms, and repair recommendations.' 
        },
        { role: 'user', content: query }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }),
    parseResponse: (data) => data.choices[0].message.content
  },

  // PAID - Together.ai Mixtral 8x22B ($0.0012/query)
  together: {
    name: 'Together.ai',
    model: 'mistralai/Mixtral-8x22B-Instruct-v0.1',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    apiKeyEnv: 'TOGETHER_API_KEY',
    cost: 0.0012, // ~$0.0012 per query
    maxTokens: 1000,
    temperature: 0.7,
    timeout: 30000,
    retries: 3,
    description: 'Together.ai Mixtral 8x22B - High quality, low cost',
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    formatRequest: (query) => ({
      model: 'mistralai/Mixtral-8x22B-Instruct-v0.1',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert automotive diagnostic AI assistant. Provide detailed, accurate analysis of vehicle issues including OBD2 codes, symptoms, and repair recommendations.' 
        },
        { role: 'user', content: query }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }),
    parseResponse: (data) => data.choices[0].message.content
  },

  // TIEBREAKER - OpenAI GPT-4o-mini (Only when needed)
  openai_tiebreaker: {
    name: 'OpenAI (Tiebreaker)',
    model: 'gpt-4o-mini',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    apiKeyEnv: 'OPENAI_API_KEY',
    cost: 0.0015, // ~$0.0015 per query
    maxTokens: 1000,
    temperature: 0.7,
    timeout: 30000,
    retries: 3,
    description: 'OpenAI GPT-4o-mini - Tiebreaker only',
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    formatRequest: (query) => ({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert automotive diagnostic AI assistant. Provide detailed, accurate analysis of vehicle issues including OBD2 codes, symptoms, and repair recommendations.' 
        },
        { role: 'user', content: query }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }),
    parseResponse: (data) => data.choices[0].message.content
  }
};

/**
 * Get provider configuration by name
 * @param {string} providerName - Provider name (cerebras, groq, together, openai_tiebreaker)
 * @returns {Object} Provider configuration
 */
function getProvider(providerName) {
  const provider = modelProviders[providerName];
  if (!provider) {
    throw new Error(`Unknown provider: ${providerName}`);
  }
  return provider;
}

/**
 * Get all primary providers (excluding tiebreaker)
 * @returns {Array} Array of primary provider configurations
 */
function getPrimaryProviders() {
  return [
    modelProviders.cerebras,
    modelProviders.groq,
    modelProviders.together
  ];
}

/**
 * Get tiebreaker provider
 * @returns {Object} Tiebreaker provider configuration
 */
function getTiebreakerProvider() {
  return modelProviders.openai_tiebreaker;
}

/**
 * Calculate total cost of a query
 * @param {Array} providers - Array of provider names used
 * @param {boolean} usedTiebreaker - Whether tiebreaker was used
 * @returns {number} Total cost in dollars
 */
function calculateCost(providers, usedTiebreaker = false) {
  let totalCost = 0;
  
  providers.forEach(providerName => {
    const provider = modelProviders[providerName];
    if (provider) {
      totalCost += provider.cost;
    }
  });
  
  if (usedTiebreaker) {
    totalCost += modelProviders.openai_tiebreaker.cost;
  }
  
  return totalCost;
}

/**
 * Get provider statistics summary
 * @returns {Object} Statistics object
 */
function getProviderStats() {
  return {
    primaryProviders: getPrimaryProviders().map(p => ({
      name: p.name,
      model: p.model,
      cost: p.cost,
      description: p.description
    })),
    tiebreaker: {
      name: modelProviders.openai_tiebreaker.name,
      model: modelProviders.openai_tiebreaker.model,
      cost: modelProviders.openai_tiebreaker.cost,
      description: modelProviders.openai_tiebreaker.description
    },
    totalMonthlyCost: {
      optimistic: '$0 (all free tier)',
      realistic: '$80-110 (10% Together.ai, 5-10% tiebreaker)',
      pessimistic: '$150 (higher tiebreaker usage)'
    }
  };
}

module.exports = {
  modelProviders,
  getProvider,
  getPrimaryProviders,
  getTiebreakerProvider,
  calculateCost,
  getProviderStats
};
