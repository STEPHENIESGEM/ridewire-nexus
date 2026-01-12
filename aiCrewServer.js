/**
 * AI CREW ORCHESTRATION SERVER
 * 
 * Runs 24/7 managing 7 autonomous AI agents
 * No human employees needed - full automation
 * 
 * Cost: $11K/year vs $3.35M for human team (99.66% savings)
 * Performance: 10-100x faster, never sleeps
 */

const express = require('express');
const cors = require('cors');
const AICrew = require('./aiCrew');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize AI Crew
const aiCrew = new AICrew();

console.log('\n🤖 ═══════════════════════════════════════════════');
console.log('   AI CREW ORCHESTRATION SERVER');
console.log('   ═══════════════════════════════════════════════');
console.log('   7 Autonomous AI Agents Operational');
console.log('   - Sales (CloseBot)');
console.log('   - Engineering (CodeCrew)');
console.log('   - Marketing (ViralBot)');
console.log('   - Support (SupportBot)');
console.log('   - Product (BuilderBot)');
console.log('   - Finance (MoneyBot)');
console.log('   - Legal (ComplianceBot)');
console.log('   ═══════════════════════════════════════════════\n');

// =============================================================================
// HUMAN OVERSIGHT ENDPOINTS (Minimal - only for strategic direction)
// =============================================================================

/**
 * GET /api/crew/status
 * View status of all AI agents
 */
