# Implementation Roadmap: Game Engine Integration

## Overview

This roadmap breaks down the game engine integration into **3 phases** with concrete deliverables, timelines, and success metrics. Designed for **zero-coding implementation** using provided templates and copy-paste instructions.

---

## Phase 1: Core Game Loop & AR Basics

**Duration:** 2-3 Weeks  
**Goal:** Establish Unity-Backend connection with basic AR functionality

### Sprint 1.1: Unity Project Setup (Week 1, Days 1-3)

#### Deliverables
- [ ] Unity 2022.3 LTS installed with WebGL + AR Foundation modules
- [ ] Base Unity project created from template
- [ ] AR Foundation configured for iOS ARKit + Android ARCore
- [ ] Test scene with AR marker detection working

#### Tasks (Copy-Paste Steps)

1. **Install Unity Hub**
   ```
   Download from: https://unity.com/download
   Install Unity 2022.3 LTS
   Add modules: WebGL Build Support, AR Foundation, XR Plugin Management
   ```

2. **Create New Project**
   ```
   Unity Hub → Projects → New Project
   Template: 3D (Core)
   Name: RideWire-AR-Diagnostic
   Location: /ridewire-ai-hub/unity-project/
   ```

3. **Install Required Packages**
   ```
   Unity → Window → Package Manager
   Install: AR Foundation 5.0+
   Install: ARCore XR Plugin (Android)
   Install: ARKit XR Plugin (iOS)
   ```

4. **Import Provided Scripts**
   ```
   Copy files from /templates/ to /unity-project/Assets/Scripts/
   - GameEngineSDK.cs
   - AIResponseMapper.cs
   - HUDManager.cs
   - SafetyRuleEngine.cs
   ```

5. **Test AR Setup**
   ```
   Create new scene: DiagnosticARScene
   Add AR Session + AR Session Origin objects
   Add AR Plane Manager component
   Build to device and test plane detection
   ```

#### Success Metrics
- ✅ Unity opens project without errors
- ✅ AR camera feed displays on mobile device
- ✅ Planes detected and visualized with debug overlay
- ✅ Build size < 50MB for initial WebGL export

---

### Sprint 1.2: Backend WebSocket Integration (Week 1, Days 4-7)

#### Deliverables
- [ ] Socket.IO installed and configured on Node.js backend
- [ ] WebSocket server listening on `/ws/game` endpoint
- [ ] Basic query → response flow working (no AI yet, mock data)
- [ ] Unity C# WebSocket client connected to backend

#### Tasks

1. **Install Backend Dependencies**
   ```bash
   cd /ridewire-ai-hub
   npm install socket.io
   npm install cors
   ```

2. **Add WebSocket Server to `server.js`**
   ```javascript
   // Copy-paste this into server.js after line 14
   const http = require('http');
   const socketIO = require('socket.io');
   const server = http.createServer(app);
   const io = socketIO(server, {
     cors: {
       origin: '*',
       methods: ['GET', 'POST']
     }
   });

   io.on('connection', (socket) => {
     console.log('Game client connected:', socket.id);
     
     socket.on('diagnostic-query', async (data) => {
       console.log('Received query:', data.query);
       // Mock response for now
       socket.emit('consensus-update', {
         queryId: data.queryId,
         consensus: 'Mock diagnostic result',
         overallConfidence: 85,
         safetyZone: 'green'
       });
     });

     socket.on('disconnect', () => {
       console.log('Game client disconnected:', socket.id);
     });
   });

   // Change app.listen to server.listen
   server.listen(port, () => {
     console.log(`Server running on port ${port}`);
   });
   ```

3. **Configure Unity WebSocket Client**
   ```
   Open Unity → Scripts → GameEngineSDK.cs
   Set backendURL = "ws://localhost:3000/ws/game" (line 12)
   Save and reload Unity
   ```

4. **Test Connection**
   ```bash
   # Terminal 1: Start backend
   npm start

   # Terminal 2: Unity Play mode
   Click Play in Unity Editor
   Check console for "Connected to backend" message
   Submit test query via Unity UI
   Verify mock response appears in HUD
   ```

#### Success Metrics
- ✅ WebSocket connection established (see console logs)
- ✅ Query sent from Unity → Backend receives it
- ✅ Backend sends mock response → Unity displays it
- ✅ Connection stable for 5 minutes without drops

