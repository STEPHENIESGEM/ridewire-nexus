/**
 * System Break Simulator Module
 * Injects real-time failures, API latencies, partial outages, and corrupt signals
 * for demonstrating self-diagnosis capabilities during investor demos
 */

class SystemBreakSimulator {
  constructor() {
    this.activeBreaks = new Map();
    this.breakLog = [];
    this.repairLog = [];
    this.breakagePatterns = {
      API_LATENCY: 'api_latency',
      PARTIAL_OUTAGE: 'partial_outage',
      CORRUPT_SIGNAL: 'corrupt_signal',
      NETWORK_TIMEOUT: 'network_timeout',
      RATE_LIMIT: 'rate_limit',
      MALFORMED_RESPONSE: 'malformed_response'
    };
  }

  /**
   * Inject API latency into a request
   * @param {string} agentName - Name of the AI agent (ChatGPT, Claude, Gemini)
   * @param {number} delayMs - Delay in milliseconds
   * @returns {Object} Break injection details
   */
  injectAPILatency(agentName, delayMs = 2000) {
    const breakId = `latency_${agentName}_${Date.now()}`;
    const breakDetails = {
      id: breakId,
      type: this.breakagePatterns.API_LATENCY,
      agent: agentName,
      delayMs,
      injectedAt: new Date().toISOString(),
      status: 'active'
    };

    this.activeBreaks.set(breakId, breakDetails);
    this.logBreak(breakDetails);

    return breakDetails;
  }

  /**
   * Simulate partial outage (agent unavailable)
   * @param {string} agentName - Name of the AI agent
   * @param {number} durationMs - Duration of outage
   * @returns {Object} Break injection details
   */
  injectPartialOutage(agentName, durationMs = 5000) {
    const breakId = `outage_${agentName}_${Date.now()}`;
    const breakDetails = {
      id: breakId,
      type: this.breakagePatterns.PARTIAL_OUTAGE,
      agent: agentName,
      durationMs,
      injectedAt: new Date().toISOString(),
      status: 'active',
      recoveryExpected: new Date(Date.now() + durationMs).toISOString()
    };

    this.activeBreaks.set(breakId, breakDetails);
    this.logBreak(breakDetails);

    // Auto-recover after duration
    setTimeout(() => {
      this.repairBreak(breakId, 'auto_recovery');
    }, durationMs);

    return breakDetails;
  }

  /**
   * Inject corrupt signal (malformed API response)
   * @param {string} agentName - Name of the AI agent
   * @returns {Object} Break injection details
   */
  injectCorruptSignal(agentName) {
    const breakId = `corrupt_${agentName}_${Date.now()}`;
    const breakDetails = {
      id: breakId,
      type: this.breakagePatterns.CORRUPT_SIGNAL,
      agent: agentName,
      injectedAt: new Date().toISOString(),
      status: 'active',
      corruptionType: 'malformed_json'
    };

    this.activeBreaks.set(breakId, breakDetails);
    this.logBreak(breakDetails);

    return breakDetails;
  }

  /**
   * Inject network timeout
   * @param {string} agentName - Name of the AI agent
   * @returns {Object} Break injection details
   */
  injectNetworkTimeout(agentName) {
    const breakId = `timeout_${agentName}_${Date.now()}`;
    const breakDetails = {
      id: breakId,
      type: this.breakagePatterns.NETWORK_TIMEOUT,
      agent: agentName,
      injectedAt: new Date().toISOString(),
      status: 'active'
    };

    this.activeBreaks.set(breakId, breakDetails);
    this.logBreak(breakDetails);

    return breakDetails;
  }

  /**
   * Inject rate limit error
   * @param {string} agentName - Name of the AI agent
   * @returns {Object} Break injection details
   */
  injectRateLimit(agentName) {
    const breakId = `ratelimit_${agentName}_${Date.now()}`;
    const breakDetails = {
      id: breakId,
      type: this.breakagePatterns.RATE_LIMIT,
      agent: agentName,
      injectedAt: new Date().toISOString(),
      status: 'active',
      retryAfter: 60
    };

    this.activeBreaks.set(breakId, breakDetails);
    this.logBreak(breakDetails);

    return breakDetails;
  }

