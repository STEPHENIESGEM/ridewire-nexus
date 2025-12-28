#!/usr/bin/env node

/**
 * Link Testing Script for RideWire AI Hub
 * Tests all internal navigation links and validates route accessibility
 * Can run without starting the full server (checks route definitions)
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Define all expected routes in the application
const expectedRoutes = [
  { path: '/', description: 'Landing page (HeroSection)', component: 'HeroSection', protected: false },
  { path: '/login', description: 'Login page', component: 'Login', protected: false },
  { path: '/register', description: 'Register page', component: 'Register', protected: false },
  { path: '/dashboard', description: 'Main dashboard', component: 'Dashboard', protected: true },
  { path: '/chat', description: 'Multi-AI chat interface', component: 'Chat', protected: true },
  { path: '/pricing', description: 'Pricing tiers', component: 'Pricing', protected: false },
  { path: '/disclaimer', description: 'Legal disclaimer page', component: 'Disclaimer', protected: false },
  { path: '/terms', description: 'Terms of service', component: 'Terms', protected: false },
];

// Track test results
let passed = 0;
let failed = 0;
let warnings = 0;

console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}  RideWire AI Hub - Route Testing Script${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

/**
 * Check if a component file exists
 */
function checkComponentExists(componentName) {
  const componentPath = path.join(__dirname, '../frontend/components', `${componentName}.jsx`);
  return fs.existsSync(componentPath);
}

/**
 * Check if App.jsx contains the route definition
 */
function checkRouteInAppConfig(routePath) {
  const appPath = path.join(__dirname, '../frontend/App.jsx');
  
  if (!fs.existsSync(appPath)) {
    console.log(`${colors.red}✗${colors.reset} App.jsx not found!`);
    return false;
  }
  
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  // Check for route definition (handles both exact paths and wildcard)
  if (routePath === '*') {
    return appContent.includes('path="*"') || appContent.includes("path='*'");
  }
  
  const routePattern = new RegExp(`path=["']${routePath}["']`);
  return routePattern.test(appContent);
}

/**
 * Extract all Link components from a file
 */
function extractLinksFromComponent(componentName) {
  const componentPath = path.join(__dirname, '../frontend/components', `${componentName}.jsx`);
  
  if (!fs.existsSync(componentPath)) {
    return [];
  }
  
  const content = fs.readFileSync(componentPath, 'utf8');
  const linkPattern = /(?:to=["']|navigate\(["']|href=["'])([^"']+)["']/g;
  const links = [];
  let match;
  
  while ((match = linkPattern.exec(content)) !== null) {
    links.push(match[1]);
  }
  
  return links;
}

/**
 * Test a single route
 */
function testRoute(route) {
  const { path: routePath, description, component, protected: isProtected } = route;
  
  console.log(`${colors.blue}Testing:${colors.reset} ${routePath} - ${description}`);
  
  // Check if component exists
  const componentExists = checkComponentExists(component);
  if (!componentExists) {
    console.log(`  ${colors.red}✗ Component missing:${colors.reset} ${component}.jsx`);
    failed++;
    return false;
  }
  console.log(`  ${colors.green}✓ Component exists:${colors.reset} ${component}.jsx`);
  
  // Check if route is defined in App.jsx
  const routeConfigured = checkRouteInAppConfig(routePath);
  if (!routeConfigured) {
    console.log(`  ${colors.red}✗ Route not configured${colors.reset} in App.jsx`);
    failed++;
    return false;
  }
  console.log(`  ${colors.green}✓ Route configured${colors.reset} in App.jsx`);
  
  // Check protection status
  if (isProtected) {
    console.log(`  ${colors.yellow}⚠ Protected route${colors.reset} (requires authentication)`);
  }
  
  // Extract and validate links from component
  const links = extractLinksFromComponent(component);
  if (links.length > 0) {
    console.log(`  ${colors.cyan}→ Found ${links.length} link(s):${colors.reset} ${links.join(', ')}`);
  }
  
  console.log(`  ${colors.green}✓ PASSED${colors.reset}\n`);
  passed++;
  return true;
}

/**
 * Test 404 fallback route
 */
function test404Route() {
  console.log(`${colors.blue}Testing:${colors.reset} /* - 404 Fallback`);
  
  const notFoundExists = checkComponentExists('NotFound');
  if (!notFoundExists) {
    console.log(`  ${colors.red}✗ Component missing:${colors.reset} NotFound.jsx`);
    failed++;
    return false;
  }
  console.log(`  ${colors.green}✓ Component exists:${colors.reset} NotFound.jsx`);
  
  const wildcardConfigured = checkRouteInAppConfig('*');
  if (!wildcardConfigured) {
    console.log(`  ${colors.red}✗ Wildcard route not configured${colors.reset} in App.jsx`);
    failed++;
    return false;
  }
  console.log(`  ${colors.green}✓ Wildcard route configured${colors.reset} in App.jsx`);
  console.log(`  ${colors.green}✓ PASSED${colors.reset}\n`);
  passed++;
  return true;
}

/**
 * Check for broken links across all components
 */
function checkForBrokenLinks() {
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}  Checking for Broken Links${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);
  
  const componentsDir = path.join(__dirname, '../frontend/components');
  const componentFiles = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));
  
  const validPaths = expectedRoutes.map(r => r.path);
  validPaths.push('/'); // Ensure root is valid
  
  let brokenLinksFound = false;
  
  componentFiles.forEach(file => {
    const componentName = file.replace('.jsx', '');
    const links = extractLinksFromComponent(componentName);
    
    links.forEach(link => {
      // Skip external links and special patterns
      if (link.startsWith('http') || link.startsWith('mailto:') || link.includes('${')) {
        return;
      }
      
      // Check if link matches any valid route
      const isValid = validPaths.some(validPath => {
        // Exact match
        if (link === validPath) return true;
        // Root path variations
        if (validPath === '/' && link === '') return true;
        return false;
      });
      
      if (!isValid) {
        console.log(`${colors.yellow}⚠ Potential broken link${colors.reset} in ${componentName}.jsx: ${link}`);
        warnings++;
        brokenLinksFound = true;
      }
    });
  });
  
  if (!brokenLinksFound) {
    console.log(`${colors.green}✓ No broken links detected!${colors.reset}\n`);
  } else {
    console.log();
  }
}

/**
 * Main test execution
 */
function runTests() {
  console.log(`${colors.cyan}Testing all application routes...${colors.reset}\n`);
  
  // Test each expected route
  expectedRoutes.forEach(route => testRoute(route));
  
  // Test 404 fallback
  test404Route();
  
  // Check for broken links
  checkForBrokenLinks();
  
  // Print summary
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}  Test Summary${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);
  
  console.log(`  ${colors.green}Passed:${colors.reset}   ${passed}`);
  console.log(`  ${colors.red}Failed:${colors.reset}   ${failed}`);
  console.log(`  ${colors.yellow}Warnings:${colors.reset} ${warnings}`);
  console.log(`  Total Routes: ${expectedRoutes.length + 1} (including 404)\n`);
  
  if (failed === 0 && warnings === 0) {
    console.log(`${colors.green}✓ All tests passed! Navigation is working correctly.${colors.reset}\n`);
    process.exit(0);
  } else if (failed === 0) {
    console.log(`${colors.yellow}✓ All routes configured but warnings detected.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}✗ Some tests failed. Please fix the issues above.${colors.reset}\n`);
    process.exit(1);
  }
}

// Run the tests
runTests();
