# RideWire Game Engine Integration - Complete Guide

## 🎯 Executive Summary

This package contains **everything needed** to transform the RideWire AI Hub into an interactive AR diagnostic game. **Zero coding required** - just copy, paste, and configure.

**What You Get:**
- ✅ Complete Unity C# scripts (copy-paste ready)
- ✅ Backend Node.js modules (plug-and-play)
- ✅ Comprehensive documentation
- ✅ Configuration files (edit values, not code)
- ✅ 6-9 week implementation roadmap

---

## 📦 Package Contents

```
ridewire-ai-hub/
├── docs/
│   ├── GAME_ENGINE_ARCHITECTURE.md    (System design & rationale)
│   ├── IMPLEMENTATION_ROADMAP.md      (3-phase plan with timelines)
│   └── INTEGRATION_GUIDE.md           (This file)
├── templates/
│   ├── GameEngineSDK.ts               (Unity client SDK)
│   ├── AIResponseMapper.ts            (Backend response mapper)
│   ├── HUDManager.ts                  (Unity HUD manager)
│   ├── SafetyRuleEngine.ts            (Safety validation)
│   └── README.md                      (Template usage guide)
├── config/
│   └── game-engine.config.json        (Configuration settings)
└── schemas/
    └── game-interface.schema.json     (Data contracts)
```

---

## 🚀 Quick Start (30 Minutes)

### Prerequisites
- Unity Hub installed (free)
- Node.js 16+ installed
- PostgreSQL database running
- API keys for ChatGPT, Claude, Gemini

### Step 1: Install Unity (10 min)
```bash
# Download Unity Hub
https://unity.com/download

# Install Unity 2022.3 LTS
# Select modules:
- WebGL Build Support
- iOS Build Support (optional)
- Android Build Support (optional)
```

### Step 2: Create Unity Project (5 min)
```
Unity Hub → New Project → 3D (Core)
Name: RideWire-AR-Diagnostic
Location: /ridewire-ai-hub/unity-project/
```

### Step 3: Copy Templates to Unity (2 min)
```bash
# Rename .ts to .cs and copy to Unity
cp templates/GameEngineSDK.ts unity-project/Assets/Scripts/GameEngineSDK.cs
cp templates/HUDManager.ts unity-project/Assets/Scripts/HUDManager.cs
cp templates/SafetyRuleEngine.ts unity-project/Assets/Scripts/SafetyRuleEngine.cs
```

### Step 4: Install Unity Packages (5 min)
```
Unity → Window → Package Manager
1. Install AR Foundation
2. Install TextMeshPro
3. Install NativeWebSocket (GitHub URL):
   https://github.com/endel/NativeWebSocket.git
```

### Step 5: Set Up Backend (3 min)
```bash
# Copy backend module
cp templates/AIResponseMapper.ts ./AIResponseMapper.js

# Install Socket.IO
npm install socket.io

# Add WebSocket server to server.js (see below)
```

### Step 6: Test Connection (5 min)
```bash
# Terminal 1: Start backend
npm start

# Terminal 2: Unity Play Mode
Open Unity → Click Play button
Check Console for: "WebSocket Connected!"
```

---

## 🔧 Detailed Integration Steps

### Backend Integration

#### 1. Add Socket.IO to `server.js`

**Copy-paste this after line 14:**

