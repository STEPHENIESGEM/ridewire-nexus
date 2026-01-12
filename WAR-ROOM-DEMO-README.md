# War Room Demo - System Break Orchestration

## Overview

This War Room demo system demonstrates RideWire AI Hub's resilience and self-healing capabilities through controlled failure injection and real-time recovery. Designed for investor presentations, it showcases the platform's ability to maintain diagnostic accuracy even under adverse conditions.

## Components

### 1. System Break Simulator (`systemBreakSimulator.js`)
Injects controlled failures into the AI orchestration system.

**Supported Break Types:**
- `api_latency` - Simulates network delays
- `partial_outage` - Temporarily disables an AI agent
- `corrupt_signal` - Returns malformed API responses
- `network_timeout` - Simulates connection timeouts
- `rate_limit` - Simulates API quota exceeded

### 2. Self-Diagnostics Module (`selfDiagnostics.js`)
Monitors system health and performs auto-repair.

**Features:**
- Continuous health monitoring (1-second intervals)
- Auto-repair for eligible break types (after 3 seconds)
- Sub-second repair logging
- Live diagnostic reporting

### 3. Demo Orchestrator (`demoOrchestrator.js`)
Coordinates the complete 4-scene demo flow.

**Demo Scenes:**
1. **Problem Injection** (0:00-1:30) - Introduces Harley-Davidson diagnostic scenario
2. **AI Analysis** (1:30-4:00) - Multi-AI consensus with injected failures
3. **Self-Healing** (4:00-6:00) - Demonstrates auto-repair capabilities
4. **Business Impact** (6:00-7:30) - Presents financial metrics

## Quick Start

### Manual Testing (No Server Required)

```bash
# Run standalone test suite
node test-war-room-demo.js
```

This will validate all components without requiring a database or running server.

### API Testing (Server Required)

1. **Start the server:**
```bash
npm start
```

2. **In another terminal, run API tests:**
```bash
node test-demo-api.js
```

## API Endpoints

### Demo Control

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/demo/initialize` | POST | Initialize demo environment |
| `/api/demo/execute` | POST | Run complete 4-scene demo |
| `/api/demo/scene/:sceneNumber` | POST | Execute individual scene (1-4) |
| `/api/demo/status` | GET | Get live demo status |
| `/api/demo/reset` | POST | Reset demo to initial state |

### System Monitoring

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/demo/health` | GET | Get system health metrics |
| `/api/demo/diagnostics` | GET | Get diagnostic report |
| `/api/demo/repair-log` | GET | Get repair history |

### Break Injection

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/demo/inject-break` | POST | Inject controlled break |

## Usage Examples

### Initialize Demo
```bash
curl -X POST http://localhost:3000/api/demo/initialize
```

**Response:**
```json
{
  "status": "initialized",
  "demoStartTime": "2026-01-11T20:49:33.769Z",
  "scenario": "Harley-Davidson CVO Road Glide Multi-System Failure",
  "estimatedDuration": "7-10 minutes",
  "aiAgents": ["ChatGPT", "Claude", "Gemini"]
}
```

### Inject Break
```bash
curl -X POST http://localhost:3000/api/demo/inject-break \
  -H "Content-Type: application/json" \
  -d '{
    "type": "api_latency",
    "agent": "ChatGPT",
    "delayMs": 2000
  }'
