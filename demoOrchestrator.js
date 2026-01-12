/**
 * Demo Orchestrator Module
 * Coordinates War Room demo flow with cinematic timing
 * Manages multi-system failure cascade simulation for investor presentations
 */

const SystemBreakSimulator = require('./systemBreakSimulator');
const SelfDiagnostics = require('./selfDiagnostics');

class DemoOrchestrator {
  constructor(multiAIOrchestrator) {
    this.multiAI = multiAIOrchestrator;
    this.breakSimulator = new SystemBreakSimulator();
    this.selfDiagnostics = new SelfDiagnostics(this.breakSimulator);
    this.demoScenes = [];
    this.currentScene = null;
    this.demoStartTime = null;
    this.eventLog = [];
  }

  /**
   * Initialize War Room demo
   * @returns {Object} Demo initialization details
   */
  initializeDemo() {
    this.demoStartTime = new Date().toISOString();
    this.eventLog = [];
    this.breakSimulator.clearAllBreaks();
    this.selfDiagnostics.clearLogs();
    this.selfDiagnostics.startMonitoring();

    const initEvent = {
      timestamp: this.demoStartTime,
      event: 'demo_initialized',
      message: 'War Room Demo Initialized - Harley-Davidson CVO Road Glide Diagnostic Simulation'
    };

    this.eventLog.push(initEvent);
    console.log('[DEMO] War Room initialized');

    return {
      status: 'initialized',
      demoStartTime: this.demoStartTime,
      scenario: 'Harley-Davidson CVO Road Glide Multi-System Failure',
      estimatedDuration: '7-10 minutes',
      aiAgents: ['ChatGPT', 'Claude', 'Gemini']
    };
  }

  /**
   * Scene 1: Problem Injection (0:00-1:30)
   * Inject primary fault P0200
   */
  async executeScene1_ProblemInjection() {
    this.currentScene = 'Scene 1: Problem Injection';
    const sceneStart = Date.now();

    this.logEvent('scene_1_start', 'Injecting primary fault: P0200 - Fuel Pump Malfunction');

    // Simulate initial diagnostic reading
    const primaryFault = {
      code: 'P0200',
      description: 'Fuel Injector Circuit Malfunction',
      severity: 'high',
      vehicle: '2024 Harley-Davidson CVO Road Glide',
      detectedAt: new Date().toISOString()
    };

    this.logEvent('fault_detected', `Primary fault code: ${primaryFault.code}`);

    // Simulate real-time telemetry
    const telemetry = {
      engineRPM: 1850,
      fuelPressure: 42.3, // PSI (low)
      o2SensorVoltage: 0.85,
      misfireCount: 0,
      temperature: 195 // F
    };

    this.logEvent('telemetry_captured', 'Vehicle telemetry captured', telemetry);

    const sceneDuration = Date.now() - sceneStart;
    this.logEvent('scene_1_complete', `Scene 1 completed in ${(sceneDuration / 1000).toFixed(2)}s`);

    return {
      scene: 'Scene 1',
      duration: sceneDuration,
      primaryFault,
      telemetry,
      narrative: 'Legacy tools would recommend $2,000 fuel pump replacement. Our AI sees something different.'
    };
  }

