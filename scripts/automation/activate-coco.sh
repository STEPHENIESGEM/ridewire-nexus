#!/bin/bash

###############################################################################
# COCO AI Influencer - Activation Script
# 
# Launches the COCO AI automation system for YouTube content generation
# 
# Usage: ./activate-coco.sh [--test]
#        --test: Run in test mode (no actual uploads)
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         COCO AI INFLUENCER - ACTIVATION SCRIPT            ║"
echo "║                                                           ║"
echo "║  Autonomous YouTube Content Generation System             ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Check if running in test mode
TEST_MODE=false
if [[ "$1" == "--test" ]]; then
  TEST_MODE=true
  echo -e "${YELLOW}⚠️  Running in TEST MODE (no actual uploads)${NC}\n"
fi

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${BLUE}📁 Project root: ${PROJECT_ROOT}${NC}\n"

###############################################################################
# Step 1: Environment Check
###############################################################################

echo -e "${BLUE}🔍 Step 1: Checking environment...${NC}"

if [ ! -f ".env" ]; then
  echo -e "${RED}❌ Error: .env file not found${NC}"
  echo "   Please create .env file with required API keys"
  echo "   See .env.example for template"
  exit 1
fi

# Check for required Node.js
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Error: Node.js not installed${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) found${NC}"

# Check for npm packages
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}⚠️  Installing dependencies...${NC}"
  npm install
fi

echo -e "${GREEN}✅ Dependencies ready${NC}\n"

###############################################################################
# Step 2: Initialize Content Calendar
###############################################################################

echo -e "${BLUE}🔍 Step 2: Initializing content calendar...${NC}"

node scripts/coco/content-calendar.js --schedule 4

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Calendar initialized with 4 weeks of content${NC}\n"
else
  echo -e "${RED}❌ Failed to initialize calendar${NC}"
  exit 1
fi

###############################################################################
# Step 3: Generate First Video
###############################################################################

echo -e "${BLUE}🔍 Step 3: Generating first video content...${NC}"

# Get next topic from queue
TOPIC=$(node -e "
const ContentCalendar = require('./scripts/coco/content-calendar.js');
const calendar = new ContentCalendar();
calendar.getNextTopic().then(topic => {
  if (topic) console.log(topic.title);
}).catch(() => process.exit(1));
")

if [ -z "$TOPIC" ]; then
  echo -e "${RED}❌ No topics in queue${NC}"
  exit 1
fi

echo -e "${GREEN}📋 Next topic: ${TOPIC}${NC}"

# Generate content
node scripts/coco/generate-content.js "$TOPIC"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Video content generated${NC}\n"
else
  echo -e "${RED}❌ Failed to generate content${NC}"
  exit 1
fi

###############################################################################
# Step 4: Analytics Setup
###############################################################################

echo -e "${BLUE}🔍 Step 4: Setting up analytics tracking...${NC}"

node scripts/coco/analytics-tracker.js

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Analytics initialized${NC}\n"
else
  echo -e "${YELLOW}⚠️  Analytics setup had issues (non-fatal)${NC}\n"
fi

###############################################################################
# Step 5: Verify Configuration
###############################################################################

echo -e "${BLUE}🔍 Step 5: Verifying configuration...${NC}"

# Check for required environment variables
required_vars=("OPENAI_API_KEY" "ELEVENLABS_API_KEY" "DID_API_KEY")
missing_vars=()

for var in "${required_vars[@]}"; do
  if ! grep -q "^${var}=" .env 2>/dev/null || [ -z "$(grep "^${var}=" .env | cut -d '=' -f2)" ]; then
    missing_vars+=("$var")
  fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
  echo -e "${YELLOW}⚠️  Warning: Missing API keys:${NC}"
  for var in "${missing_vars[@]}"; do
    echo "   - $var"
  done
  echo -e "${YELLOW}   Content generation will run in simulation mode${NC}\n"
else
  echo -e "${GREEN}✅ All required API keys configured${NC}\n"
fi

###############################################################################
# Summary
###############################################################################

echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                 ✅ COCO AI ACTIVATED                      ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${BLUE}📊 System Status:${NC}"
echo "   ✅ Content calendar: Initialized"
echo "   ✅ First video: Generated"
echo "   ✅ Analytics: Ready"
echo ""

echo -e "${BLUE}📅 Publishing Schedule:${NC}"
echo "   Monday, Wednesday, Friday at 9:00 AM"
echo ""

echo -e "${BLUE}🎬 Next Steps:${NC}"
echo "   1. Review generated content in: output/coco-videos/"
echo "   2. Set up GitHub Actions for automation (see .github/workflows/)"
echo "   3. Configure YouTube OAuth for uploads"
echo "   4. Monitor analytics with: node scripts/coco/analytics-tracker.js"
echo ""

echo -e "${BLUE}📚 Quick Commands:${NC}"
echo "   Generate video:  node scripts/coco/generate-content.js \"Topic\""
echo "   View schedule:   node scripts/coco/content-calendar.js"
echo "   Check analytics: node scripts/coco/analytics-tracker.js"
echo "   Upload video:    node scripts/coco/youtube-uploader.js <metadata-file>"
echo ""

echo -e "${YELLOW}⚠️  IMPORTANT DISCLAIMERS:${NC}"
echo "   • All generated content is educational only"
echo "   • Users should verify all automotive information with professionals"
echo "   • RideWire does not replace certified mechanics"
echo "   • Monitor content for accuracy before publishing"
echo ""

if [ "$TEST_MODE" = true ]; then
  echo -e "${YELLOW}🧪 Test mode complete - no uploads performed${NC}\n"
else
  echo -e "${GREEN}🚀 COCO AI is ready for automated content generation!${NC}\n"
fi

exit 0
