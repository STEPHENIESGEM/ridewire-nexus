#!/bin/bash

################################################################################
# RideWire AI Hub - Complete Deployment Script
# 
# This script orchestrates the complete deployment of RideWire AI Hub to
# production, including all validation checks, database setup, and service
# activation.
#
# PREREQUISITES:
# - PostgreSQL database provisioned and accessible
# - All environment variables configured in .env file
# - API keys for OpenAI, Anthropic, and Google AI
# - Node.js 16+ and npm installed
# - Production hosting environment configured
#
# USAGE:
#   ./scripts/deploy-all.sh [options]
#
# OPTIONS:
#   --dry-run         Run validation checks only (no deployment)
#   --skip-tests      Skip automated testing (not recommended)
#   --skip-db-init    Skip database initialization
#   --help            Show this help message
#
# LEGAL DISCLAIMER:
# This deployment script is for the RideWire AI Hub platform, which provides
# AI-powered automotive diagnostic assistance. All AI-generated content is for
# informational purposes only and does not replace professional automotive
# services. Always consult qualified mechanics for vehicle diagnostics and
# repairs.
################################################################################

set -e  # Exit on error
set -o pipefail  # Catch errors in pipelines

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_FILE="${PROJECT_ROOT}/deployment-$(date +%Y%m%d-%H%M%S).log"

# Deployment flags
DRY_RUN=false
SKIP_TESTS=false
SKIP_DB_INIT=false

################################################################################
# Utility Functions
################################################################################

log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${BLUE}ℹ${NC} $@" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}✓${NC} $@" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $@" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}✗${NC} $@" | tee -a "$LOG_FILE"
}

log_section() {
    echo "" | tee -a "$LOG_FILE"
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}" | tee -a "$LOG_FILE"
    echo -e "${CYAN}  $@${NC}" | tee -a "$LOG_FILE"
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"
}

show_help() {
    grep '^#' "$0" | grep -v '#!/bin/bash' | sed 's/^# //g' | sed 's/^#//g'
    exit 0
}

prompt_confirmation() {
    local message="$1"
    echo -e "${YELLOW}${message}${NC}"
    read -p "Continue? (yes/no): " response
    if [[ ! "$response" =~ ^[Yy][Ee][Ss]$ ]]; then
        log_warning "Deployment cancelled by user"
        exit 0
    fi
}

################################################################################
# Validation Functions
################################################################################

check_prerequisites() {
    log_section "Checking Prerequisites"
    
    local missing_prereqs=0
    
    # Check Node.js
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        log_success "Node.js installed: ${node_version}"
    else
        log_error "Node.js not found. Please install Node.js 16 or higher."
        missing_prereqs=$((missing_prereqs + 1))
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        local npm_version=$(npm --version)
        log_success "npm installed: ${npm_version}"
    else
        log_error "npm not found. Please install npm."
        missing_prereqs=$((missing_prereqs + 1))
    fi
    
    # Check PostgreSQL client
    if command -v psql &> /dev/null; then
        local psql_version=$(psql --version)
        log_success "PostgreSQL client installed: ${psql_version}"
    else
        log_warning "psql not found. Database operations may require manual execution."
    fi
    
    # Check for .env file
    if [ -f "${PROJECT_ROOT}/.env" ]; then
        log_success ".env file found"
    else
        log_error ".env file not found. Please create from .env.example"
        missing_prereqs=$((missing_prereqs + 1))
    fi
    
    # Check for package.json
    if [ -f "${PROJECT_ROOT}/package.json" ]; then
        log_success "package.json found"
    else
        log_error "package.json not found. Are you in the project root?"
        missing_prereqs=$((missing_prereqs + 1))
    fi
    
    if [ $missing_prereqs -gt 0 ]; then
        log_error "${missing_prereqs} prerequisite(s) missing. Cannot proceed with deployment."
        exit 1
    fi
    
    log_success "All prerequisites satisfied"
}

