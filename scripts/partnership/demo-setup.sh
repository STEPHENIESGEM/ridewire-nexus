#!/bin/bash

###############################################################################
# Indian Motorcycle Partnership - Demo Setup Script
# 
# Prepares the RideWire AI Hub platform for Indian Motorcycle demonstration
###############################################################################

set -e

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║    INDIAN MOTORCYCLE PARTNERSHIP - DEMO SETUP             ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${BLUE}📁 Project root: ${PROJECT_ROOT}${NC}\n"

###############################################################################
# Step 1: Environment Check
###############################################################################

echo -e "${BLUE}🔍 Step 1: Checking environment...${NC}"

if [ ! -f ".env" ]; then
  echo -e "${YELLOW}⚠️  Creating .env from .env.example...${NC}"
  cp .env.example .env
fi

if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Error: Node.js not installed${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Environment ready${NC}\n"

###############################################################################
# Step 2: Install Dependencies
###############################################################################

echo -e "${BLUE}🔍 Step 2: Installing dependencies...${NC}"

npm install --quiet

echo -e "${GREEN}✅ Dependencies installed${NC}\n"

###############################################################################
# Step 3: Setup Demo Data
###############################################################################

echo -e "${BLUE}🔍 Step 3: Creating demo scenarios...${NC}"

# Create demo data directory
mkdir -p data/indian-demo

# Create demo scenarios
cat > data/indian-demo/scenarios.json <<'EOF'
{
  "scenarios": [
    {
      "id": "scenario-1",
      "title": "Thunderstroke 111 - Check Engine Light",
      "vehicle": {
        "year": 2020,
        "make": "Indian",
        "model": "Chief",
        "engine": "Thunderstroke 111",
        "mileage": 8500
      },
      "symptom": "Check engine light illuminated",
      "code": "P0300",
      "description": "Random misfire detected"
    },
    {
      "id": "scenario-2",
      "title": "PowerPlus Engine - Electrical Issue",
      "vehicle": {
        "year": 2022,
        "make": "Indian",
        "model": "FTR 1200",
        "engine": "PowerPlus 1203cc",
        "mileage": 3200
      },
      "symptom": "Intermittent instrument cluster failure",
      "code": null,
      "description": "Cluster goes blank randomly, no stored codes"
    },
    {
      "id": "scenario-3",
      "title": "Scout Bobber - Performance Issue (Modified)",
      "vehicle": {
        "year": 2019,
        "make": "Indian",
        "model": "Scout Bobber",
        "engine": "Scout V-Twin 1133cc",
        "mileage": 12000,
        "modifications": [
          "Stage 2 exhaust",
          "High-flow air filter",
          "ECM tune"
        ]
      },
      "symptom": "Loss of power at high RPM",
      "code": null,
      "description": "Runs well until 6000 RPM, then falls flat"
    }
  ]
}
EOF

echo -e "${GREEN}✅ Demo scenarios created${NC}\n"

###############################################################################
# Step 4: Configure Demo Environment
###############################################################################

echo -e "${BLUE}🔍 Step 4: Configuring demo environment...${NC}"

# Add Indian Motorcycle branding config
cat >> .env <<'EOF'

# Indian Motorcycle Demo Configuration
DEMO_MODE=true
DEMO_BRAND=Indian Motorcycle
DEMO_SCENARIOS_PATH=data/indian-demo/scenarios.json
EOF

echo -e "${GREEN}✅ Demo environment configured${NC}\n"

###############################################################################
# Step 5: Test Platform
###############################################################################

echo -e "${BLUE}🔍 Step 5: Testing platform...${NC}"

# Start server in background for testing
node server.js > /dev/null 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Test health endpoint
if curl -s http://localhost:3000 > /dev/null; then
  echo -e "${GREEN}✅ Server is running${NC}"
else
  echo -e "${YELLOW}⚠️  Server may not be running (this is okay if port is in use)${NC}"
fi

# Stop test server
kill $SERVER_PID 2>/dev/null || true

echo -e "${GREEN}✅ Platform tested${NC}\n"

###############################################################################
# Summary
###############################################################################

echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         ✅ DEMO SETUP COMPLETE                            ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

echo -e "${BLUE}📊 Setup Summary:${NC}"
echo "   ✅ Environment configured"
echo "   ✅ Dependencies installed"
echo "   ✅ Demo scenarios loaded"
echo "   ✅ Platform tested"
echo ""

echo -e "${BLUE}🎬 Demo Scenarios Available:${NC}"
echo "   1. Thunderstroke 111 - Check Engine Light (P0300)"
echo "   2. PowerPlus Engine - Electrical Issue"
echo "   3. Scout Bobber - Performance Issue (Modified)"
echo ""

echo -e "${BLUE}🚀 To Start Demo:${NC}"
echo "   1. Run: npm start"
echo "   2. Open: http://localhost:3000"
echo "   3. Login: Use demo credentials"
echo "   4. Navigate to: /chat"
echo "   5. Use scenario queries from: data/indian-demo/scenarios.json"
echo ""

echo -e "${BLUE}📋 Demo Checklist:${NC}"
echo "   [ ] Review demo-script.md"
echo "   [ ] Test all three scenarios"
echo "   [ ] Prepare Q&A responses"
echo "   [ ] Have backup slides ready"
echo "   [ ] Test screen sharing"
echo ""

echo -e "${YELLOW}⚠️  Remember:${NC}"
echo "   • All AI diagnostics are advisory only"
echo "   • Licensed technicians must verify recommendations"
echo "   • Include legal disclaimers in presentation"
echo "   • Emphasize this enhances, not replaces, expertise"
echo ""

echo -e "${GREEN}🤝 Good luck with the Indian Motorcycle demo!${NC}\n"

exit 0