---

### Sprint 1.3: Basic AR Overlays (Week 2, Days 1-4)

#### Deliverables
- [ ] AR overlay system rendering text labels on detected planes
- [ ] 3D arrow indicators pointing to vehicle components
- [ ] Color-coded overlays based on safety zones (red/yellow/green/teal)
- [ ] Overlays persist and track with AR world space

#### Tasks

1. **Create Overlay Prefabs**
   ```
   Unity → Assets → Create → Prefab
   Create 4 prefabs:
   - TextLabelOverlay (TextMeshPro component)
   - ArrowIndicator (3D arrow mesh)
   - HighlightCircle (Circle mesh with glow shader)
   - DiagramPanel (Quad with texture)
   ```

2. **Configure Overlay Renderer Script**
   ```csharp
   // Open AROverlayRenderer.cs (provided in templates)
   // Attach to AR Session Origin object
   // Drag prefabs into Inspector slots
   ```

3. **Test Overlay Spawning**
   ```
   Play mode → Point camera at table/floor
   Click "Spawn Test Overlay" button
   Verify label appears and tracks with camera movement
   Change safety zone → Label color updates
   ```

4. **Connect to WebSocket Data**
   ```csharp
   // In AIResponseMapper.cs (line 45)
   // When consensus received, spawn overlays:
   foreach (var overlay in response.arOverlays) {
     AROverlayRenderer.SpawnOverlay(overlay);
   }
   ```

#### Success Metrics
- ✅ Text labels render in AR space
- ✅ Overlays stay anchored to world position
- ✅ Colors change based on confidence (red < 60%, yellow 60-74%, green 75-84%, teal 85%+)
- ✅ Multiple overlays render simultaneously without overlap

---

### Sprint 1.4: HUD & UI Panels (Week 2, Days 5-7)

#### Deliverables
- [ ] Multi-AI panel showing ChatGPT, Claude, Gemini responses
- [ ] Consensus banner at top of screen
- [ ] Safety shield indicator around action buttons
- [ ] XP progress bar at bottom

#### Tasks

1. **Design UI Layout in Unity**
   ```
   GameObject → UI → Canvas (Screen Space - Overlay)
   Add child objects:
   - Top: Consensus Banner (TextMeshPro)
   - Left: Multi-AI Panel (Vertical Layout Group)
     - ChatGPT Response Box
     - Claude Response Box
     - Gemini Response Box
   - Right: Vehicle Info Panel
   - Bottom: XP Progress Bar (Slider component)
   ```

2. **Attach HUDManager Script**
   ```
   Select Canvas → Add Component → HUDManager.cs
   Link UI elements in Inspector (drag & drop)
   ```

3. **Style UI Elements**
   ```
   Apply provided UI theme from config/game-engine.config.json:
   - Font: Roboto (included in templates/fonts/)
   - Primary color: #00C7BE (teal)
   - Background: #1C1C1E (dark gray)
   - Text: #FFFFFF (white)
   ```

4. **Test HUD Updates**
   ```
   Play mode → Send mock query
   Verify:
   - Multi-AI panel fills with responses sequentially
   - Consensus banner appears when all 3 AIs respond
   - Progress bar animates when XP gained
   ```

#### Success Metrics
- ✅ All UI elements visible and readable
- ✅ HUD updates within 100ms of data received
- ✅ Responsive on different screen sizes (phone/tablet)
- ✅ No UI elements overlap or clip

---

### Phase 1 Success Criteria

| Metric | Target | Status |
|--------|--------|--------|
| **Unity-Backend Connection** | Stable WebSocket | ⬜ |
| **AR Plane Detection** | 90%+ accuracy | ⬜ |
| **Overlay Rendering** | < 100ms latency | ⬜ |
| **HUD Update Speed** | < 50ms | ⬜ |
| **Build Size** | < 75MB (WebGL) | ⬜ |

**End of Phase 1 Demo:**
- User opens app → AR camera activates
- User taps "Diagnose" → Sends mock query
- HUD shows 3 AI panels with mock responses
- Consensus banner displays final result
- AR overlay spawns on detected plane

---

## Phase 2: Multi-AI Consensus Integration