  /**
   * Apply active breaks to an API call
   * @param {string} agentName - Name of the AI agent
   * @param {Function} apiCall - API call function to wrap
   * @returns {Promise} Modified API call result
   */
  async applyBreaks(agentName, apiCall) {
    const activeAgentBreaks = Array.from(this.activeBreaks.values())
      .filter(b => b.agent === agentName && b.status === 'active');

    if (activeAgentBreaks.length === 0) {
      return await apiCall();
    }

    // Apply breaks in order of severity
    for (const breakDetail of activeAgentBreaks) {
      switch (breakDetail.type) {
        case this.breakagePatterns.API_LATENCY:
          await this.simulateDelay(breakDetail.delayMs);
          break;

        case this.breakagePatterns.PARTIAL_OUTAGE:
          throw new Error(`Service temporarily unavailable: ${agentName}`);

        case this.breakagePatterns.NETWORK_TIMEOUT:
          throw new Error(`Network timeout: ${agentName}`);

        case this.breakagePatterns.RATE_LIMIT:
          throw new Error(`Rate limit exceeded: ${agentName}. Retry after ${breakDetail.retryAfter}s`);

        case this.breakagePatterns.CORRUPT_SIGNAL:
          // Return malformed response
          return { error: 'malformed_response', data: 'CORRUPT_DATA_0x' + Math.random().toString(16).substring(2, 10) };
      }
    }

    return await apiCall();
  }

  /**
   * Repair a break (manual or auto)
   * @param {string} breakId - ID of the break to repair
   * @param {string} repairMethod - Method used for repair
   * @returns {Object} Repair details
   */
  repairBreak(breakId, repairMethod = 'manual') {
    const breakDetails = this.activeBreaks.get(breakId);
    if (!breakDetails) {
      return { error: 'Break not found', breakId };
    }

    const repairTime = Date.now();
    const injectedTime = new Date(breakDetails.injectedAt).getTime();
    const durationMs = repairTime - injectedTime;

    breakDetails.status = 'repaired';
    breakDetails.repairedAt = new Date().toISOString();
    breakDetails.repairMethod = repairMethod;
    breakDetails.durationMs = durationMs;

    const repairDetails = {
      breakId,
      breakType: breakDetails.type,
      agent: breakDetails.agent,
      repairedAt: breakDetails.repairedAt,
      repairMethod,
      durationMs,
      durationSeconds: (durationMs / 1000).toFixed(3)
    };

    this.repairLog.push(repairDetails);
    this.activeBreaks.delete(breakId);

    console.log(`[SELF-REPAIR] ${breakDetails.type} on ${breakDetails.agent} repaired in ${repairDetails.durationSeconds}s`);

    return repairDetails;
  }

  /**
   * Get all active breaks
   * @returns {Array} List of active breaks
   */
  getActiveBreaks() {
    return Array.from(this.activeBreaks.values());
  }

  /**
   * Get break log
   * @returns {Array} Historical break log
   */
  getBreakLog() {
    return this.breakLog;
  }

  /**
   * Get repair log with timestamps
   * @returns {Array} Historical repair log
   */
  getRepairLog() {
    return this.repairLog;
  }

  /**
   * Clear all breaks (for demo reset)
   */
  clearAllBreaks() {
    this.activeBreaks.clear();
    this.breakLog = [];
    this.repairLog = [];
    console.log('[SIMULATOR] All breaks cleared');
  }

  /**
   * Log break injection
   * @param {Object} breakDetails - Details of the break
   */
  logBreak(breakDetails) {
    this.breakLog.push({
      ...breakDetails,
      loggedAt: new Date().toISOString()
    });
    console.log(`[BREAK INJECTED] ${breakDetails.type} on ${breakDetails.agent} at ${breakDetails.injectedAt}`);
  }

  /**
   * Simulate delay
   * @param {number} ms - Milliseconds to delay
   */
  async simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get system health status
   * @returns {Object} System health metrics
   */
  getSystemHealth() {
    const activeCount = this.activeBreaks.size;
    const totalBreaks = this.breakLog.length;
    const totalRepairs = this.repairLog.length;
    const avgRepairTime = totalRepairs > 0
      ? this.repairLog.reduce((sum, r) => sum + r.durationMs, 0) / totalRepairs / 1000
      : 0;

    return {
      timestamp: new Date().toISOString(),
      activeBreaks: activeCount,
      totalBreaksInjected: totalBreaks,
      totalRepairs,
      averageRepairTimeSeconds: avgRepairTime.toFixed(3),
      systemStatus: activeCount === 0 ? 'healthy' : 'degraded',
      uptime: totalRepairs / Math.max(totalBreaks, 1) * 100
    };
  }
}

module.exports = SystemBreakSimulator;