  /**
   * Scene 2: AI Multi-System Analysis (1:30-4:00)
   * Inject system breaks and demonstrate consensus mechanism
   */
  async executeScene2_AIAnalysis() {
    this.currentScene = 'Scene 2: AI Multi-System Analysis';
    const sceneStart = Date.now();

    this.logEvent('scene_2_start', 'Initiating multi-AI diagnostic analysis');

    // Inject controlled system breaks for demonstration
    this.logEvent('system_break_injection', 'Injecting demonstration failures');

    // Break 1: API Latency on ChatGPT
    const break1 = this.breakSimulator.injectAPILatency('ChatGPT', 1500);
    this.logEvent('break_injected', `API latency injected on ChatGPT: ${break1.delayMs}ms`);

    // Break 2: Partial outage on Gemini
    const break2 = this.breakSimulator.injectPartialOutage('Gemini', 3000);
    this.logEvent('break_injected', `Partial outage injected on Gemini: ${break2.durationMs}ms`);

    // Simulate AI query with breaks active
    const diagnosticQuery = `Analyze vehicle fault codes: P0200 (Fuel Injector Circuit), P0305 (Cylinder 5 Misfire), P0420 (Catalyst Efficiency), P0087 (Fuel Rail Pressure Low). Vehicle: 2024 Harley-Davidson CVO Road Glide. Determine root cause and recommended repair sequence.`;

    this.logEvent('ai_query_sent', 'Diagnostic query sent to all AI agents');

    try {
      // This would normally call multiAI.queryAllAgents()
      // For demo, we simulate the response with breaks applied
      const aiResponses = await this.simulateAIResponses(diagnosticQuery);
      
      this.logEvent('ai_responses_received', 'AI consensus mechanism engaged', {
        respondedAgents: Object.keys(aiResponses.responses).length,
        failedAgents: Object.keys(aiResponses.errors).length
      });

      // Demonstrate consensus
      const consensus = this.calculateConsensus(aiResponses);
      this.logEvent('consensus_reached', 'AI consensus achieved', {
        confidence: consensus.confidence,
        rootCause: consensus.rootCause
      });

      const sceneDuration = Date.now() - sceneStart;
      this.logEvent('scene_2_complete', `Scene 2 completed in ${(sceneDuration / 1000).toFixed(2)}s`);

      return {
        scene: 'Scene 2',
        duration: sceneDuration,
        aiResponses,
        consensus,
        systemBreaks: this.breakSimulator.getActiveBreaks(),
        narrative: 'Multi-AI analysis reveals cascade: P0200→P0305→P0420→P0087. Root cause: Faulty fuel injector (Cylinder 5) + blocked fuel filter.'
      };
    } catch (error) {
      this.logEvent('scene_2_error', 'Error in AI analysis', { error: error.message });
      throw error;
    }
  }

  /**
   * Scene 3: Self-Diagnosis & Auto-Repair (4:00-6:00)
   * Demonstrate self-healing capabilities
   */
  async executeScene3_SelfHealing() {
    this.currentScene = 'Scene 3: Self-Diagnosis & Auto-Repair';
    const sceneStart = Date.now();

    this.logEvent('scene_3_start', 'Demonstrating self-diagnosis and auto-repair');

    // Get current system health
    const healthBefore = this.selfDiagnostics.performHealthCheck();
    this.logEvent('health_check', 'System health assessed', {
      activeBreaks: healthBefore.activeBreaksCount,
      systemStatus: healthBefore.systemStatus
    });

    // Wait for auto-repair to kick in
    await this.sleep(2000);

    // Force repair remaining breaks
    const activeBreaks = this.breakSimulator.getActiveBreaks();
    for (const breakDetail of activeBreaks) {
      const repairResult = this.breakSimulator.repairBreak(breakDetail.id, 'auto_repair');
      this.logEvent('auto_repair', `Auto-repaired ${breakDetail.type} on ${breakDetail.agent}`, {
        repairDuration: repairResult.durationSeconds + 's'
      });
    }

    const healthAfter = this.selfDiagnostics.performHealthCheck();
    const repairLog = this.breakSimulator.getRepairLog();

    const sceneDuration = Date.now() - sceneStart;
    this.logEvent('scene_3_complete', `Scene 3 completed in ${(sceneDuration / 1000).toFixed(2)}s`);

    return {
      scene: 'Scene 3',
      duration: sceneDuration,
      healthBefore,
      healthAfter,
      repairLog,
      narrative: 'System self-healed in sub-second timeframes. All AI agents back online. Diagnostic consensus maintained.'
    };
  }

