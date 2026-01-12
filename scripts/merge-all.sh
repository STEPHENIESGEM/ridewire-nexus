#!/bin/bash

##############################################################################
# Automated Merge Script for RideWire AI Hub
# This script merges all ready PRs and closes all resolved issues
##############################################################################

set -e  # Exit on error

echo "🚀 Starting automated merge process for RideWire AI Hub"
echo "========================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in RideWire AI Hub root directory${NC}"
    exit 1
fi

echo -e "${GREEN}✅ In correct directory${NC}"
echo ""

# Function to merge a PR
merge_pr() {
    local pr_number=$1
    local branch_name=$2
    local description=$3
    
    echo "📦 Merging PR #${pr_number}: ${description}"
    echo "   Branch: ${branch_name}"
    
    # Fetch latest
    git fetch origin ${branch_name} || {
        echo -e "${YELLOW}⚠️  Could not fetch branch ${branch_name}, skipping${NC}"
        return 1
    }
    
    # Attempt merge
    git merge --no-ff origin/${branch_name} -m "Merge PR #${pr_number}: ${description}" || {
        echo -e "${RED}❌ Merge conflict on PR #${pr_number}${NC}"
        echo "   Please resolve conflicts manually"
        git merge --abort
        return 1
    }
    
    echo -e "${GREEN}✅ Successfully merged PR #${pr_number}${NC}"
    echo ""
    return 0
}

# Store current branch
ORIGINAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Current branch: ${ORIGINAL_BRANCH}"
echo ""

# Switch to main
echo "🔄 Switching to main branch..."
git checkout main || {
    echo -e "${RED}❌ Could not checkout main branch${NC}"
    exit 1
}

# Pull latest
echo "📥 Pulling latest changes from main..."
git pull origin main || {
    echo -e "${YELLOW}⚠️  Could not pull from main, continuing anyway${NC}"
}
echo ""

##############################################################################
# PHASE 1: MERGE CORE INFRASTRUCTURE
##############################################################################

echo "========================================================"
echo "PHASE 1: Merging Core Infrastructure PRs"
echo "========================================================"
echo ""

# PR #18: Fix all page not found errors
merge_pr 18 "copilot/fix-page-not-found-errors" "Complete React Router navigation system"

# PR #17: Configure Copilot instructions  
merge_pr 17 "copilot/setup-copilot-instructions" "Copilot instructions with legal disclaimers"

# PR #6: Game Engine Integration Design
merge_pr 6 "feature/game-engine-integration-design" "Game engine integration architecture"

echo -e "${GREEN}✅ Phase 1 complete: Core infrastructure merged${NC}"
echo ""

##############################################################################
# PHASE 2: MERGE IMPROVEMENTS
##############################################################################

echo "========================================================"
echo "PHASE 2: Merging Improvement PRs"
echo "========================================================"
echo ""

# PR #12: Fix logic errors
merge_pr 12 "copilot/sub-pr-6" "Logic fixes for game engine templates"

echo -e "${GREEN}✅ Phase 2 complete: Improvements merged${NC}"
echo ""

##############################################################################
# PHASE 3: MERGE DOCUMENTATION
##############################################################################

echo "========================================================"
echo "PHASE 3: Merging Documentation PRs"
echo "========================================================"
echo ""

# PR #19: NOVA landing page
merge_pr 19 "copilot/create-repo-for-nova" "NOVA landing page for GitHub Pages"

# PR #11: Executive Action Plan (MASSIVE)
echo "⚠️  PR #11 is very large (69 documents), merging with caution..."
merge_pr 11 "copilot/merge-game-engine-design" "Executive action plan and strategy"

echo -e "${GREEN}✅ Phase 3 complete: Documentation merged${NC}"
echo ""

##############################################################################
# PHASE 4: PUSH TO REMOTE
##############################################################################

echo "========================================================"
echo "PHASE 4: Pushing changes to remote"
echo "========================================================"
echo ""

echo "📤 Pushing all merged changes to origin/main..."
git push origin main || {
    echo -e "${RED}❌ Failed to push to remote${NC}"
    echo "   You may need to push manually: git push origin main"
    exit 1
}

echo -e "${GREEN}✅ Successfully pushed all changes to remote${NC}"
echo ""

##############################################################################
# PHASE 5: SUMMARY
##############################################################################

echo "========================================================"
echo "✨ MERGE PROCESS COMPLETE"
echo "========================================================"
echo ""
echo "Summary:"
echo "  ✅ Merged PR #18 (Navigation fixes)"
echo "  ✅ Merged PR #17 (Copilot instructions)"
echo "  ✅ Merged PR #6  (Game engine design)"
echo "  ✅ Merged PR #12 (Logic fixes)"
echo "  ✅ Merged PR #19 (NOVA landing page)"
echo "  ✅ Merged PR #11 (Executive action plan)"
echo ""
echo "Next Steps:"
echo "  1. Close issues #14, #16, #20 (resolved by merged PRs)"
echo "  2. Close PRs #5, #13, #15, #4 (superseded/duplicates)"
echo "  3. Run link checker: node scripts/link-checker.js"
echo "  4. Test all routes manually"
echo "  5. Create release tag"
echo ""
echo "To close issues and PRs, you'll need GitHub CLI (gh) or do it manually."
echo ""
echo "Return to original branch:"
echo "  git checkout ${ORIGINAL_BRANCH}"
echo ""
echo -e "${GREEN}🎉 All done! Thank you!${NC}"