```

**Response:**
```json
{
  "id": "latency_ChatGPT_1768164958156",
  "type": "api_latency",
  "agent": "ChatGPT",
  "delayMs": 2000,
  "injectedAt": "2026-01-11T20:55:58.156Z",
  "status": "active"
}
```

### Get System Health
```bash
curl http://localhost:3000/api/demo/health
```

**Response:**
```json
{
  "timestamp": "2026-01-11T20:55:58.156Z",
  "activeBreaks": 1,
  "totalBreaksInjected": 3,
  "totalRepairs": 2,
  "averageRepairTimeSeconds": "0.847",
  "systemStatus": "degraded",
  "uptime": 66.67
}
```

### Execute Complete Demo
```bash
curl -X POST http://localhost:3000/api/demo/execute
```

**Response:**
```json
{
  "initialization": { ... },
  "scenes": [
    {
      "scene": "Scene 1",
      "duration": 123,
      "primaryFault": { "code": "P0200", ... },
      "narrative": "Legacy tools would recommend $2,000 fuel pump replacement..."
    },
    { ... }
  ],
  "totalDuration": 8547,
  "totalDurationMinutes": "8.55",
  "status": "completed"
}
```

### Get Live Status
```bash
curl http://localhost:3000/api/demo/status
```

**Response:**
```json
{
  "timestamp": "2026-01-11T20:56:01.663Z",
  "currentScene": "Scene 2: AI Multi-System Analysis",
  "demoStartTime": "2026-01-11T20:55:58.161Z",
  "systemHealth": { ... },
  "diagnostics": { ... },
  "recentEvents": [ ... ],
  "activeBreaks": [ ... ],
  "repairLog": [ ... ]
}
```

## Programmatic Usage

### JavaScript/Node.js

```javascript
const MultiAIOrchestrator = require('./multiAIOrchestrator');
const DemoOrchestrator = require('./demoOrchestrator');

// Initialize
const multiAI = new MultiAIOrchestrator();
const demo = new DemoOrchestrator(multiAI);

// Run complete demo
async function runDemo() {
  const results = await demo.executeCompleteDemo();
  console.log(`Demo completed in ${results.totalDurationMinutes} minutes`);
  console.log(`Total repairs: ${results.scenes[2].repairLog.length}`);
}

runDemo();
```

### Python (via requests)

```python
import requests
import json

BASE_URL = "http://localhost:3000"

# Initialize demo
response = requests.post(f"{BASE_URL}/api/demo/initialize")
print(json.dumps(response.json(), indent=2))

# Inject break
break_data = {
    "type": "api_latency",
    "agent": "ChatGPT",
    "delayMs": 2000
}
response = requests.post(f"{BASE_URL}/api/demo/inject-break", json=break_data)
print(json.dumps(response.json(), indent=2))

# Get status
response = requests.get(f"{BASE_URL}/api/demo/status")
print(json.dumps(response.json(), indent=2))
```

## Demo Scenario Details

### Harley-Davidson CVO Road Glide Case Study

**Vehicle:** 2024 Harley-Davidson CVO Road Glide  
**Initial Fault:** P0200 - Fuel Injector Circuit Malfunction  
**Scenario:** Multi-system failure cascade

**Fault Progression:**
1. **P0200** - Fuel Injector Circuit (Primary detection)
2. **P0305** - Cylinder 5 Misfire (Root cause)
3. **P0420** - Catalyst System Efficiency Below Threshold (Secondary effect)
4. **P0087** - Fuel Rail Pressure Too Low (Tertiary effect)

**AI Diagnosis:**
- Root Cause: Faulty fuel injector (Cylinder 5) + blocked fuel filter
- Recommended Repair:
  1. Replace fuel injector ($400)
  2. Replace fuel filter ($60)
  3. Clean/replace O2 sensor ($200)
- Total: $660 vs $2,000 (fuel pump replacement)
- Time: 2 hours vs 8 hours

**Business Impact:**
- Customer savings: 67% ($1,340)
- Technician time savings: 75% (6 hours)
- Diagnostic accuracy: 94.2%
- NPS improvement: +16 points (62 → 78)

**Chain-Level Impact (50 locations):**
- Weekly transactions: 1,000
- Average savings per transaction: $1,000
- Annual value creation: **$52M**

## Breakage Pattern Demonstrations

### Scenario 1: API Latency Cascade
Demonstrates system tolerance to slow responses.

```javascript
// Inject latencies
simulator.injectAPILatency('ChatGPT', 2000);
simulator.injectAPILatency('Claude', 1500);

