# RideWire Game Engine Templates

This directory contains ready-to-use code templates for integrating the RideWire AI Hub with Unity game engine for AR diagnostics.

## 📋 Overview

These templates are **copy-paste ready** and require **zero coding experience**. Simply follow the installation instructions below to integrate them into your Unity project.

---

## 📁 Files Included

### 1. **GameEngineSDK.ts** (C# for Unity)
**Purpose:** Client-side SDK for communicating with RideWire backend.

**Features:**
- WebSocket connection management (real-time)
- REST API fallback for static queries
- Automatic reconnection on disconnect
- JSON serialization/deserialization
- Event-driven architecture

**Usage:**
```
1. Copy to: Unity/Assets/Scripts/GameEngineSDK.cs
2. Attach to GameObject: GameManager
3. Configure in Inspector:
   - Backend WebSocket URL: ws://localhost:3000/ws/game
   - Backend REST URL: http://localhost:3000/api/game
   - Auth Token: (get from login)
4. Subscribe to events in other scripts:
   GameEngineSDK.Instance.OnConsensusReceived += HandleConsensus;
```

---

### 2. **AIResponseMapper.ts** (Node.js for Backend)
**Purpose:** Convert AI consensus into game-ready commands (AR overlays, HUD updates).

**Features:**
- Maps text responses to AR overlay positions
- Generates HUD panel content
- Creates gamification payloads (XP, achievements)
- Applies safety rules automatically

**Usage:**
```javascript
// In server.js or multiAIOrchestrator.js
const AIResponseMapper = require('./templates/AIResponseMapper');
const mapper = new AIResponseMapper();

// After consensus is reached:
const gameCommand = mapper.mapConsensusToGameCommand(consensus, vehicleId);
io.emit('game-command', gameCommand);
```

---

### 3. **HUDManager.ts** (C# for Unity)
**Purpose:** Manage all HUD elements, UI panels, and user interactions.

**Features:**
- Multi-AI panel (ChatGPT, Claude, Gemini responses)
- Consensus banner with safety zone indicator
- XP progress bar and level-up animations
- Warning dialogs for safety violations
- Dynamic action button creation

**Usage:**
```
1. Copy to: Unity/Assets/Scripts/HUDManager.cs
2. Attach to: Canvas GameObject
3. Assign UI elements in Inspector:
   - Drag TextMeshPro components to slots
   - Link sliders, panels, buttons
4. HUD updates automatically via GameEngineSDK events
```

---

### 4. **SafetyRuleEngine.ts** (C# for Unity + Node.js version included)
**Purpose:** Validate user actions against safety rules and confidence thresholds.

**Features:**
- Critical action blocking (< 90% confidence)
- Standard action warnings (< 70% confidence)
- Single AI veto detection (< 40% confidence)
- Conflict detection between AIs
- Audit logging for compliance

**Usage:**
```csharp
// In Unity (C#)
var result = SafetyRuleEngine.Instance.ValidateAction("engine_disable");
if (!result.isAllowed) {
    HUDManager.Instance.ShowWarning(result.message, result.severity);
}
```

```javascript
// In Node.js backend
const SafetyRuleEngine = require('./SafetyRuleEngine');
const engine = new SafetyRuleEngine();
const result = engine.validateAction('engine_disable', consensus);
```

---

## 🚀 Quick Start Guide

### Step 1: Install Unity Dependencies
```bash
# Open Unity Hub → Package Manager
Install: NativeWebSocket (GitHub: endel/NativeWebSocket)
Install: TextMeshPro (Unity Registry)
```

### Step 2: Copy Templates to Unity
```bash
# Copy all .ts files to Unity project (rename to .cs)
cp templates/GameEngineSDK.ts unity-project/Assets/Scripts/GameEngineSDK.cs
cp templates/HUDManager.ts unity-project/Assets/Scripts/HUDManager.cs
cp templates/SafetyRuleEngine.ts unity-project/Assets/Scripts/SafetyRuleEngine.cs
```

