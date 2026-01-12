#!/usr/bin/env node

/**
 * Interactive Gumroad Token Setup
 * 
 * Guides you through getting and configuring your Gumroad API token
 * 
 * Usage:
 *   node scripts/get-gumroad-token-interactive.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(prompt) {
  return new Promise(resolve => {
    rl.question(`${colors.cyan}${prompt}${colors.reset}`, resolve);
  });
}

async function interactiveSetup() {
  console.clear();
  
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log('           🔑 GUMROAD API TOKEN SETUP WIZARD', 'bold');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  
  console.log('\n');
  log('This wizard will help you get and configure your Gumroad API token.', 'blue');
  console.log('\n');

  // Step 1: Check if they have a Gumroad account
  log('📋 Step 1: Gumroad Account', 'yellow');
  console.log('\n');
  
  const hasAccount = await question('Do you have a Gumroad account? (y/n): ');
  
  if (hasAccount.toLowerCase() !== 'y') {
    console.log('\n');
    log('Please create a Gumroad account first:', 'red');
    log('1. Go to: https://gumroad.com/signup');
    log('2. Complete the registration');
    log('3. Verify your email');
    log('4. Run this script again');
    console.log('\n');
    rl.close();
    return;
  }

  // Step 2: Check if they have a product
  console.log('\n');
  log('📦 Step 2: Gumroad Product', 'yellow');
  console.log('\n');
  
  const hasProduct = await question('Do you have a product created? (y/n): ');
  
  if (hasProduct.toLowerCase() !== 'y') {
    console.log('\n');
    log('You need at least one product to use the API:', 'yellow');
    log('1. Go to: https://app.gumroad.com/products');
    log('2. Click "Create new product"');
    log('3. Choose "Digital product"');
    log('4. Fill in basic details (you can edit later)');
    log('5. Run this script again');
    console.log('\n');
    rl.close();
    return;
  }

  // Step 3: Get the API token
  console.log('\n');
  log('🔑 Step 3: Get Your API Token', 'yellow');
  console.log('\n');
  
  log('Follow these steps to get your token:', 'blue');
  log('1. Open: https://app.gumroad.com/settings/advanced');
  log('2. Scroll to "Application Access Token" section');
  log('3. Click "Create application" or "Generate new token"');
  log('4. Name it: "RideWire Automation"');
  log('5. Click "Create"');
  log('6. Copy the token (starts with "gumroad_")');
  console.log('\n');
  
  const openBrowser = await question('Open Gumroad settings in browser? (y/n): ');
  
  if (openBrowser.toLowerCase() === 'y') {
    const { exec } = require('child_process');
    const url = 'https://app.gumroad.com/settings/advanced';
    
    // Try to open browser (works on most systems)
    const start = process.platform === 'darwin' ? 'open' :
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    
    exec(`${start} ${url}`, (error) => {
      if (error) {
        log(`Could not open browser. Please go to: ${url}`, 'yellow');
      }
    });
    
    log(`✅ Opening browser...`, 'green');
    console.log('\n');
  }

  // Step 4: Enter the token
  console.log('\n');
  log('📝 Step 4: Enter Your Token', 'yellow');
  console.log('\n');
  
  let token = await question('Paste your Gumroad API token here: ');
  token = token.trim();
  
  // Validate token format
  if (!token) {
    log('❌ No token provided. Exiting.', 'red');
    rl.close();
    return;
  }
  
  if (!token.startsWith('gumroad_')) {
    console.log('\n');
    log('⚠️  Warning: Token should start with "gumroad_"', 'yellow');
    const continueAnyway = await question('Continue anyway? (y/n): ');
    if (continueAnyway.toLowerCase() !== 'y') {
      rl.close();
      return;
    }
  }

  // Step 5: Save to .env
  console.log('\n');
  log('💾 Step 5: Save Configuration', 'yellow');
  console.log('\n');
  
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  
  try {
    let envContent = '';
    
    // Read existing .env or use .env.example as template
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      
      // Check if GUMROAD_ACCESS_TOKEN already exists
      if (envContent.includes('GUMROAD_ACCESS_TOKEN=')) {
        const overwrite = await question('.env already has a token. Overwrite? (y/n): ');
        if (overwrite.toLowerCase() !== 'y') {
          log('❌ Cancelled. Token not saved.', 'red');
          rl.close();
          return;
        }
        
        // Replace existing token
        envContent = envContent.replace(
          /GUMROAD_ACCESS_TOKEN=.*/,
          `GUMROAD_ACCESS_TOKEN=${token}`
        );
      } else {
        // Append token
        envContent += `\nGUMROAD_ACCESS_TOKEN=${token}\n`;
      }
    } else if (fs.existsSync(envExamplePath)) {
      // Use .env.example as template
      envContent = fs.readFileSync(envExamplePath, 'utf8');
      envContent = envContent.replace(
        /GUMROAD_ACCESS_TOKEN=.*/,
        `GUMROAD_ACCESS_TOKEN=${token}`
      );
    } else {
      // Create new .env with just the token
      envContent = `GUMROAD_ACCESS_TOKEN=${token}\n`;
    }
    
    // Write .env file
    fs.writeFileSync(envPath, envContent, 'utf8');
    
    console.log('\n');
    log('✅ Token saved to .env file!', 'green');
    
  } catch (error) {
    console.log('\n');
    log('❌ Error saving token:', 'red');
    log(error.message, 'red');
    log('\n💡 Manual setup:', 'yellow');
    log('1. Create/edit .env file in project root');
    log(`2. Add this line: GUMROAD_ACCESS_TOKEN=${token}`);
    rl.close();
    return;
  }

  // Step 6: Test connection
  console.log('\n');
  log('🧪 Step 6: Test Connection', 'yellow');
  console.log('\n');
  
  const runTest = await question('Test the API connection now? (y/n): ');
  
  if (runTest.toLowerCase() === 'y') {
    console.log('\n');
    log('Running test...', 'blue');
    
    // Load token from .env
    require('dotenv').config();
    
    try {
      const axios = require('axios');
      const response = await axios.get('https://api.gumroad.com/v2/user', {
        params: { access_token: token }
      });
      
      console.log('\n');
      log('═══════════════════════════════════════════════════════════', 'green');
      log('              ✅ CONNECTION SUCCESSFUL! ✅', 'green');
      log('═══════════════════════════════════════════════════════════', 'green');
      console.log('\n');
      log(`👤 Account: ${response.data.user.name}`, 'cyan');
      log(`📧 Email: ${response.data.user.email}`, 'cyan');
      console.log('\n');
      
    } catch (error) {
      console.log('\n');
      log('❌ Connection test failed:', 'red');
      if (error.response) {
        log(`Status: ${error.response.status}`, 'red');
        log(`Error: ${error.response.data.message || 'Invalid token'}`, 'red');
      } else {
        log(error.message, 'red');
      }
      console.log('\n');
      log('💡 Troubleshooting:', 'yellow');
      log('1. Verify token was copied correctly');
      log('2. Regenerate token from Gumroad dashboard');
      log('3. Make sure token has not expired');
      rl.close();
      return;
    }
  }

  // Step 7: Next steps
  console.log('\n');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log('                    🎯 SETUP COMPLETE!', 'green');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  console.log('\n');
  
  log('🚀 Next Steps:', 'yellow');
  console.log('\n');
  log('1. Test full integration:', 'blue');
  log('   node scripts/test-gumroad-connection.js');
  console.log('\n');
  log('2. Enable auto-publishing in .env:', 'blue');
  log('   AUTO_PUBLISH_GUMROAD=true');
  console.log('\n');
  log('3. Start the server:', 'blue');
  log('   npm start');
  console.log('\n');
  log('4. Create your first auto-listing:', 'blue');
  log('   curl -X POST http://localhost:3000/api/marketplace/list \\');
  log('     -H "Content-Type: application/json" \\');
  log('     -d \'{"title":"Test Product","price":9.99}\'');
  console.log('\n');
  
  log('📚 Documentation:', 'yellow');
  log('   - GUMROAD-API-SETUP-GUIDE.md');
  log('   - GUMROAD-INTEGRATION-PLAN.md');
  log('   - ECOMMERCE-AUTOMATION-IMPLEMENTATION.md');
  console.log('\n');
  
  log('🎉 Your Gumroad automation is ready!', 'green');
  console.log('\n');
  
  rl.close();
}

// Run the wizard
interactiveSetup().catch(error => {
  console.log('\n');
  log('❌ Unexpected error:', 'red');
  console.error(error);
  rl.close();
  process.exit(1);
});