**Duration:** 2-3 Weeks  
**Goal:** Connect real AI providers and implement consensus algorithm

### Sprint 2.1: Real AI Integration (Week 3, Days 1-4)

#### Deliverables
- [ ] `MultiAIOrchestrator.js` connected to WebSocket flow
- [ ] ChatGPT, Claude, Gemini APIs queried in parallel
- [ ] Real AI responses streamed to Unity as they arrive
- [ ] Error handling for API failures

#### Tasks

1. **Verify API Keys**
   ```bash
   # Edit .env file
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   GOOGLE_API_KEY=AI...
   ```

2. **Modify WebSocket Handler in `server.js`**
   ```javascript
   // Replace mock response with real orchestrator call
   socket.on('diagnostic-query', async (data) => {
     const orchestrator = new MultiAIOrchestrator();
     
     // Stream partial responses
     orchestrator.on('partial-response', (aiName, response) => {
       socket.emit('ai-response-partial', {
         provider: aiName,
         content: response,
         confidence: calculateConfidence(response)
       });
     });

     // Send final consensus
     const consensus = await orchestrator.queryAllAgents(data.query);
     socket.emit('consensus-update', consensus);
   });
   ```

3. **Test with Real Queries**
   ```
   Unity Play mode → Enter: "What does P0300 mean?"
   Backend queries all 3 AIs → Responses stream to Unity
   Verify HUD updates as each AI responds
   ```

#### Success Metrics
- ✅ All 3 AI providers respond within 3 seconds
- ✅ Partial responses stream to UI in real-time
- ✅ API errors logged but don't crash app
- ✅ Consensus calculated correctly when all respond

---

### Sprint 2.2: Consensus Algorithm (Week 3, Days 5-7)

#### Deliverables
- [ ] Weighted confidence scoring implemented
- [ ] Conflict detection between AI responses
- [ ] Consensus text generation from multiple sources
- [ ] Safety zone calculation (red/yellow/green/teal)

#### Tasks

1. **Implement Confidence Scoring**
   ```javascript
   // Add to MultiAIOrchestrator.js
   calculateOverallConfidence(responses) {
     const weights = { ChatGPT: 0.35, Claude: 0.35, Gemini: 0.30 };
     let weightedSum = 0;
     
     for (const [ai, response] of Object.entries(responses)) {
       weightedSum += response.confidence * weights[ai];
     }
     
     return weightedSum;
   }
   ```

2. **Detect Conflicts**
   ```javascript
   // Add conflict detection logic
   detectConflicts(responses) {
     const confidences = Object.values(responses).map(r => r.confidence);
     const max = Math.max(...confidences);
     const min = Math.min(...confidences);
     
     return (max - min) > 30; // 30% difference = conflict
   }
   ```

3. **Generate Consensus Text**
   ```javascript
   // Use AI to summarize consensus
   async generateConsensus(responses) {
     const summary = await this.queryChatGPT(
       `Summarize these diagnoses: ${JSON.stringify(responses)}`
     );
     return summary;
   }
   ```

4. **Calculate Safety Zone**
   ```javascript
   getSafetyZone(confidence) {
     if (confidence < 60) return 'red';
     if (confidence < 75) return 'yellow';
     if (confidence < 85) return 'green';
     return 'teal';
   }
   ```

#### Success Metrics
- ✅ Confidence scores accurate within 5%
- ✅ Conflicts detected when AIs disagree significantly
- ✅ Consensus text coherent and actionable
- ✅ Safety zones map correctly to confidence ranges

---

### Sprint 2.3: Safety Rule Engine (Week 4, Days 1-4)

#### Deliverables
- [ ] `SafetyRuleEngine.ts` evaluating rules before actions
- [ ] Critical actions blocked when confidence < 70%
- [ ] Warning dialogs for yellow zone (60-74%)
- [ ] Veto system for conflicting AI opinions

#### Tasks

1. **Define Safety Rules**
   ```typescript
   // In SafetyRuleEngine.ts
   const CRITICAL_ACTIONS = [
     'engine_disable',
     'fuel_cutoff',
     'brake_override'
   ];

   const RULES = [
     {
       ruleId: 'low-confidence-critical',
       condition: (consensus, action) => {
         return CRITICAL_ACTIONS.includes(action.type) &&
                consensus.overallConfidence < 70;
       },
       action: 'block',
       message: 'Confidence too low for critical action'
     }
   ];
   ```

