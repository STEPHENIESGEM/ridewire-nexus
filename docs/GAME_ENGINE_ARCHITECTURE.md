# Game Engine Integration Layer for AR Diagnostic Tool

## Executive Summary

This document specifies the architecture for integrating a game engine with the RideWire AI Hub to create an interactive AR diagnostic experience. The design prioritizes ease of use for non-technical users while maintaining seamless integration with the existing Node.js/Express backend and multi-AI consensus engine.

## 1. Engine Choice & Rationale

### Selected: Unity with WebGL Export

**Reasoning:**
- **Non-programmer friendly:** Unity's visual editor and drag-and-drop workflow enables non-technical users to extend AR overlays
- **AR.js integration:** Native support for web-based AR without separate SDKs
- **Cross-platform:** Single codebase exports to WebGL (browser), iOS (ARKit), Android (ARCore)
- **Asset ecosystem:** 50,000+ pre-built AR components, vehicle models, diagnostic UI prefabs
- **Real-time performance:** Built-in rendering optimization for mobile AR devices
- **Avoid Unreal:** Requires C++ expertise; overkill for tablet-based diagnostics
- **Avoid web-only:** Three.js lacks AR.js maturity; custom implementation required

## 2. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Mechanic's Tablet (AR View)              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Unity WebGL App (Game Loop)                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │  │
│  │  │  AR Camera   │  │ HUD Manager  │  │  Safety    │  │  │
│  │  │  (AR.js)     │  │  (UI Panels) │  │  Rules     │  │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘  │  │
│  │         │                  │                 │        │  │
│  │         └──────────────────┼─────────────────┘        │  │
│  │                            │                          │  │
│  │                 ┌──────────▼─────────────┐             │  │
│  │                 │  GameEngineSDK (API)   │             │  │
│  │                 │  - Query execution     │             │  │
│  │                 │  - Response handling   │             │  │
│  │                 │  - State management    │             │  │
│  │                 └──────────┬──────────────┘             │  │
│  └────────────────────────────┼──────────────────────────┘  │
│                               │                             │
│                       WebSocket/REST                        │
│                               │                             │
└───────────────────────────────┼─────────────────────────────┘
                                │
        ┌───────────────────────▼───────────────────────┐
        │   RideWire AI Hub Node.js Backend (3000)     │
        │  ┌──────────────────────────────────────────┐ │
        │  │   Multi-AI Orchestrator                   │ │
        │  │   ┌─────────────┐ ┌─────────────┐        │ │
        │  │   │  ChatGPT    │ │   Claude    │ ...   │ │
        │  │   └─────────────┘ └─────────────┘        │ │
        │  │                                           │ │
        │  │   AIResponseMapper → Consensus Result    │ │
        │  └──────────────────────────────────────────┘ │
        │  ┌──────────────────────────────────────────┐ │
        │  │   PostgreSQL Database (Message Storage)  │ │
        │  └──────────────────────────────────────────┘ │
        └──────────────────────────────────────────────┘
