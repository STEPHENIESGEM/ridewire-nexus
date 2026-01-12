/**
 * Test script for War Room Demo Orchestration
 * Validates system break injection, self-diagnosis, and demo flow
 */

// Load modules with error handling
let SystemBreakSimulator, SelfDiagnostics, DemoOrchestrator;
try {
  SystemBreakSimulator = require('./systemBreakSimulator');
  SelfDiagnostics = require('./selfDiagnostics');
  DemoOrchestrator = require('./demoOrchestrator');
} catch (err) {
  console.error('❌ Failed to load required modules:', err.message);
  console.error('   Make sure you are in the correct directory and all files exist.');
  process.exit(1);
}

// Mock MultiAIOrchestrator for testing
class MockMultiAIOrchestrator {
  constructor() {
    this.agents = ['ChatGPT', 'Claude', 'Gemini'];
  }

  async queryAllAgents(query, sessionId) {
    return {
      sessionId,
      timestamp: new Date().toISOString(),
      responses: {
        ChatGPT: { content: 'Test response from ChatGPT', confidence: 0.85 },
        Claude: { content: 'Test response from Claude', confidence: 0.88 },
        Gemini: { content: 'Test response from Gemini', confidence: 0.82 }
      },
      errors: {}
    };
  }
}

console.log('='.repeat(80));
console.log('WAR ROOM DEMO ORCHESTRATION TEST SUITE');
console.log('='.repeat(80));
console.log();

// Test 1: System Break Simulator
console.log('TEST 1: System Break Simulator');
console.log('-'.repeat(80));

const simulator = new SystemBreakSimulator();

console.log('✓ SystemBreakSimulator instantiated');

// Test API latency injection
const break1 = simulator.injectAPILatency('ChatGPT', 1500);
console.log(`✓ API latency injected: ${break1.id} (${break1.delayMs}ms)`);

// Test partial outage injection
const break2 = simulator.injectPartialOutage('Gemini', 3000);
console.log(`✓ Partial outage injected: ${break2.id} (${break2.durationMs}ms)`);

// Test corrupt signal injection
const break3 = simulator.injectCorruptSignal('Claude');
console.log(`✓ Corrupt signal injected: ${break3.id}`);

// Check active breaks
const activeBreaks = simulator.getActiveBreaks();
console.log(`✓ Active breaks: ${activeBreaks.length}`);

// Test system health
const health = simulator.getSystemHealth();
console.log(`✓ System health: ${health.systemStatus} (${health.activeBreaks} active)`);

// Test manual repair
const repair1 = simulator.repairBreak(break1.id, 'manual');
console.log(`✓ Break repaired: ${repair1.breakId} in ${repair1.durationSeconds}s`);

// Test repair log
const repairLog = simulator.getRepairLog();
console.log(`✓ Repair log entries: ${repairLog.length}`);

console.log();

// Test 2: Self-Diagnostics
console.log('TEST 2: Self-Diagnostics Module');
console.log('-'.repeat(80));

const diagnostics = new SelfDiagnostics(simulator);
console.log('✓ SelfDiagnostics instantiated');

// Perform health check
const healthCheck = diagnostics.performHealthCheck();
console.log(`✓ Health check performed: ${healthCheck.systemStatus}`);

// Diagnose specific agent
const agentDiag = diagnostics.diagnoseAgent('ChatGPT');
console.log(`✓ Agent diagnosis: ${agentDiag.agent} - ${agentDiag.status}`);

// Get diagnostic insights
const insights = diagnostics.getDiagnosticInsights();
console.log(`✓ Diagnostic insights: ${insights.summary.activeIssues} active issues`);

// Get live report
const liveReport = diagnostics.getLiveReport();
console.log(`✓ Live report: ${liveReport.headline}`);

console.log();

// Test 3: Demo Orchestrator
console.log('TEST 3: Demo Orchestrator');
console.log('-'.repeat(80));

const mockMultiAI = new MockMultiAIOrchestrator();
const orchestrator = new DemoOrchestrator(mockMultiAI);
console.log('✓ DemoOrchestrator instantiated');

// Initialize demo
const init = orchestrator.initializeDemo();
console.log(`✓ Demo initialized: ${init.scenario}`);

// Test scene execution
async function testScenes() {
  try {
    console.log('✓ Testing Scene 1: Problem Injection');
    const scene1 = await orchestrator.executeScene1_ProblemInjection();
    console.log(`  - Scene 1 completed in ${(scene1.duration / 1000).toFixed(2)}s`);
    console.log(`  - Primary fault: ${scene1.primaryFault.code}`);

    console.log('✓ Testing Scene 2: AI Analysis');
    const scene2 = await orchestrator.executeScene2_AIAnalysis();
    console.log(`  - Scene 2 completed in ${(scene2.duration / 1000).toFixed(2)}s`);
    console.log(`  - Consensus confidence: ${scene2.consensus.confidence}`);

    console.log('✓ Testing Scene 3: Self-Healing');
    const scene3 = await orchestrator.executeScene3_SelfHealing();
    console.log(`  - Scene 3 completed in ${(scene3.duration / 1000).toFixed(2)}s`);
    console.log(`  - Repairs performed: ${scene3.repairLog.length}`);

    console.log('✓ Testing Scene 4: Business Impact');
    const scene4 = await orchestrator.executeScene4_BusinessImpact();
    console.log(`  - Scene 4 completed in ${(scene4.duration / 1000).toFixed(2)}s`);
    console.log(`  - Customer savings: ${scene4.businessMetrics.customer.savings}`);

    // Get live status
    const status = orchestrator.getLiveStatus();
    console.log(`✓ Live status retrieved: ${status.timestamp}`);

    // Reset demo
    orchestrator.resetDemo();
    console.log('✓ Demo reset successfully');

    console.log();
    console.log('='.repeat(80));
    console.log('ALL TESTS PASSED ✓');
    console.log('='.repeat(80));
    console.log();
    console.log('SUMMARY:');
    console.log('  - System Break Simulator: OPERATIONAL');
    console.log('  - Self-Diagnostics Module: OPERATIONAL');
    console.log('  - Demo Orchestrator: OPERATIONAL');
    console.log('  - All 4 demo scenes: FUNCTIONAL');
    console.log();
    console.log('READY FOR PHASE C: Visual Refinement');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testScenes();