```javascript
const http = require('http');
const socketIO = require('socket.io');
const AIResponseMapper = require('./AIResponseMapper');

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const mapper = new AIResponseMapper();

io.on('connection', (socket) => {
  console.log('Game client connected:', socket.id);
  
  socket.on('diagnostic-query', async (data) => {
    try {
      console.log('Received query:', data.query);
      
      // Import existing orchestrator
      const MultiAIOrchestrator = require('./multiAIOrchestrator');
      const orchestrator = new MultiAIOrchestrator();
      
      // Query all AIs (existing method)
      const results = await orchestrator.queryAllAgents(data.query, data.queryId);
      
      // Build consensus (existing method)
      const consensus = orchestrator.buildConsensus(results.responses);
      
      // Map to game command (NEW)
      const gameCommand = mapper.mapConsensusToGameCommand({
        queryId: data.queryId,
        query: data.query,
        consensus: consensus.recommendedAction,
        overallConfidence: 85, // Calculate from results
        aiResponses: Object.entries(results.responses).map(([provider, response]) => ({
          provider: provider,
          confidence: response.confidence,
          recommendation: response,
          reasoning: 'Analysis complete',
          responseTime: 1500
        })),
        safetyZone: 'green',
        relatedCodes: data.errorCodes || []
      }, data.vehicleId);
      
      // Send to Unity
      socket.emit('game-command', gameCommand);
      
    } catch (err) {
      console.error('Query error:', err);
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Game client disconnected:', socket.id);
  });
});

// IMPORTANT: Change app.listen to server.listen
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

#### 2. Add Validation Endpoint

**Copy-paste this before `app.listen`:**

```javascript
app.post('/api/game/validate-action', async (req, res) => {
  try {
    const { actionType } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Import safety engine (backend version)
    const SafetyRuleEngine = require('./SafetyRuleEngine');
    const engine = new SafetyRuleEngine();
    
    // Get latest consensus from session (you'll need to track this)
    // For now, mock it:
    const mockConsensus = {
      overallConfidence: 85,
      aiResponses: [
        { confidence: 90 },
        { confidence: 85 },
        { confidence: 80 }
      ]
    };
    
    const result = engine.validateAction(actionType, mockConsensus);
    
    res.json({
      isAllowed: result.isAllowed,
      message: result.message
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

### Unity Scene Setup

#### 1. Create Game Manager

```
GameObject → Create Empty
Name: GameManager
Add Component → GameEngineSDK
Add Component → SafetyRuleEngine

Inspector (GameEngineSDK):
- Backend WebSocket URL: ws://localhost:3000/ws/game
- Backend REST URL: http://localhost:3000/api/game
- Auth Token: (leave empty for now)
- Auto Reconnect: ✓
- Max Reconnect Attempts: 5
```

#### 2. Create HUD Canvas

```
GameObject → UI → Canvas
Name: HUD Canvas
Canvas Scaler → UI Scale Mode: Scale With Screen Size
Reference Resolution: 1920 x 1080

Add Component → HUDManager

Create child objects:
1. Multi-AI Panel (Vertical Layout Group)
   - ChatGPT Panel (Image + TextMeshPro + Slider)
   - Claude Panel (Image + TextMeshPro + Slider)
   - Gemini Panel (Image + TextMeshPro + Slider)

2. Consensus Banner (Image + TextMeshPro)
   - Overall Confidence Text
   - Safety Zone Indicator (Image)

3. Action Button Container (Horizontal Layout Group)
   - Button Prefab (for dynamic creation)

4. XP Progress Bar (Slider)
   - Level Text (TextMeshPro)
   - XP Gain Popup (Panel + Text)

5. Level Up Panel (Panel + Text + Particle System)

6. Warning Dialog (Panel + Text + Image + Button)

7. Loading Spinner (Image + Text)
```

#### 3. Link UI Elements in Inspector

```
HUDManager Component:
Drag and drop each UI element to corresponding slot:
- Multi AI Panel → MultiAIPanel GameObject
- ChatGPT Text → ChatGPT Panel/Text
- ChatGPT Confidence Bar → ChatGPT Panel/Slider
- ... (repeat for Claude, Gemini)
- Consensus Text → Consensus Banner/Text
- XP Progress Bar → XP Slider
- etc.
```

#### 4. Create Test Query Button

```
GameObject → UI → Button
Name: Diagnose Button
Position: Bottom center

Add Event:
OnClick() → HUDManager.OnDiagnoseButtonClicked()
```

---

## 🎨 UI Styling

### Apply Theme Colors

Open each UI element and set colors from `config/game-engine.config.json`:

```
Primary Color: #00C7BE (teal)
Background: #1C1C1E (dark gray)
Text: #FFFFFF (white)

Safety Zones:
- Red: #FF3B30
- Yellow: #FFCC00
- Green: #34C759
- Teal: #00C7BE
```

### Import Fonts

```
Download Roboto font: https://fonts.google.com/specimen/Roboto
Import to Unity: Assets/Fonts/Roboto.ttf
Apply to all TextMeshPro components
```

---

## 🧪 Testing

### Test 1: WebSocket Connection

```
1. Start backend: npm start
2. Unity Play Mode
3. Check Console: "WebSocket Connected!" ✓
4. Wait 10 seconds → No disconnects ✓
```

### Test 2: Query Submission

```
1. Click "Diagnose" button
2. Check backend logs: "Received query" ✓
3. Unity HUD updates with AI responses ✓
4. Consensus banner appears ✓
5. Safety zone indicator shows correct color ✓
```

### Test 3: Safety Validation

```
1. Submit query with low confidence (< 70%)
2. Try critical action → Blocked ✓
3. Warning dialog appears ✓
4. Check console: "Action blocked" ✓
```

### Test 4: Gamification

```
1. Submit query
2. XP gain popup appears ✓
3. Progress bar increases ✓
4. Level up at threshold → Animation plays ✓
```

---

## 📊 Configuration

All settings in `config/game-engine.config.json`. No code changes needed!

### Change Backend URL

```json
"environment": {
  "current": "production",
  "profiles": {
    "production": {
      "backend_url": "https://your-domain.com",
      "websocket_url": "wss://your-domain.com/ws/game"
    }
  }
}
```

### Adjust Safety Thresholds

```json
"safety_rules": {
  "critical_action_threshold": 90,  // Change to 95 for stricter
  "standard_action_threshold": 70,  // Change to 75 for stricter
  "single_ai_veto_threshold": 40
}
```

### Add Vehicle Models

```json
"vehicles": {
  "models": [
    {
      "id": "my_vehicle",
      "make": "Tesla",
      "model": "Model 3",
      "year": 2023,
      "glb_path": "/models/tesla_model3.glb",
      "components": {
        "battery": { "x": 0, "y": 0.3, "z": 0 }
      }
    }
  ]
}
```

---

## 🚀 Deployment

### WebGL Build

```
Unity → File → Build Settings
Platform: WebGL
Compression Format: Brotli
Code Optimization: Size

Build → /frontend/public/unity-build/

Deploy: Copy unity-build/ to web server
```

### Mobile Build

```
Platform: Android or iOS
Build Settings:
- Graphics API: Vulkan (Android) / Metal (iOS)
- Target Architecture: ARM64
- Minimum OS: Android 7.0 / iOS 12.0

Build → Generate APK/IPA
```

### Backend Deployment

```bash
# Heroku
heroku create ridewire-ai-hub
git push heroku main

# Or Render.com (recommended)
# render.yaml included - auto-deploys
```

---

## 🐛 Common Issues

### Issue: Unity Won't Compile

**Error:** `NativeWebSocket namespace not found`

**Fix:**
```
Window → Package Manager → Add from Git URL
https://github.com/endel/NativeWebSocket.git
```

---

### Issue: WebSocket Won't Connect

**Error:** `WebSocket connection refused`

**Fix:**
```
1. Check backend is running: npm start
2. Verify URL in Unity Inspector matches server
3. Check firewall isn't blocking port 3000
4. Try REST fallback temporarily
```

---

### Issue: HUD Not Updating

**Error:** UI shows "Loading..." forever

**Fix:**
```
1. Check GameEngineSDK.Instance.OnConsensusReceived has subscribers
2. Verify HUDManager attached to Canvas
3. Check Console for errors
4. Ensure all UI element slots filled in Inspector
```

---

### Issue: Actions Not Blocked

**Error:** Critical actions execute at low confidence

**Fix:**
```
1. Call SafetyRuleEngine.Instance.SetCurrentConsensus() before validation
2. Check thresholds in config/game-engine.config.json
3. Verify ValidateAction() is called before ExecuteAction()
```

---

## 📚 Next Steps

### Phase 1 (Weeks 1-2): Basic Integration
- [ ] Install Unity & packages
- [ ] Copy templates & configure
- [ ] Test WebSocket connection
- [ ] Verify HUD updates

### Phase 2 (Weeks 3-4): AI Integration
- [ ] Connect real AI providers
- [ ] Test consensus algorithm
- [ ] Implement safety rules
- [ ] Add database persistence

### Phase 3 (Weeks 5-6): AR & Polish
- [ ] Set up AR Foundation
- [ ] Add vehicle models
- [ ] Implement gamification
- [ ] Deploy to production

**See `docs/IMPLEMENTATION_ROADMAP.md` for detailed sprint breakdown.**

---

## 🎓 Learning Resources

### Unity Basics
- Unity Learn: https://learn.unity.com
- AR Foundation Tutorial: https://learn.unity.com/tutorial/ar-foundation

### WebSockets
- Socket.IO Docs: https://socket.io/docs/
- NativeWebSocket: https://github.com/endel/NativeWebSocket

### AR Development
- AR Foundation Manual: https://docs.unity3d.com/Packages/com.unity.xr.arfoundation@latest
- ARCore (Android): https://developers.google.com/ar
- ARKit (iOS): https://developer.apple.com/arkit/

---

## 🤝 Support

Need help? Check these resources:

1. **Documentation**
   - Architecture: `docs/GAME_ENGINE_ARCHITECTURE.md`
   - Roadmap: `docs/IMPLEMENTATION_ROADMAP.md`
   - Templates: `templates/README.md`

2. **GitHub Issues**
   - Open issue: https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues
   - Search existing issues for solutions

3. **Community**
   - Unity Forums: https://forum.unity.com
   - Stack Overflow: Tag `unity3d` + `ridewire`

---

## ✅ Pre-Launch Checklist

Before going live:

### Development
- [ ] All scripts compile without errors
- [ ] WebSocket stable for 10+ minutes
- [ ] AI responses display correctly
- [ ] Safety rules work as expected
- [ ] XP system functional

### Testing
- [ ] Test on physical device (not just editor)
- [ ] Try low confidence scenarios
- [ ] Verify critical actions blocked
- [ ] Check database persistence
- [ ] Load test with 10+ concurrent users

### Deployment
- [ ] Unity WebGL build < 100MB
- [ ] Backend deployed to cloud
- [ ] Database backed up
- [ ] SSL certificates installed
- [ ] Analytics tracking enabled

### Documentation
- [ ] User guide written
- [ ] API documentation generated
- [ ] Troubleshooting guide complete
- [ ] Video tutorial recorded

---

**Version:** 1.0  
**Last Updated:** 2025-12-09  
**Status:** ✅ Ready for Implementation  
**Estimated Time:** 6-9 weeks to full deployment

**Built with ❤️ by the RideWire Multi-AI Team**