```

## 3. AI → Game Interface Specification

### Query Initiation (Game → Backend)

```json
{
  "type": "ai_query",
  "query_id": "uuid-1234",
  "user_id": "user-5678",
  "content": "P0300 engine code - random misfire",
  "context": {
    "vehicle_vin": "12345VIN",
    "obd_codes": ["P0300"],
    "vehicle_state": {
      "rpm": 1200,
      "coolant_temp": 92,
      "fuel_pressure": 45
    }
  },
  "confidence_threshold": 0.70,
  "response_timeout_ms": 30000
}
```

### Consensus Response (Backend → Game)

```json
{
  "type": "consensus_result",
  "query_id": "uuid-1234",
  "timestamp": "2025-12-08T20:00:00Z",
  "consensus": {
    "diagnosis": "Random misfire detected in combustion. Check spark plugs, ignition coils, or fuel injectors.",
    "confidence": 0.85,
    "estimated_cost": 150,
    "severity": "warning",
    "ai_breakdown": {
      "chatgpt": { "diagnosis": "...", "confidence": 0.82 },
      "claude": { "diagnosis": "...", "confidence": 0.88 },
      "gemini": { "diagnosis": "...", "confidence": 0.85 }
    }
  },
  "ar_overlay": {
    "type": "diagnostic_panel",
    "position": { "x": 0.5, "y": 0.8 },
    "ui_elements": [
      { "type": "text", "content": "Random Misfire", "color": "#FF6B35" },
      { "type": "gauge", "value": 0.85, "label": "Confidence" },
      { "type": "arrow", "target_component": "spark_plugs" }
    ]
  },
  "safety_gated": false,
  "recommended_actions": [
    "Replace spark plugs",
    "Check ignition coils",
    "Verify fuel pressure"
  ]
}
```

### AR Overlay Command Structure

```json
{
  "type": "ar_overlay",
  "overlay_id": "overlay-9999",
  "command": "display_diagnostic_arrow",
  "target": "engine_bay",
  "visual_params": {
    "color": "rgba(255, 107, 53, 0.8)",
    "material": "glow_shader",
    "scale": 1.5,
    "animation": "pulse"
  },
  "label": "Check spark plugs - P0300",
  "auto_dismiss_ms": 10000
}
```

## 4. Safety Layer Design

### Confidence Gating

- **< 70% confidence:** Display warning, require mechanic override
- **70-85% confidence:** Suggest primary recommendation, show alternatives
- **> 85% confidence:** Display as primary diagnosis, flag alternatives

### Veto Rules

```typescript
const SAFETY_RULES = {
  // Block high-cost recommendations under low confidence
  high_cost_threshold: 1000, // $1000
  min_confidence_for_high_cost: 0.80,
  
  // Block simultaneous conflicting recommendations
  conflicting_actions: {
    "replace_engine": ["replace_transmission"],
    "flush_coolant": ["replace_coolant_hoses"]
  },
  
  // Prevent action loops (same recommendation within X minutes)
  duplicate_action_cooldown_ms: 3600000 // 1 hour
};
```

## 5. Consensus-Driven UI Feedback Loop

### Real-Time Update Flow

1. **User Query:** Mechanic points tablet, speaks/types diagnostic question
2. **Submission:** GameEngineSDK sends query to backend
3. **Multi-AI Processing:** Backend orchestrates ChatGPT, Claude, Gemini in parallel
4. **Consensus Calculation:** Conflict resolution algorithm computes weighted consensus
5. **Safety Gate:** Confidence check against veto rules
6. **UI Rendering:** HUD Manager receives consensus packet, renders AR overlays
7. **Mechanic Feedback:** Buttons to "Accept", "Reject", "Request Alternative"
8. **Persistence:** Final consensus stored in PostgreSQL for audit trail

### Feedback Resolution

```typescript
interface ConsensusFeedback {
  query_id: string;
  action: "accept" | "reject" | "request_alternative" | "modify";
  mechanic_confidence: number; // 0-100, mechanic's override confidence
  notes: string; // Free-form notes for later audit
  timestamp: ISO8601;
}
```

## 6. Tech Stack Summary

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Game Engine | Unity (WebGL) | AR.js + cross-platform + visual editor |
| Frontend Framework | React.js (dashboard) | Existing stack, dashboard UI |
| Communication | WebSocket (primary) + REST (fallback) | Real-time updates, bidirectional |
| AR Framework | AR.js + Three.js | Web-based, no separate SDK |
| Backend | Node.js/Express (existing) | Multi-AI orchestrator already built |
| Database | PostgreSQL (existing) | Consensus + diagnostic history |
| AI Providers | OpenAI, Anthropic, Google | ChatGPT, Claude, Gemini |

## 7. Implementation Constraints

### Non-Negotiable
- Zero manual coding required for end users (copy-paste + environment setup only)
- No breaking changes to existing Node.js backend
- Mechanic can disable individual AI providers without redesign
- All diagnostic data encrypted at rest (AES-256)
- Diagnostic history queryable in dashboard

### Scalability Requirements
- Support 100+ concurrent diagnostic sessions
- Add new vehicle model/fault code without code changes
- Extend to new game engines (Unreal, custom Unity builds) without central refactor

## 8. Deployment Architecture

```
Production:
- Unity WebGL app hosted on CDN (dist/game-engine/)
- Backend API on AWS Lambda + API Gateway (existing)
- PostgreSQL on RDS with read replicas
- WebSocket via Socket.io on EC2 (or Lambda + API Gateway WebSocket)

Staging:
- Unity WebGL dev build with verbose logging
- Test API keys for all three AI providers
- Sandbox PostgreSQL with synthetic vehicle data
```

## 9. Success Metrics

✅ Mechanic can run entire app with 3 commands (npm install, npm run db:init, npm start)
✅ AR overlay renders within 500ms of consensus response
✅ 95%+ of diagnostic queries return consensus (< 5% timeouts)
✅ Mechanic can extend with new vehicle types without touching backend code
✅ Zero production incidents from AI consensus conflicts (safety layer gates > 99%)

## 10. Future Extensions

- Real-time multiplayer diagnostics (multiple mechanics debugging same vehicle)
- Advanced ML confidence weighting (learn which AI is best for specific fault codes)
- Mobile-native (React Native) deployment
- Fifth AI provider (Llama-based local inference)
- Diagnostic predictions based on historical data ("This vehicle usually needs X for P0300")