2. **Integrate with HUD**
   ```csharp
   // In HUDManager.cs
   public void OnActionButtonClicked(string actionType) {
     bool isSafe = SafetyRuleEngine.ValidateAction(
       currentConsensus,
       actionType
     );
     
     if (!isSafe) {
       ShowWarningDialog("Action blocked by safety rules");
       return;
     }
     
     ExecuteAction(actionType);
   }
   ```

3. **Test Safety Gates**
   ```
   Simulate low confidence (< 60%) → Try engine disable → Blocked
   Simulate yellow zone (65%) → Try component replace → Warning shown
   Simulate high confidence (90%) → Action executes immediately
   ```

#### Success Metrics
- ✅ Critical actions blocked at < 70% confidence
- ✅ Warning dialogs appear for yellow zone actions
- ✅ Veto triggers when single AI confidence < 40%
- ✅ No false positives (safe actions always allowed)

---

### Sprint 2.4: Database Integration (Week 4, Days 5-7)

#### Deliverables
- [ ] Diagnostic history stored in PostgreSQL
- [ ] User XP/level tracking in database
- [ ] Query logs with timestamps and consensus results
- [ ] Retrieve past diagnostics from database

#### Tasks

1. **Create Database Tables**
   ```sql
   -- Add to schema.sql
   CREATE TABLE diagnostics (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id),
     query_id VARCHAR(255) UNIQUE,
     vehicle_id VARCHAR(255),
     query TEXT,
     consensus TEXT,
     overall_confidence FLOAT,
     safety_zone VARCHAR(10),
     timestamp TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE user_progress (
     user_id INTEGER PRIMARY KEY REFERENCES users(id),
     xp INTEGER DEFAULT 0,
     level INTEGER DEFAULT 1,
     achievements JSONB DEFAULT '[]'
   );
   ```

2. **Add Storage Endpoints**
   ```javascript
   // In server.js
   app.post('/api/game/save-diagnostic', async (req, res) => {
     const { queryId, userId, consensus } = req.body;
     await pool.query(
       'INSERT INTO diagnostics (query_id, user_id, consensus, ...) VALUES ($1, $2, $3, ...)',
       [queryId, userId, consensus, ...]
     );
     res.json({ success: true });
   });
   ```

3. **Implement XP System**
   ```javascript
   // Add XP calculation based on query complexity
   function calculateXP(consensus) {
     const baseXP = 10;
     const confidenceBonus = consensus.overallConfidence * 0.5;
     const complexityBonus = consensus.aiResponses.length * 5;
     return baseXP + confidenceBonus + complexityBonus;
   }
   ```

#### Success Metrics
- ✅ All diagnostics saved to database
- ✅ XP updates correctly after each query
- ✅ User can retrieve past diagnostics
- ✅ Database queries execute in < 50ms

---

### Phase 2 Success Criteria

| Metric | Target | Status |
|--------|--------|--------|
| **AI Response Time** | < 3 seconds | ⬜ |
| **Consensus Accuracy** | 90%+ agreement | ⬜ |
| **Safety Veto Triggers** | 100% for critical | ⬜ |
| **Database Persistence** | 100% queries saved | ⬜ |
| **Error Rate** | < 1% API failures | ⬜ |

**End of Phase 2 Demo:**
- User scans vehicle → Submits real diagnostic query
- 3 real AIs respond with analyses
- Consensus calculated and displayed
- Safety check passes → AR overlays appear
- XP awarded and stored in database
- Past diagnostics viewable in history

---

## Phase 3: Full Gamification & Polish

**Duration:** 2-3 Weeks  
**Goal:** Add progression system, achievements, and production-ready features

### Sprint 3.1: Gamification System (Week 5, Days 1-4)

#### Deliverables
- [ ] XP and level system fully functional
- [ ] Achievement system (badges, milestones)
- [ ] Mission/quest system for guided diagnostics
- [ ] Leaderboard integration

#### Tasks