validate_environment() {
    log_section "Validating Environment Configuration"
    
    cd "$PROJECT_ROOT"
    
    # Source .env file
    if [ -f .env ]; then
        set -a
        source .env
        set +a
    else
        log_error ".env file not found"
        exit 1
    fi
    
    local missing_vars=0
    local required_vars=(
        "DATABASE_URL"
        "JWT_SECRET"
        "OPENAI_API_KEY"
        "ANTHROPIC_API_KEY"
        "GOOGLE_API_KEY"
        "NODE_ENV"
        "PORT"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            log_error "Missing required environment variable: ${var}"
            missing_vars=$((missing_vars + 1))
        else
            # Mask sensitive values in logs
            if [[ "$var" == *"KEY"* ]] || [[ "$var" == *"SECRET"* ]]; then
                log_success "${var} is set (value masked)"
            else
                log_success "${var}=${!var}"
            fi
        fi
    done
    
    # Validate NODE_ENV
    if [ "$NODE_ENV" != "production" ]; then
        log_warning "NODE_ENV is not set to 'production' (current: ${NODE_ENV})"
        prompt_confirmation "Are you sure you want to deploy to non-production environment?"
    fi
    
    # Validate JWT_SECRET strength
    if [ ${#JWT_SECRET} -lt 32 ]; then
        log_error "JWT_SECRET is too short (${#JWT_SECRET} characters). Minimum 32 characters required."
        missing_vars=$((missing_vars + 1))
    else
        log_success "JWT_SECRET has adequate length"
    fi
    
    if [ $missing_vars -gt 0 ]; then
        log_error "${missing_vars} environment variable(s) missing or invalid"
        exit 1
    fi
    
    log_success "Environment configuration validated"
}

check_security() {
    log_section "Security Validation"
    
    cd "$PROJECT_ROOT"
    
    # Check for hardcoded secrets
    log_info "Scanning for hardcoded secrets..."
    local secret_patterns=(
        "OPENAI_API_KEY"
        "ANTHROPIC_API_KEY"
        "GOOGLE_API_KEY"
        "JWT_SECRET"
        "password.*=.*['\"]"
    )
    
    local security_issues=0
    for pattern in "${secret_patterns[@]}"; do
        # Search in JS files, excluding node_modules and .env
        if grep -r -i "$pattern" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude=.env . 2>/dev/null | grep -v "process.env" | grep -q .; then
            log_warning "Potential hardcoded secret found: ${pattern}"
            security_issues=$((security_issues + 1))
        fi
    done
    
    if [ $security_issues -gt 0 ]; then
        log_warning "${security_issues} potential security issue(s) found"
        prompt_confirmation "Security issues detected. Review and fix before deploying."
    else
        log_success "No hardcoded secrets detected"
    fi
    
    # Check .gitignore includes .env
    if grep -q "^\.env$" .gitignore 2>/dev/null; then
        log_success ".env is in .gitignore"
    else
        log_error ".env is NOT in .gitignore - CRITICAL SECURITY ISSUE"
        exit 1
    fi
    
    log_success "Security validation complete"
}

################################################################################
# Installation Functions
################################################################################

install_dependencies() {
    log_section "Installing Dependencies"
    
    cd "$PROJECT_ROOT"
    
    log_info "Running npm install..."
    if npm install --production 2>&1 | tee -a "$LOG_FILE"; then
        log_success "Dependencies installed successfully"
    else
        log_error "Failed to install dependencies"
        exit 1
    fi
}

build_application() {
    log_section "Building Application"
    
    cd "$PROJECT_ROOT"
    
    if grep -q '"build"' package.json; then
        log_info "Running build script..."
        if npm run build 2>&1 | tee -a "$LOG_FILE"; then
            log_success "Application built successfully"
        else
            log_error "Build failed"
            exit 1
        fi
    else
        log_warning "No build script found in package.json, skipping build"
    fi
}

################################################################################
# Database Functions
################################################################################

initialize_database() {
    if [ "$SKIP_DB_INIT" = true ]; then
        log_warning "Skipping database initialization (--skip-db-init flag set)"
        return 0
    fi
    
    log_section "Initializing Database"
    
    cd "$PROJECT_ROOT"
    
    if [ ! -f "schema.sql" ]; then
        log_warning "schema.sql not found, skipping database initialization"
        return 0
    fi
    
    log_info "Applying database schema..."
    
    # Check if we can connect to database
    if command -v psql &> /dev/null && [ -n "$DATABASE_URL" ]; then
        if psql "$DATABASE_URL" -f schema.sql 2>&1 | tee -a "$LOG_FILE"; then
            log_success "Database schema applied successfully"
        else
            log_warning "Database initialization failed. You may need to run this manually."
        fi
    else
        log_warning "Cannot connect to database automatically. Please run schema.sql manually:"
        log_info "psql \$DATABASE_URL -f schema.sql"
    fi
}

################################################################################
# Testing Functions
################################################################################

run_tests() {
    if [ "$SKIP_TESTS" = true ]; then
        log_warning "Skipping tests (--skip-tests flag set)"
        return 0
    fi
    
    log_section "Running Tests"
    
    cd "$PROJECT_ROOT"
    
    # Run link tests
    if [ -f "scripts/test-links.js" ]; then
        log_info "Running link validation tests..."
        if node scripts/test-links.js 2>&1 | tee -a "$LOG_FILE"; then
            log_success "Link tests passed"
        else
            log_warning "Link tests failed - review output above"
        fi
    fi
    
    # Run npm test if available
    if grep -q '"test"' package.json && ! grep -q '"test".*"echo.*no test"' package.json; then
        log_info "Running test suite..."
        if npm test 2>&1 | tee -a "$LOG_FILE"; then
            log_success "All tests passed"
        else
            log_error "Tests failed"
            prompt_confirmation "Tests failed. Deploy anyway?"
        fi
    else
        log_warning "No test script configured"
    fi
}

################################################################################
# Deployment Functions
################################################################################

deploy_application() {
    log_section "Deploying Application"
    
    if [ "$DRY_RUN" = true ]; then
        log_info "DRY RUN MODE - Skipping actual deployment"
        return 0
    fi
    
    cd "$PROJECT_ROOT"
    
    log_info "Starting application server..."
    log_warning "Note: This will start the server in the foreground."
    log_warning "For production, use a process manager like PM2 or systemd."
    log_info ""
    log_info "To run with PM2:"
    log_info "  npm install -g pm2"
    log_info "  pm2 start server.js --name ridewire-ai-hub"
    log_info "  pm2 startup"
    log_info "  pm2 save"
    log_info ""
    
    prompt_confirmation "Start the server now?"
    
    # Start server
    npm start 2>&1 | tee -a "$LOG_FILE"
}

create_deployment_summary() {
    log_section "Deployment Summary"
    
    cat <<EOF | tee -a "$LOG_FILE"

${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}
${GREEN}║                                                                ║${NC}
${GREEN}║           RideWire AI Hub Deployment Complete                 ║${NC}
${GREEN}║                                                                ║${NC}
${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}

${CYAN}Application Details:${NC}
  • Project: RideWire AI Hub
  • Environment: ${NODE_ENV}
  • Port: ${PORT}
  • Log File: ${LOG_FILE}

${CYAN}Next Steps:${NC}
  1. Verify application is accessible at http://localhost:${PORT}
  2. Test user registration and login flows
  3. Submit a test diagnostic query to verify AI integration
  4. Monitor logs for any errors
  5. Set up monitoring and alerting
  6. Configure backup strategy

${CYAN}Legal Reminder:${NC}
  ⚠  Ensure all user-facing pages display appropriate disclaimers
  ⚠  AI diagnostics are for informational purposes only
  ⚠  Always direct users to consult qualified mechanics
  ⚠  Review DEPLOYMENT_CHECKLIST.md for complete compliance

${CYAN}Support Resources:${NC}
  • Documentation: README.md
  • Deployment Checklist: DEPLOYMENT_CHECKLIST.md
  • Security Guidelines: SECURITY.md
  • Setup Instructions: SETUP.md

${YELLOW}IMPORTANT:${NC} This deployment script handles technical setup only.
Additional manual steps may be required for:
  - Production hosting configuration
  - SSL/TLS certificates
  - Domain name setup
  - Payment gateway activation
  - Third-party service integration

EOF
}

################################################################################
# Main Execution
################################################################################

main() {
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --skip-db-init)
                SKIP_DB_INIT=true
                shift
                ;;
            --help)
                show_help
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                ;;
        esac
    done
    
    # Print header
    clear
    cat <<EOF
${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}
${CYAN}║                                                                ║${NC}
${CYAN}║           RideWire AI Hub - Deployment Script                 ║${NC}
${CYAN}║                                                                ║${NC}
${CYAN}║  Multi-AI Orchestration Platform for Auto Diagnostics         ║${NC}
${CYAN}║                                                                ║${NC}
${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}

EOF
    
    log_info "Starting deployment at $(date)"
    log_info "Log file: ${LOG_FILE}"
    
    if [ "$DRY_RUN" = true ]; then
        log_warning "Running in DRY RUN mode - no actual deployment will occur"
    fi
    
    # Execute deployment steps
    check_prerequisites
    validate_environment
    check_security
    install_dependencies
    build_application
    initialize_database
    run_tests
    
    if [ "$DRY_RUN" = false ]; then
        deploy_application
    fi
    
    create_deployment_summary
    
    log_success "Deployment process completed successfully!"
}

# Run main function
main "$@"