### Step 3: Set Up Backend Module
```bash
# Copy AIResponseMapper to backend
cp templates/AIResponseMapper.ts ./AIResponseMapper.js

# Import in server.js
const AIResponseMapper = require('./AIResponseMapper');
```

### Step 4: Configure Unity Scene
```
1. Create GameObject: GameManager
   - Attach: GameEngineSDK.cs
   - Attach: SafetyRuleEngine.cs

2. Create Canvas: HUD Canvas
   - Attach: HUDManager.cs
   - Create child UI elements (see HUDManager.cs for structure)

3. Link UI elements in Inspector:
   - Drag and drop UI components to HUDManager slots
```

### Step 5: Test Connection
```bash
# Start backend
npm start

# Unity Play Mode
Click Play → Check console for "WebSocket Connected!"
Submit test query → Verify response appears in HUD
```

---

## 🔧 Configuration

All templates read from `config/game-engine.config.json`. Key settings:

### Backend URLs
```json
"development": {
  "backend_url": "http://localhost:3000",
  "websocket_url": "ws://localhost:3000/ws/game"
}
```

### Safety Thresholds
```json
"safety_rules": {
  "critical_action_threshold": 90,
  "standard_action_threshold": 70,
  "single_ai_veto_threshold": 40
}
```

### Visual Style
```json
"visual_style": {
  "colors": {
    "primary": "#00C7BE",
    "safety_zones": {
      "red": "#FF3B30",
      "yellow": "#FFCC00",
      "green": "#34C759",
      "teal": "#00C7BE"
    }
  }
}
```

---

## 📊 Data Flow

```
User Action (Unity)
    ↓
GameEngineSDK.SubmitDiagnosticQuery()
    ↓
WebSocket → Backend (server.js)
    ↓
MultiAIOrchestrator.queryAllAgents()
    ↓
ChatGPT + Claude + Gemini (parallel)
    ↓
Consensus Engine
    ↓
AIResponseMapper.mapConsensusToGameCommand()
    ↓
WebSocket → Unity (GameEngineSDK)
    ↓
HUDManager.HandleConsensusUpdate()
    ↓
SafetyRuleEngine.ValidateAction()
    ↓
UI Update + AR Overlays
```

---

## 🛡️ Safety Features

### Automatic Blocking
- **Critical actions** (engine disable, fuel cutoff) require 90%+ confidence
- **Low confidence** (< 70%) blocks standard actions
- **Single AI veto** (< 40%) blocks all critical actions

### Warning System
- **Yellow zone** (60-74%): Shows warning, requires confirmation
- **Conflicting AIs** (variance > 30%): Requires manual review
- **Red zone** (< 60%): Blocks all actions except "Seek Help"

### Audit Trail
All safety decisions logged with:
- Timestamp
- Action type
- Consensus confidence
- Allowed/blocked status
- User ID

---

## 🎨 Customization

### Change UI Colors
Edit `config/game-engine.config.json`:
```json
"visual_style": {
  "colors": {
    "primary": "#YOUR_COLOR"
  }
}
```

### Add New Vehicle Models
Edit `config/game-engine.config.json`:
```json
"vehicles": {
  "models": [
    {
      "id": "your_vehicle_id",
      "make": "Make",
      "model": "Model",
      "year": 2024,
      "glb_path": "/models/your_vehicle.glb",
      "components": { ... }
    }
  ]
}
```

### Add Custom Safety Rules
Edit `SafetyRuleEngine.cs` (Unity) or `.js` (Node.js):
```csharp
activeRules.Add(new SafetyRule {
    ruleId = "custom_rule",
    name = "Custom Safety Rule",
    condition = "confidence < 80 AND action_type == 'my_action'",
    action = "block",
    message = "Your custom message"
});
```

---

## 📚 API Reference