1. **Design Progression Curve**
   ```javascript
   // In config/game-engine.config.json
   "progression": {
     "xpPerLevel": [
       100,   // Level 1 → 2
       250,   // Level 2 → 3
       500,   // Level 3 → 4
       1000,  // Level 4 → 5
       2000   // Level 5 → 6
     ],
     "levelTitles": [
       "Apprentice Mechanic",
       "Junior Technician",
       "Senior Technician",
       "Master Mechanic",
       "Diagnostic Expert"
     ]
   }
   ```

2. **Create Achievement Definitions**
   ```json
   "achievements": [
     {
       "id": "first_diagnosis",
       "name": "First Diagnosis",
       "description": "Complete your first vehicle diagnostic",
       "xp_reward": 50,
       "icon": "badge_first.png"
     },
     {
       "id": "perfect_consensus",
       "name": "Perfect Consensus",
       "description": "Get 100% AI agreement on a diagnosis",
       "xp_reward": 100,
       "icon": "badge_perfect.png"
     }
   ]
   ```

3. **Implement Mission System**
   ```javascript
   // Add mission tracking to backend
   const MISSIONS = [
     {
       id: 'diagnose_5_vehicles',
       objective: 'Complete 5 vehicle diagnostics',
       progress_max: 5,
       reward_xp: 200
     }
   ];
   ```

4. **Add to Unity HUD**
   ```csharp
   // In HUDManager.cs
   public void ShowLevelUpAnimation(int newLevel) {
     levelUpPanel.SetActive(true);
     levelText.text = $"Level {newLevel}!";
     PlayConfetti();
   }
   ```

#### Success Metrics
- ✅ XP gains trigger level-ups correctly
- ✅ Achievements unlock at proper milestones
- ✅ Mission progress tracks accurately
- ✅ Level-up animation plays smoothly

---

### Sprint 3.2: Vehicle Library & AR Markers (Week 5, Days 5-7)

#### Deliverables
- [ ] Vehicle model library with 5+ cars
- [ ] AR marker detection for specific vehicle components
- [ ] Automatic overlay positioning based on vehicle model
- [ ] Fallback to generic overlays when model unknown

#### Tasks

1. **Add Vehicle Models**
   ```bash
   # Download free vehicle GLB models
   mkdir /ridewire-ai-hub/public/models/
   # Sources: Sketchfab, TurboSquid (free section)
   # Add: toyota_camry_2020.glb, ford_f150_2019.glb, etc.
   ```

2. **Create Vehicle Metadata**
   ```json
   // In config/game-engine.config.json
   "vehicles": [
     {
       "id": "toyota_camry_2020",
       "model": "Toyota Camry",
       "year": 2020,
       "glb_path": "/models/toyota_camry_2020.glb",
       "components": {
         "engine": { "x": 0, "y": 0.5, "z": 1.2 },
         "spark_plug_1": { "x": -0.2, "y": 0.6, "z": 1.0 }
       }
     }
   ]
   ```

3. **Implement AR Marker Recognition**
   ```csharp
   // In AROverlayRenderer.cs
   public void OnImageRecognized(string vehicleId) {
     VehicleMetadata vehicle = LoadVehicleData(vehicleId);
     SpawnVehicleModel(vehicle.glb_path);
     PositionOverlays(vehicle.components);
   }
   ```

4. **Test with Real Vehicles**
   ```
   Print AR marker → Place on car hood
   Open app → Point camera at marker
   Verify correct vehicle model loads
   Check overlays align with actual components
   ```

#### Success Metrics
- ✅ 5+ vehicle models load correctly
- ✅ Marker detection works in various lighting
- ✅ Overlays positioned within 5cm accuracy
- ✅ Generic fallback works for unknown vehicles

---

### Sprint 3.3: Production Polish (Week 6, Days 1-4)

#### Deliverables
- [ ] Loading screens and progress indicators
- [ ] Error messages user-friendly
- [ ] Performance optimization (60 FPS on mobile)
- [ ] Accessibility features (text size, color blind mode)

#### Tasks

1. **Add Loading Screen**
   ```csharp
   // Create LoadingScreen.cs
   public class LoadingScreen : MonoBehaviour {
     public Slider progressBar;
     
     public IEnumerator LoadScene() {
       yield return StartCoroutine(LoadAssets());
       progressBar.value = 0.5f;
       
       yield return StartCoroutine(ConnectBackend());
       progressBar.value = 1.0f;
       
       SceneManager.LoadScene("DiagnosticARScene");
     }
   }
   ```