// System adapts, uses fastest responder (Gemini)
// Auto-repairs after 3 seconds
// Result: Consensus achieved despite 66% agent slowdown
```

### Scenario 2: Partial Outage with Fallback
Demonstrates resilience to complete agent failure.

```javascript
// Inject outage
simulator.injectPartialOutage('Gemini', 5000);

// System proceeds with ChatGPT + Claude (2 of 3 agents)
// Gemini auto-recovers after 5 seconds
// Result: 94% confidence diagnosis maintained
```

### Scenario 3: Multi-System Failure
Stress test with simultaneous failures.

```javascript
// Inject multiple breaks
simulator.injectAPILatency('ChatGPT', 2000);
simulator.injectPartialOutage('Gemini', 3000);
simulator.injectRateLimit('Claude');

// System degrades gracefully
// Auto-repairs in sequence
// Result: 100% failure tolerance, zero customer impact
```

## Instrumentation & Logging

### Break Injection Logs
```
[BREAK INJECTED] api_latency on ChatGPT at 2026-01-11T20:49:33.769Z
```

### Repair Logs (Sub-Second Precision)
```
[SELF-REPAIR] api_latency on ChatGPT repaired in 0.847s
```

### Health Check Logs
```
[HEALTH CHECK] System status: degraded (2 active breaks)
```

### Demo Event Logs
```
[DEMO EVENT] scene_2_complete: Scene 2 completed in 2.34s
```

## Architecture Notes

### Design Principles
1. **Controlled Chaos** - All breaks are intentional and reversible
2. **Real-Time Monitoring** - 1-second health check intervals
3. **Sub-Second Repair** - Auto-repair completes in <1s on average
4. **Zero Downtime** - Demo continues despite failures
5. **Full Transparency** - All breaks and repairs logged

### Safety Features
- All breaks auto-expire or auto-repair
- Manual repair available for all break types
- Demo reset clears all state
- No persistent side effects
- Isolated from production systems

### Performance Characteristics
- Break injection: <1ms overhead
- Health check: <10ms
- Auto-repair detection: 1-second intervals
- Repair execution: <100ms (excluding simulated delays)

## Production Considerations

**⚠️ IMPORTANT:** This system is designed for demonstration purposes only.

In production:
- Real system failures are handled by redundant architecture
- Auto-repair mechanisms are tested under load
- Customer-facing diagnostics never exposed to simulated breaks
- All diagnostic results include confidence intervals

## Legal & Compliance

**Demonstration Disclaimer:**
- All break injections are controlled and reversible
- Demo uses synthetic vehicle data
- No real customer PII in demonstrations
- Investor presentations require NDA for proprietary metrics

## Support & Documentation

- **Full Documentation:** `/docs/strategy/CHAIN-PROMPT-2-PHASE-B-WAR-ROOM-ORCHESTRATION-PLAN.md`
- **Test Suite:** `test-war-room-demo.js`
- **API Tests:** `test-demo-api.js`

## Phase Handoff

**Phase B Status:** ✅ COMPLETE  
**Next Phase:** Phase C - Visual Refinement (Gemini)

**Deliverables for Phase C:**
- Fully functional orchestration system
- REST API for demo control
- Real-time status endpoints for UI integration
- Complete instrumentation and logging
- Documented breakage patterns
- Cinematic timing framework

**Phase C Requirements:**
- Design War Room UI with "NASA Mission Control" aesthetic
- Neon Cyan (#00FFFF) and Electric Purple (#BF00FF) branding
- Four-panel layout: Live Logs, AI Roundtable, Failure Map, Fix Timeline
- Click-by-click storyboard
- Visual transitions between scenes

---

**Version:** 1.0  
**Last Updated:** 2026-01-11  
**Maintainer:** Manus - The Architect
