# Game Engine Integration Templates

## Overview

This folder contains ready-to-use TypeScript templates for integrating the RideWire AI AR diagnostic tool with game engines (Unity WebGL, Unreal, etc.). All templates are designed for **zero-coding-experience** mechanics—copy, paste, configure, and run.

## Quick Start

1. Copy template files to your game engine project
2. Install dependencies: `npm install`
3. Configure environment settings in `config/game-engine.config.json`
4. Connect to RideWire backend via GameEngineSDK
5. Routes all AI responses through SafetyRuleEngine (70% confidence gate)

## Template Files

### 1. GameEngineSDK.ts
**Purpose**: Client-side API wrapper for RideWire backend

**What it does**:
- Manages WebSocket & REST connections
- Sends diagnostic queries to AI consensus layer
- Receives validated AR overlay commands
- Handles reconnection & error recovery

**Copy-Paste Usage**:
const sdk = new GameEngineSDK({
  backendUrl: 'https://ridewire.backend.com',
  wsUrl: 'wss://ridewire.backend.com',
  apiKey: process.env.RIDEWIRE_API_KEY
});

// Send vehicle diagnostic query
const response = await sdk.queryDiagnostics({
  vehicleId: 'VEHICLE_123',
  faultCode: 'P0401',
  timestamp: Date.now()
});

if (response.confidence >= 0.70) {
  console.log(response.recommendation);
}

### 2. SafetyRuleEngine.ts
**Purpose**: Multi-gate safety veto system for AI consensus

**What it does**:
- Enforces 70% confidence threshold
- Blocks actions flagged as high-risk
- Logs all decisions for audit trail
- Prevents unauthorized overlays

### 3. AIResponseMapper.ts
**Purpose**: Converts multi-AI consensus packets to game commands

**What it does**:
- Aggregates votes from 3+ AI engines
- Applies consensus weighting
- Formats for game engine consumption
- Tracks agreement levels

### 4. HUDManager.ts
**Purpose**: Manages AR display panels and UI feedback loops

**What it does**:
- Creates/updates/removes AR panels
- Handles panel visibility & Z-ordering
- Manages mechanic feedback (voice, haptic)
- Updates real-time consensus indicators

## Integration Diagram

Game Engine -> GameEngineSDK -> RideWire Backend -> 3 AI Engines -> AIResponseMapper -> SafetyRuleEngine -> HUDManager -> Mechanic Feedback

## Safety Requirements

Confidence Gate: Actions blocked if AI confidence < 70%
Audit Trail: All decisions logged with timestamps
Consensus Check: Requires agreement from 2+ AI engines
Risk Assessment: High-risk actions require human confirmation

## Dependency Notes

All templates use vanilla TypeScript with:
- Built-in WebSocket API
- Native Fetch API for HTTP requests
- Standard error handling
- Zero npm dependencies

## Common Questions

Q: How do I change the confidence threshold?
A: Edit the confidenceThreshold parameter in SafetyRuleEngine initialization. Default is 0.70 (70%).

Q: What if 2 AI engines disagree?
A: AIResponseMapper defaults to majority vote. If tied, highest-confidence response wins.

Q: Can I customize AR overlay colors?
A: Yes! Pass style options to hudManager.createPanel() or update ../config/game-engine.config.json.

Q: How do I add a 4th AI engine?
A: Add engine name to the engines array in AIResponseMapper config. No code changes needed.

## Next Steps

1. Read ../docs/GAME_ENGINE_ARCHITECTURE.md for system design
2. Review ../docs/IMPLEMENTATION_ROADMAP.md for Phase 1-3 timeline
3. Check ../schemas/game-interface.schema.json for data formats
4. Copy templates to your game project
5. Update ../config/game-engine.config.json with your values

## Support

For questions or issues:
- Check GitHub Issues: https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues
- Review PR #6 for implementation notes
- See docs/ folder for architecture details

---

Created by: Multi-AI Consensus Design Team
Last Updated: 2024
Status: Ready for Phase 1 Implementation