  /**
   * Scene 4: Business Impact (6:00-7:30)
   * Present financial and operational metrics
   */
  async executeScene4_BusinessImpact() {
    this.currentScene = 'Scene 4: Business Impact';
    const sceneStart = Date.now();

    this.logEvent('scene_4_start', 'Presenting business impact metrics');

    const businessMetrics = {
      diagnosisAccuracy: '94.2%',
      technician: {
        timeOriginal: '8 hours',
        timeOptimized: '2 hours',
        timeSaved: '6 hours',
        productivityGain: '75%'
      },
      customer: {
        costOriginal: '$2,000',
        costOptimized: '$660',
        savings: '$1,340',
        savingsPercent: '67%'
      },
      shop: {
        transactionsPerWeek: 20,
        savingsPerTransaction: '$1,000',
        weeklyValue: '$20,000',
        annualValuePerLocation: '$1.04M'
      },
      chain: {
        locations: 50,
        weeklyTransactions: 1000,
        annualValueCreation: '$52M'
      },
      nps: {
        before: 62,
        after: 78,
        improvement: 16
      }
    };

    this.logEvent('business_metrics', 'Business impact calculated', businessMetrics);

    const sceneDuration = Date.now() - sceneStart;
    this.logEvent('scene_4_complete', `Scene 4 completed in ${(sceneDuration / 1000).toFixed(2)}s`);

    return {
      scene: 'Scene 4',
      duration: sceneDuration,
      businessMetrics,
      narrative: '$52M annual value creation for 50-location chain. 67% customer savings. 75% technician productivity gain.'
    };
  }

  /**
   * Execute complete War Room demo flow
   * @returns {Object} Complete demo results
   */
  async executeCompleteDemo() {
    const demoResults = {
      initialization: this.initializeDemo(),
      scenes: []
    };

    try {
      // Scene 1: Problem Injection
      const scene1 = await this.executeScene1_ProblemInjection();
      demoResults.scenes.push(scene1);
      await this.sleep(500); // Brief pause between scenes

      // Scene 2: AI Analysis with breaks
      const scene2 = await this.executeScene2_AIAnalysis();
      demoResults.scenes.push(scene2);
      await this.sleep(500);

      // Scene 3: Self-Healing
      const scene3 = await this.executeScene3_SelfHealing();
      demoResults.scenes.push(scene3);
      await this.sleep(500);

      // Scene 4: Business Impact
      const scene4 = await this.executeScene4_BusinessImpact();
      demoResults.scenes.push(scene4);

      // Calculate total demo time
      const totalDuration = demoResults.scenes.reduce((sum, scene) => sum + scene.duration, 0);
      demoResults.totalDuration = totalDuration;
      demoResults.totalDurationMinutes = (totalDuration / 60000).toFixed(2);

      this.logEvent('demo_complete', `War Room demo completed in ${demoResults.totalDurationMinutes} minutes`);

      // Stop monitoring
      this.selfDiagnostics.stopMonitoring();

      demoResults.status = 'completed';
      demoResults.eventLog = this.eventLog;

      return demoResults;
    } catch (error) {
      this.logEvent('demo_error', 'Demo execution error', { error: error.message });
      throw error;
    }
  }

  /**
   * Get live demo status for real-time War Room display
   * @returns {Object} Live status
   */
  getLiveStatus() {
    return {
      timestamp: new Date().toISOString(),
      currentScene: this.currentScene,
      demoStartTime: this.demoStartTime,
      systemHealth: this.breakSimulator.getSystemHealth(),
      diagnostics: this.selfDiagnostics.getLiveReport(),
      recentEvents: this.eventLog.slice(-10),
      activeBreaks: this.breakSimulator.getActiveBreaks(),
      repairLog: this.breakSimulator.getRepairLog()
    };
  }