app.get('/api/crew/status', async (req, res) => {
  try {
    const status = await aiCrew.getStatus();
    res.json({
      success: true,
      status,
      message: '7 AI agents operational 24/7'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/crew/command
 * Give high-level command to AI crew (human strategic input)
 * 
 * Examples:
 * - "Close 10 deals this week"
 * - "Build a mobile app"
 * - "Create viral marketing campaign"
 * - "Prepare Series A investor deck"
 */
app.post('/api/crew/command', async (req, res) => {
  try {
    const { command } = req.body;
    
    if (!command) {
      return res.status(400).json({ error: 'Command required' });
    }
    
    console.log(`\n🎯 Human command received: "${command}"`);
    
    const result = await aiCrew.executeCommand(command);
    
    res.json({
      success: true,
      command,
      result,
      message: 'AI agents executing command autonomously'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/crew/standup
 * Trigger daily standup (AI-to-AI status updates)
 */
app.post('/api/crew/standup', async (req, res) => {
  try {
    const updates = await aiCrew.dailyStandup();
    
    res.json({
      success: true,
      updates,
      message: 'Daily standup completed - all agents synchronized'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// AI-TO-AI COMMUNICATION ENDPOINTS (Agents use these to talk to each other)
// =============================================================================

/**
 * POST /api/crew/agent-prompt
 * One AI agent prompts another AI agent
 * 
 * Body:
 * {
 *   "from": "sales",
 *   "to": "marketing",
 *   "message": "I need a case study for this lead",
 *   "context": { "leadId": "...", "industry": "automotive" }
 * }
 */
app.post('/api/crew/agent-prompt', async (req, res) => {
  try {
    const { from, to, message, context } = req.body;
    
    const response = await aiCrew.agentPrompt({ from, to, message, context });
    
    res.json({
      success: true,
      from,
      to,
      response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/crew/assign-task
 * Assign task to specific AI agent
 * 
 * Body:
 * {
 *   "agent": "engineering",
 *   "task": "Build payment API integration",
 *   "priority": "high",
 *   "deadline": "2024-01-15T00:00:00Z"
 * }
 */
app.post('/api/crew/assign-task', async (req, res) => {
  try {
    const { agent, task, priority, deadline } = req.body;
    
    const result = await aiCrew.assignTask({ agent, task, priority, deadline });
    
    res.json({
      success: true,
      agent,
      task,
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// INDIVIDUAL AGENT ENDPOINTS (Direct access to each AI agent)
// =============================================================================

/**
 * POST /api/crew/sales/execute
 * Sales agent: Close deals, send outreach, qualify leads
 */
app.post('/api/crew/sales/execute', async (req, res) => {
  try {
    const { task, context } = req.body;
    const result = await aiCrew.agents.sales.executeTask(task, context || {});
    
    res.json({ success: true, agent: 'sales', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/crew/engineering/execute
 * Engineering agent: Write code, deploy features, fix bugs
 */
app.post('/api/crew/engineering/execute', async (req, res) => {
  try {
    const { task, context } = req.body;
    const result = await aiCrew.agents.engineering.executeTask(task, context || {});
    
    res.json({ success: true, agent: 'engineering', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/crew/marketing/execute
 * Marketing agent: Create content, run campaigns, go viral
 */
app.post('/api/crew/marketing/execute', async (req, res) => {
  try {
    const { task, context } = req.body;
    const result = await aiCrew.agents.marketing.executeTask(task, context || {});
    
    res.json({ success: true, agent: 'marketing', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/crew/support/execute
 * Support agent: Answer questions, resolve tickets, delight customers
 */
app.post('/api/crew/support/execute', async (req, res) => {
  try {
    const { task, context } = req.body;
    const result = await aiCrew.agents.support.executeTask(task, context || {});
    
    res.json({ success: true, agent: 'support', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// AUTONOMOUS OPERATIONS (Background workers - no human intervention)
// =============================================================================

/**
 * Autonomous Work Cycle: Every minute, agents check for work and execute
 */
setInterval(async () => {
  try {
    await aiCrew.autonomousWorkCycle();
  } catch (error) {
    console.error('❌ Autonomous work cycle error:', error.message);
  }
}, 60000); // Every 1 minute

/**
 * Daily Standup: Every 24 hours, AI agents sync with each other
 */
setInterval(async () => {
  try {
    console.log('\n⏰ Scheduled daily standup starting...');
    await aiCrew.dailyStandup();
  } catch (error) {
    console.error('❌ Daily standup error:', error.message);
  }
}, 86400000); // Every 24 hours

/**
 * Health check: Log status every hour
 */
setInterval(async () => {
  try {
    const status = await aiCrew.getStatus();
    console.log('\n💚 Health Check:');
    console.log(`   Pending tasks: ${status.pendingTasks}`);
    console.log(`   Completed tasks: ${status.completedTasks}`);
    console.log(`   Shared memory size: ${status.sharedMemorySize}`);
  } catch (error) {
    console.error('❌ Health check error:', error.message);
  }
}, 3600000); // Every 1 hour

// =============================================================================
// SERVER INITIALIZATION
// =============================================================================

const PORT = process.env.AI_CREW_PORT || 3001;

app.listen(PORT, () => {
  console.log('\n🚀 ═══════════════════════════════════════════════');
  console.log(`   AI CREW SERVER RUNNING ON PORT ${PORT}`);
  console.log('   ═══════════════════════════════════════════════');
  console.log('   🤖 7 AI agents working autonomously 24/7');
  console.log('   💰 Cost: $11K/year (vs $3.35M for humans)');
  console.log('   ⚡ Performance: 10-100x faster than humans');
  console.log('   🌐 API: http://localhost:' + PORT);
  console.log('   ═══════════════════════════════════════════════\n');
  
  console.log('📋 Available Endpoints:');
  console.log('   GET  /api/crew/status          - View AI crew status');
  console.log('   POST /api/crew/command         - Give strategic command');
  console.log('   POST /api/crew/standup         - Trigger daily standup');
  console.log('   POST /api/crew/agent-prompt    - AI-to-AI communication');
  console.log('   POST /api/crew/assign-task     - Assign task to agent');
  console.log('   POST /api/crew/sales/execute   - Sales agent direct access');
  console.log('   POST /api/crew/engineering/execute - Eng agent direct access');
  console.log('   POST /api/crew/marketing/execute   - Marketing agent direct access');
  console.log('   POST /api/crew/support/execute     - Support agent direct access');
  console.log('\n');
  
  console.log('🎯 Example Commands:');
  console.log('   curl -X POST http://localhost:' + PORT + '/api/crew/command \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"command":"Close 10 deals this week"}\'');
  console.log('\n');
  
  console.log('🔥 The AI workforce is operational. Humans optional.\n');
});

// =============================================================================
// ERROR HANDLING
// =============================================================================

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});
