require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const MultiAIOrchestrator = require('./multiAIOrchestrator');
const DemoOrchestrator = require('./demoOrchestrator');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize orchestrators
const multiAI = new MultiAIOrchestrator();
const demoOrchestrator = new DemoOrchestrator(multiAI);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
      [email, hash]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (rows.length === 0 || !(await bcrypt.compare(password, rows[0].password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token, userId: rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Store encrypted message
app.post('/messages', async (req, res) => {
  try {
    const { ciphertext, nonce, salt, hash, session_id } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await pool.query(
      'INSERT INTO messages (user_id, session_id, ciphertext, nonce, salt, hash, timestamp) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
      [decoded.id, session_id, ciphertext, nonce, salt, hash]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve encrypted messages
app.get('/messages/:session_id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await pool.query(
      'SELECT * FROM messages WHERE user_id = $1 AND session_id = $2',
      [decoded.id, req.params.session_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== WAR ROOM DEMO ENDPOINTS ====================

/**
 * Initialize War Room demo
 * POST /api/demo/initialize
 */
app.post('/api/demo/initialize', (req, res) => {
  try {
    const result = demoOrchestrator.initializeDemo();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Execute complete War Room demo
 * POST /api/demo/execute
 */
app.post('/api/demo/execute', async (req, res) => {
  try {
    const result = await demoOrchestrator.executeCompleteDemo();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Execute individual demo scene
 * POST /api/demo/scene/:sceneNumber
 */
app.post('/api/demo/scene/:sceneNumber', async (req, res) => {
  try {
    const { sceneNumber } = req.params;
    let result;

    switch (sceneNumber) {
      case '1':
        result = await demoOrchestrator.executeScene1_ProblemInjection();
        break;
      case '2':
        result = await demoOrchestrator.executeScene2_AIAnalysis();
        break;
      case '3':
        result = await demoOrchestrator.executeScene3_SelfHealing();
        break;
      case '4':
        result = await demoOrchestrator.executeScene4_BusinessImpact();
        break;
      default:
        return res.status(400).json({ error: 'Invalid scene number (1-4)' });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get live demo status
 * GET /api/demo/status
 */
app.get('/api/demo/status', (req, res) => {
  try {
    const status = demoOrchestrator.getLiveStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Inject system break (for manual demo control)
 * POST /api/demo/inject-break
 * Body: { type: 'api_latency'|'partial_outage'|'corrupt_signal'|'network_timeout'|'rate_limit', agent: 'ChatGPT'|'Claude'|'Gemini', delayMs?: number, durationMs?: number }
 */
app.post('/api/demo/inject-break', (req, res) => {
  try {
    const { type, agent, delayMs, durationMs } = req.body;
    
    if (!type || !agent) {
      return res.status(400).json({ error: 'Type and agent required' });
    }

    let result;
    const simulator = demoOrchestrator.breakSimulator;

    switch (type) {
      case 'api_latency':
        result = simulator.injectAPILatency(agent, delayMs || 2000);
        break;
      case 'partial_outage':
        result = simulator.injectPartialOutage(agent, durationMs || 5000);
        break;
      case 'corrupt_signal':
        result = simulator.injectCorruptSignal(agent);
        break;
      case 'network_timeout':
        result = simulator.injectNetworkTimeout(agent);
        break;
      case 'rate_limit':
        result = simulator.injectRateLimit(agent);
        break;
      default:
        return res.status(400).json({ error: 'Invalid break type' });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get system health
 * GET /api/demo/health
 */
app.get('/api/demo/health', (req, res) => {
  try {
    const health = demoOrchestrator.breakSimulator.getSystemHealth();
    res.json(health);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get repair log
 * GET /api/demo/repair-log
 */
app.get('/api/demo/repair-log', (req, res) => {
  try {
    const repairLog = demoOrchestrator.breakSimulator.getRepairLog();
    res.json({ repairLog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get diagnostic report
 * GET /api/demo/diagnostics
 */
app.get('/api/demo/diagnostics', (req, res) => {
  try {
    const report = demoOrchestrator.selfDiagnostics.getLiveReport();
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Reset demo
 * POST /api/demo/reset
 */
app.post('/api/demo/reset', (req, res) => {
  try {
    demoOrchestrator.resetDemo();
    res.json({ status: 'reset', message: 'Demo reset successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