2. **Optimize Performance**
   ```
   Unity → Edit → Project Settings → Quality
   - Set Shadow Distance: 50m
   - Disable Soft Particles
   - Set Texture Quality: Medium
   - Enable Occlusion Culling
   ```

3. **Add Accessibility Options**
   ```json
   // In settings menu
   "accessibility": {
     "text_size": ["small", "medium", "large"],
     "color_blind_mode": ["none", "deuteranopia", "protanopia"],
     "reduce_motion": true
   }
   ```

4. **Test on Multiple Devices**
   ```
   Test matrix:
   - iPhone 12 (iOS 16)
   - Samsung Galaxy S21 (Android 12)
   - iPad Pro 2021
   - Low-end device: Moto G7
   ```

#### Success Metrics
- ✅ Loading screen under 5 seconds
- ✅ 60 FPS maintained on mid-range devices
- ✅ Accessible to users with color blindness
- ✅ No crashes after 30 minutes of use

---

### Sprint 3.4: Deployment & Documentation (Week 6, Days 5-7)

#### Deliverables
- [ ] Unity WebGL build deployed to production
- [ ] Backend deployed to cloud (Heroku/Render/Fly.io)
- [ ] User guide with screenshots
- [ ] API documentation for developers

#### Tasks

1. **Build Unity WebGL**
   ```
   Unity → File → Build Settings
   Platform: WebGL
   Compression Format: Brotli
   Code Optimization: Size
   Build → /frontend/public/unity-build/
   ```

2. **Deploy Backend**
   ```bash
   # Option 1: Heroku
   heroku create ridewire-ai-hub
   git push heroku main

   # Option 2: Render (render.yaml provided)
   git push origin main
   # Auto-deploys via Render webhook
   ```

3. **Create User Guide**
   ```markdown
   # docs/USER_GUIDE.md
   ## Getting Started
   1. Download RideWire app
   2. Create account
   3. Point camera at vehicle
   4. Tap "Diagnose"
   ## Screenshots included in docs/screenshots/
   ```

4. **Generate API Docs**
   ```bash
   npm install -g apidoc
   apidoc -i . -o docs/api-documentation/
   ```

#### Success Metrics
- ✅ App loads in production within 3 seconds
- ✅ Backend handles 100 concurrent users
- ✅ User guide comprehensive and clear
- ✅ API docs auto-generated and accurate

---

### Phase 3 Success Criteria

| Metric | Target | Status |
|--------|--------|--------|
| **Gamification Engagement** | 80%+ users level up | ⬜ |
| **Vehicle Recognition** | 95%+ accuracy | ⬜ |
| **Performance (FPS)** | 60 FPS sustained | ⬜ |
| **Production Uptime** | 99.9% availability | ⬜ |
| **User Onboarding** | < 2 minutes to first diagnosis | ⬜ |

**End of Phase 3 Demo (Final Product):**
- User downloads app → Completes onboarding
- Scans real vehicle → AR marker detected
- Asks diagnostic question → 3 AIs respond
- Consensus displayed with AR overlays
- XP gained → Levels up → Achievement unlocked
- Mission progress updated → Next quest shown
- Saves diagnostic to history → Can share report

---

## Timeline Summary

| Phase | Duration | Key Milestones |
|-------|----------|----------------|
| **Phase 1** | 2-3 weeks | Unity setup, WebSocket connection, basic AR overlays, HUD panels |
| **Phase 2** | 2-3 weeks | Real AI integration, consensus algorithm, safety rules, database |
| **Phase 3** | 2-3 weeks | Gamification, vehicle library, polish, production deployment |
| **TOTAL** | **6-9 weeks** | Fully functional AR diagnostic game with multi-AI consensus |

---

## Resource Requirements

### Human Resources
- **Project Manager**: 1 person (oversees timeline, coordinates AI collaboration)
- **Unity Asset Importer**: 1 person (drag-and-drop vehicle models, configure prefabs)
- **Backend Deployer**: 1 person (run deployment commands, monitor logs)
- **Tester**: 1 person (test on physical devices, report bugs)

**Note:** No developers required! All code provided in `/templates/`.