### GameEngineSDK Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `SubmitDiagnosticQuery` | `QueryRequest` | `void` | Submit query to backend |
| `ValidateAction` | `string actionType, callback` | `void` | Validate action safety |
| `GetAROverlays` | `string vehicleId, callback` | `void` | Get AR overlays for vehicle |
| `SetAuthToken` | `string token` | `void` | Set JWT auth token |
| `IsConnected` | - | `bool` | Check WebSocket status |

### HUDManager Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `DisplayConsensus` | `ConsensusResponse` | `void` | Display full consensus result |
| `UpdateAIPanel` | `string provider, string content, float confidence` | `void` | Update individual AI panel |
| `UpdateSafetyZone` | `string zone, float confidence` | `void` | Update safety indicator |
| `ShowWarning` | `string message, string severity` | `void` | Show warning dialog |
| `UpdateGamification` | `GamificationPayload` | `void` | Update XP/achievements |

### SafetyRuleEngine Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `ValidateAction` | `string actionType` | `ValidationResult` | Check if action is safe |
| `SetCurrentConsensus` | `ConsensusResponse` | `void` | Set consensus for validation |
| `LoadSafetyRules` | `SafetyRule[]` | `void` | Load rules from backend |
| `GetSafetyStatus` | - | `SafetyStatusSummary` | Get current safety status |

### AIResponseMapper Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `mapConsensusToGameCommand` | `consensus, vehicleId` | `GameCommand` | Convert consensus to game command |
| `generateAROverlays` | `consensus, vehicleId` | `AROverlay[]` | Generate AR overlay data |
| `generateHUDPanel` | `consensus` | `HUDPanel` | Generate HUD panel content |
| `generateGamificationData` | `consensus` | `GamificationPayload` | Calculate XP/achievements |

---

## 🐛 Troubleshooting

### WebSocket Connection Failed
```
Error: WebSocket connection refused
Fix: Check backend is running (npm start)
      Verify URL in GameEngineSDK Inspector matches server
```

### Unity Compilation Errors
```
Error: Missing NativeWebSocket reference
Fix: Install NativeWebSocket package
     Window → Package Manager → Add from Git URL:
     https://github.com/endel/NativeWebSocket.git
```

### UI Not Updating
```
Error: HUD not responding to consensus
Fix: Check GameEngineSDK.Instance.OnConsensusReceived has subscribers
     Verify HUDManager is attached to Canvas GameObject
```

### Safety Rules Not Working
```
Error: Actions not being blocked
Fix: Call SafetyRuleEngine.Instance.SetCurrentConsensus() before validation
     Verify thresholds in config/game-engine.config.json
```

---

## 📖 Additional Resources

- **Architecture Document:** `/docs/GAME_ENGINE_ARCHITECTURE.md`
- **Implementation Roadmap:** `/docs/IMPLEMENTATION_ROADMAP.md`
- **Configuration File:** `/config/game-engine.config.json`
- **JSON Schema:** `/schemas/game-interface.schema.json`

---

## ✅ Pre-Launch Checklist

Before deploying to production:

- [ ] All Unity scripts compile without errors
- [ ] WebSocket connection stable for 5+ minutes
- [ ] AR overlays render correctly on test vehicle
- [ ] Safety rules block critical actions at low confidence
- [ ] HUD updates within 100ms of consensus
- [ ] XP system awards points correctly
- [ ] Level-up animation plays smoothly
- [ ] Backend logs show no errors
- [ ] Database stores all diagnostics
- [ ] Test on physical mobile device (not just Unity Editor)

---

## 🤝 Support

If you encounter issues:
1. Check Unity console for error messages
2. Review backend logs: `npm start | tee backend.log`
3. Verify configuration in `config/game-engine.config.json`
4. Open GitHub issue with error details

---

**Version:** 1.0  
**Last Updated:** 2025-12-09  
**Status:** ✅ Production Ready