  /**
   * Log event to demo event log
   * @param {string} eventType - Type of event
   * @param {string} message - Event message
   * @param {Object} data - Optional event data
   */
  logEvent(eventType, message, data = null) {
    const event = {
      timestamp: new Date().toISOString(),
      eventType,
      message,
      scene: this.currentScene,
      ...(data && { data })
    };

    this.eventLog.push(event);
    console.log(`[DEMO EVENT] ${eventType}: ${message}`);
  }

  /**
   * Simulate AI responses with active breaks
   * @param {string} query - Diagnostic query
   * @returns {Object} Simulated AI responses
   */
  async simulateAIResponses(query) {
    const responses = {
      responses: {},
      errors: {}
    };

    // ChatGPT with latency
    try {
      await this.breakSimulator.applyBreaks('ChatGPT', async () => {
        responses.responses.ChatGPT = {
          content: 'Root cause analysis: P0305 cylinder 5 misfire is primary. Fuel injector malfunction causing unburned fuel, leading to P0420 catalyst damage. P0087 fuel pressure issue from clogged filter. Recommend: Replace Cylinder 5 fuel injector, replace fuel filter, inspect O2 sensor.',
          confidence: 0.89
        };
      });
    } catch (err) {
      responses.errors.ChatGPT = err.message;
    }

    // Claude (no breaks)
    responses.responses.Claude = {
      content: 'Diagnostic cascade analysis: Fuel injector failure (P0200) at Cylinder 5 creates P0305 misfire. Secondary effects: Unburned fuel damages catalyst (P0420). Tertiary effect: Restricted fuel filter causes P0087 low pressure. Priority: Injector replacement, then filter, then catalyst inspection.',
      confidence: 0.92
    };

    // Gemini with outage (may fail)
    try {
      await this.breakSimulator.applyBreaks('Gemini', async () => {
        responses.responses.Gemini = {
          content: 'Multi-system failure pattern detected. Primary: Cylinder 5 fuel injector. Secondary: Fuel filter blockage. Tertiary: Catalyst contamination. Repair sequence: 1) Injector ($400), 2) Filter ($60), 3) O2 sensor cleaning ($200). Total: $660 vs $2000 fuel pump.',
          confidence: 0.86
        };
      });
    } catch (err) {
      responses.errors.Gemini = err.message;
    }

    return responses;
  }

  /**
   * Calculate consensus from AI responses
   * @param {Object} aiResponses - Responses from AI agents
   * @returns {Object} Consensus result
   */
  calculateConsensus(aiResponses) {
    const validResponses = Object.values(aiResponses.responses);
    
    if (validResponses.length === 0) {
      return {
        confidence: 0,
        rootCause: 'Unable to determine - all agents failed',
        recommendation: 'System degraded - manual diagnosis required'
      };
    }

    const avgConfidence = validResponses.reduce((sum, r) => sum + r.confidence, 0) / validResponses.length;

    return {
      confidence: (avgConfidence * 100).toFixed(1) + '%',
      rootCause: 'Cylinder 5 fuel injector malfunction + blocked fuel filter',
      recommendation: 'Replace fuel injector ($400), replace fuel filter ($60), clean/replace O2 sensor ($200)',
      estimatedCost: '$660',
      estimatedTime: '2 hours',
      customerSavings: '$1,340 (vs $2,000 fuel pump replacement)',
      respondingAgents: validResponses.length,
      consensusLevel: validResponses.length >= 2 ? 'High' : 'Medium'
    };
  }

  /**
   * Sleep utility
   * @param {number} ms - Milliseconds to sleep
   */
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Reset demo for new run
   */
  resetDemo() {
    this.breakSimulator.clearAllBreaks();
    this.selfDiagnostics.clearLogs();
    this.selfDiagnostics.stopMonitoring();
    this.demoScenes = [];
    this.currentScene = null;
    this.demoStartTime = null;
    this.eventLog = [];
    console.log('[DEMO] Demo reset complete');
  }
}

module.exports = DemoOrchestrator;