### Infrastructure
- **Unity Cloud Build**: Free tier (100 minutes/month)
- **Backend Hosting**: Render free tier or Heroku Hobby ($7/month)
- **Database**: PostgreSQL (Supabase free tier or Heroku add-on)
- **CDN**: Cloudflare free tier for Unity WebGL assets

### Estimated Costs
| Item | Cost |
|------|------|
| Unity Personal (free for < $100k revenue) | $0 |
| Backend hosting | $0-7/month |
| Database | $0-5/month |
| AI API calls (OpenAI, Anthropic, Google) | ~$20/month (500 queries) |
| **TOTAL** | **$20-32/month** |

---

## Risk Mitigation

### Risk: Unity Build Fails
- **Mitigation**: Use provided Unity 2022.3 LTS (stable version)
- **Backup**: Export as Android APK instead of WebGL

### Risk: AI API Costs Exceed Budget
- **Mitigation**: Implement request caching, rate limiting
- **Backup**: Use only 2 AIs instead of 3 for lower-tier users

### Risk: AR Marker Detection Unreliable
- **Mitigation**: Use high-contrast markers, improve lighting instructions
- **Backup**: Fall back to manual vehicle model selection

### Risk: Performance Too Slow on Low-End Devices
- **Mitigation**: Offer "Lite Mode" with reduced graphics
- **Backup**: Web-only version without Unity (React + AR.js)

---

## Success Metrics (Overall Project)

### Technical Metrics
- ✅ Query response time: < 3 seconds (AI request → display)
- ✅ AR overlay accuracy: Within 5cm of actual component
- ✅ Uptime: 99.5%+ in production
- ✅ Build size: < 100MB (Unity WebGL)
- ✅ Frame rate: 60 FPS on iPhone 12 / Galaxy S21

### User Metrics
- ✅ Onboarding completion: 90%+ of new users
- ✅ Daily active users: 50%+ return next day
- ✅ Average diagnostics per user: 5+ per week
- ✅ User satisfaction: 4.5+ stars on app stores

### Business Metrics
- ✅ API cost per query: < $0.10
- ✅ Infrastructure cost: < $50/month for 1000 users
- ✅ Time to first diagnosis: < 2 minutes
- ✅ Consensus accuracy: 90%+ user agreement with AI recommendation

---

## Post-Launch Roadmap (Phase 4+)

### Month 1-3 After Launch
- [ ] Add 20+ vehicle models to library
- [ ] Integrate OBD-II scanner for real-time sensor data
- [ ] Implement social features (share diagnostics with friends)
- [ ] Add voice commands ("Hey RideWire, diagnose my engine")

### Month 4-6
- [ ] Release iOS/Android native apps (export from Unity)
- [ ] Add repair shop locator (API integration)
- [ ] Implement AR-guided repair tutorials
- [ ] Launch premium tier with unlimited diagnostics

### Month 7-12
- [ ] Expand to other industries (HVAC, appliances, electronics)
- [ ] Add 5+ AI providers (Mistral, Llama, custom models)
- [ ] White-label solution for auto shops
- [ ] B2B API for fleet management companies

---

## Appendix: Command Cheat Sheet

### Quick Start Commands
```bash
# Clone repository
git clone https://github.com/STEPHENIESGEM/ridewire-ai-hub.git
cd ridewire-ai-hub

# Install dependencies
npm install

# Start backend
npm start

# Open Unity project
# Unity Hub → Open → /ridewire-ai-hub/unity-project/

# Build Unity WebGL
# Unity → File → Build Settings → WebGL → Build

# Deploy to Render
git push origin main
# Auto-deploys via webhook
```

### Troubleshooting Commands
```bash
# Check backend logs
npm start | tee backend.log

# Test WebSocket connection
curl -i -N -H "Connection: Upgrade" \
     -H "Upgrade: websocket" \
     http://localhost:3000/ws/game

# Verify database connection
psql $DATABASE_URL -c "SELECT * FROM users LIMIT 1;"

# Check Unity build errors
# Unity → Window → Console (filter: Errors only)
```

---

**Version:** 1.0  
**Last Updated:** 2025-12-09  
**Status:** ✅ Ready for Implementation  
**Estimated Completion:** 6-9 weeks from start
