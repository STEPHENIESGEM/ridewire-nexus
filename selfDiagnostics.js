/**
 * Self-Diagnostics Module
 * Monitors system health, detects failures, and initiates auto-repair
 * Provides sub-second repair logs with timestamps
 */

class SelfDiagnostics {
  constructor(systemBreakSimulator) {
    this.simulator = systemBreakSimulator;
    this.diagnosticLog = [];
    this.healthChecks = [];
    this.autoRepairEnabled = true;
    this.monitoringInterval = null;
    this.checkIntervalMs = 1000; // Check every second
  }

  /**
   * Start continuous system monitoring
   */
  startMonitoring() {
    if (this.monitoringInterval) {
      console.log('[SELF-DIAGNOSTICS] Monitoring already active');
      return;
    }

    console.log('[SELF-DIAGNOSTICS] Starting continuous monitoring');
    this.monitoringInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.checkIntervalMs);
  }

  /**
   * Stop continuous monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('[SELF-DIAGNOSTICS] Monitoring stopped');
    }
  }

  /**
   * Perform health check and log results
   * @returns {Object} Health check results
   */
  performHealthCheck() {
    const timestamp = new Date().toISOString();
    const activeBreaks = this.simulator.getActiveBreaks();
    const systemHealth = this.simulator.getSystemHealth();

    const healthCheck = {
      timestamp,
      systemStatus: systemHealth.systemStatus,
      activeBreaksCount: activeBreaks.length,
      activeBreaks: activeBreaks.map(b => ({
        id: b.id,
        type: b.type,
        agent: b.agent,
        age: this.calculateAge(b.injectedAt)
      })),
      metrics: {
        totalBreaks: systemHealth.totalBreaksInjected,
        totalRepairs: systemHealth.totalRepairs,
        avgRepairTime: systemHealth.averageRepairTimeSeconds,
        uptime: systemHealth.uptime
      }
    };

    this.healthChecks.push(healthCheck);

    // Auto-repair if enabled and issues detected
    if (this.autoRepairEnabled && activeBreaks.length > 0) {
      this.attemptAutoRepair(activeBreaks);
    }

    return healthCheck;
  }

  /**
   * Attempt auto-repair on detected breaks
   * @param {Array} activeBreaks - List of active breaks to repair
   */
  attemptAutoRepair(activeBreaks) {
    for (const breakDetail of activeBreaks) {
      // Only auto-repair specific types
      const autoRepairableTypes = [
        'api_latency',
        'network_timeout',
        'rate_limit'
      ];

      if (autoRepairableTypes.includes(breakDetail.type)) {
        const age = this.calculateAge(breakDetail.injectedAt);
        
        // Auto-repair if break has existed for more than 3 seconds
        if (age > 3000) {
          const repairStartTime = Date.now();
          const repairResult = this.simulator.repairBreak(breakDetail.id, 'auto_repair');
          const repairDuration = Date.now() - repairStartTime;

          const diagnosticEntry = {
            timestamp: new Date().toISOString(),
            action: 'auto_repair',
            breakId: breakDetail.id,
            breakType: breakDetail.type,
            agent: breakDetail.agent,
            breakAge: age,
            repairDuration,
            repairDurationSeconds: (repairDuration / 1000).toFixed(3),
            status: 'success'
          };

          this.diagnosticLog.push(diagnosticEntry);
          console.log(`[AUTO-REPAIR] ${breakDetail.type} on ${breakDetail.agent} fixed in ${diagnosticEntry.repairDurationSeconds}s`);
        }
      }
    }
  }

  /**
   * Diagnose specific agent health
   * @param {string} agentName - Name of the AI agent to diagnose
   * @returns {Object} Agent diagnostic results
   */
  diagnoseAgent(agentName) {
    const activeBreaks = this.simulator.getActiveBreaks()
      .filter(b => b.agent === agentName);
    
    const breakLog = this.simulator.getBreakLog()
      .filter(b => b.agent === agentName);
    
    const repairLog = this.simulator.getRepairLog()
      .filter(r => r.agent === agentName);

    const avgRepairTime = repairLog.length > 0
      ? repairLog.reduce((sum, r) => sum + parseFloat(r.durationSeconds), 0) / repairLog.length
      : 0;

    return {
      agent: agentName,
      timestamp: new Date().toISOString(),
      status: activeBreaks.length === 0 ? 'healthy' : 'degraded',
      activeBreaks: activeBreaks.length,
      totalBreaks: breakLog.length,
      totalRepairs: repairLog.length,
      averageRepairTimeSeconds: avgRepairTime.toFixed(3),
      reliability: repairLog.length > 0 ? (repairLog.length / breakLog.length * 100).toFixed(2) : 100,
      recentBreaks: activeBreaks
    };
  }

  /**
   * Get diagnostic insights for demo visualization
   * @returns {Object} Diagnostic insights
   */
  getDiagnosticInsights() {
    const systemHealth = this.simulator.getSystemHealth();
    const activeBreaks = this.simulator.getActiveBreaks();
    const repairLog = this.simulator.getRepairLog();

    // Calculate insights
    const recentRepairs = repairLog.slice(-10);
    const fastestRepair = repairLog.reduce((min, r) => 
      r.durationMs < min ? r.durationMs : min, Infinity);
    const slowestRepair = repairLog.reduce((max, r) => 
      r.durationMs > max ? r.durationMs : max, 0);

    return {
      timestamp: new Date().toISOString(),
      systemStatus: systemHealth.systemStatus,
      summary: {
        activeIssues: activeBreaks.length,
        totalIncidents: systemHealth.totalBreaksInjected,
        resolvedIncidents: systemHealth.totalRepairs,
        resolutionRate: systemHealth.uptime.toFixed(2) + '%',
        averageRepairTime: systemHealth.averageRepairTimeSeconds + 's',
        fastestRepair: fastestRepair !== Infinity ? (fastestRepair / 1000).toFixed(3) + 's' : 'N/A',
        slowestRepair: slowestRepair > 0 ? (slowestRepair / 1000).toFixed(3) + 's' : 'N/A'
      },
      recentActivity: recentRepairs.map(r => ({
        type: r.breakType,
        agent: r.agent,
        repaired: r.repairedAt,
        duration: r.durationSeconds + 's',
        method: r.repairMethod
      })),
      activeIssues: activeBreaks.map(b => ({
        id: b.id,
        type: b.type,
        agent: b.agent,
        injectedAt: b.injectedAt,
        age: this.formatAge(this.calculateAge(b.injectedAt))
      }))
    };
  }

  /**
   * Calculate age of a break in milliseconds
   * @param {string} injectedAt - ISO timestamp
   * @returns {number} Age in milliseconds
   */
  calculateAge(injectedAt) {
    return Date.now() - new Date(injectedAt).getTime();
  }

  /**
   * Format age for display
   * @param {number} ageMs - Age in milliseconds
   * @returns {string} Formatted age
   */
  formatAge(ageMs) {
    const seconds = Math.floor(ageMs / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  }

  /**
   * Get diagnostic log
   * @returns {Array} Diagnostic log entries
   */
  getDiagnosticLog() {
    return this.diagnosticLog;
  }

  /**
   * Get health check history
   * @returns {Array} Health check history
   */
  getHealthCheckHistory() {
    return this.healthChecks;
  }

  /**
   * Enable/disable auto-repair
   * @param {boolean} enabled - Whether to enable auto-repair
   */
  setAutoRepair(enabled) {
    this.autoRepairEnabled = enabled;
    console.log(`[SELF-DIAGNOSTICS] Auto-repair ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Clear all diagnostic logs
   */
  clearLogs() {
    this.diagnosticLog = [];
    this.healthChecks = [];
    console.log('[SELF-DIAGNOSTICS] All logs cleared');
  }

  /**
   * Generate live diagnostics report for War Room display
   * @returns {Object} Live diagnostics report
   */
  getLiveReport() {
    const insights = this.getDiagnosticInsights();
    const recentHealthChecks = this.healthChecks.slice(-5);

    return {
      timestamp: new Date().toISOString(),
      status: insights.systemStatus,
      headline: this.generateHeadline(insights),
      metrics: insights.summary,
      timeline: insights.recentActivity,
      activeAlerts: insights.activeIssues,
      healthTrend: recentHealthChecks.map(hc => ({
        time: hc.timestamp,
        status: hc.systemStatus,
        activeBreaks: hc.activeBreaksCount
      })),
      recommendation: this.generateRecommendation(insights)
    };
  }

  /**
   * Generate headline for live report
   * @param {Object} insights - Diagnostic insights
   * @returns {string} Headline
   */
  generateHeadline(insights) {
    if (insights.activeIssues.length === 0) {
      return '✅ All systems operational';
    } else if (insights.activeIssues.length === 1) {
      return `⚠️ 1 active issue detected - auto-repair in progress`;
    } else {
      return `⚠️ ${insights.activeIssues.length} active issues detected - self-healing initiated`;
    }
  }

  /**
   * Generate recommendation based on system state
   * @param {Object} insights - Diagnostic insights
   * @returns {string} Recommendation
   */
  generateRecommendation(insights) {
    if (insights.activeIssues.length === 0) {
      return 'System operating at peak performance. No action required.';
    }
    
    const oldestIssue = insights.activeIssues.reduce((oldest, issue) => {
      const age = this.calculateAge(issue.injectedAt);
      return age > oldest.age ? { issue, age } : oldest;
    }, { age: 0 });

    if (oldestIssue.age > 10000) {
      return `Critical: Issue "${oldestIssue.issue.type}" on ${oldestIssue.issue.agent} persisting for ${this.formatAge(oldestIssue.age)}. Manual intervention may be required.`;
    }

    return 'Auto-repair mechanisms engaged. System recovery in progress.';
  }
}

module.exports = SelfDiagnostics;
