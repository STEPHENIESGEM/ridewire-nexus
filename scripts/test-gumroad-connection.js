#!/usr/bin/env node

/**
 * Gumroad API Connection Tester
 * 
 * Tests your Gumroad API access token and verifies integration
 * 
 * Usage:
 *   node scripts/test-gumroad-connection.js
 * 
 * Prerequisites:
 *   - GUMROAD_ACCESS_TOKEN set in .env file
 *   - axios package installed (npm install axios)
 */

require('dotenv').config();
const axios = require('axios');

const GUMROAD_API_BASE = 'https://api.gumroad.com/v2';

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

async function testGumroadConnection() {
  logSection('🔑 Gumroad API Connection Test');

  // Step 1: Check if token exists
  log('\n1️⃣  Checking for API token...', 'blue');
  const token = process.env.GUMROAD_ACCESS_TOKEN;
  
  if (!token) {
    log('❌ GUMROAD_ACCESS_TOKEN not found in environment!', 'red');
    log('\n📋 Setup Instructions:', 'yellow');
    log('1. Get your token from: https://app.gumroad.com/settings/advanced');
    log('2. Add to .env file: GUMROAD_ACCESS_TOKEN=your_token_here');
    log('3. Run this script again');
    process.exit(1);
  }

  log(`✅ Token found: ${token.substring(0, 20)}...`, 'green');

  // Step 2: Test user endpoint
  logSection('2️⃣  Testing User Endpoint');
  try {
    const userResponse = await axios.get(`${GUMROAD_API_BASE}/user`, {
      params: { access_token: token }
    });

    log('✅ Successfully connected to Gumroad!', 'green');
    log(`\n👤 User Info:`, 'cyan');
    log(`   Name: ${userResponse.data.user.name}`);
    log(`   Email: ${userResponse.data.user.email}`);
    log(`   User ID: ${userResponse.data.user.id}`);
    
  } catch (error) {
    log('❌ Failed to connect to Gumroad API', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Error: ${error.response.data.message || 'Invalid token'}`, 'red');
    } else {
      log(`   Error: ${error.message}`, 'red');
    }
    log('\n💡 Troubleshooting:', 'yellow');
    log('1. Verify token is correct');
    log('2. Regenerate token from Gumroad dashboard');
    log('3. Check internet connection');
    process.exit(1);
  }

  // Step 3: Test products endpoint
  logSection('3️⃣  Testing Products Endpoint');
  try {
    const productsResponse = await axios.get(`${GUMROAD_API_BASE}/products`, {
      params: { access_token: token }
    });

    const products = productsResponse.data.products;
    log(`✅ Found ${products.length} product(s)`, 'green');
    
    if (products.length > 0) {
      log('\n📦 Your Products:', 'cyan');
      products.forEach((product, index) => {
        log(`\n   ${index + 1}. ${product.name}`);
        log(`      ID: ${product.id}`);
        log(`      Price: $${(product.price / 100).toFixed(2)}`);
        log(`      URL: ${product.short_url}`);
        log(`      Sales: ${product.sales_count}`);
      });
    } else {
      log('\n⚠️  No products found', 'yellow');
      log('   Create your first product at: https://app.gumroad.com/products');
    }
    
  } catch (error) {
    log('❌ Failed to fetch products', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Error: ${error.response.data.message || 'Unknown error'}`, 'red');
    }
  }

  // Step 4: Test sales endpoint
  logSection('4️⃣  Testing Sales Endpoint');
  try {
    const salesResponse = await axios.get(`${GUMROAD_API_BASE}/sales`, {
      params: { access_token: token }
    });

    const sales = salesResponse.data.sales;
    log(`✅ Found ${sales.length} sale(s)`, 'green');
    
    if (sales.length > 0) {
      log('\n💰 Recent Sales:', 'cyan');
      sales.slice(0, 5).forEach((sale, index) => {
        log(`\n   ${index + 1}. ${sale.product_name}`);
        log(`      Amount: $${(sale.price / 100).toFixed(2)}`);
        log(`      Date: ${new Date(sale.created_at).toLocaleString()}`);
        log(`      Email: ${sale.email}`);
      });
    } else {
      log('\n⚠️  No sales yet', 'yellow');
      log('   Sales will appear here after your first purchase');
    }
    
  } catch (error) {
    log('❌ Failed to fetch sales', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Error: ${error.response.data.message || 'Unknown error'}`, 'red');
    }
  }

  // Step 5: Test webhook subscriptions
  logSection('5️⃣  Testing Webhook Subscriptions');
  try {
    const webhooksResponse = await axios.get(`${GUMROAD_API_BASE}/resource_subscriptions`, {
      params: { access_token: token }
    });

    const webhooks = webhooksResponse.data.resource_subscriptions;
    log(`✅ Found ${webhooks.length} webhook(s)`, 'green');
    
    if (webhooks.length > 0) {
      log('\n🔔 Active Webhooks:', 'cyan');
      webhooks.forEach((webhook, index) => {
        log(`\n   ${index + 1}. ${webhook.resource_name}`);
        log(`      URL: ${webhook.post_url}`);
        log(`      ID: ${webhook.id}`);
      });
    } else {
      log('\n⚠️  No webhooks configured', 'yellow');
      log('   Webhooks enable real-time sale notifications');
      log('   Set up at: https://app.gumroad.com/settings/advanced');
    }
    
  } catch (error) {
    log('⚠️  Could not fetch webhooks (may not have permission)', 'yellow');
  }

  // Summary
  logSection('✅ Connection Test Complete!');
  log('\n🎯 Next Steps:', 'green');
  log('1. Your Gumroad API is working correctly');
  log('2. You can now use the automation features');
  log('3. Test auto-listing: npm run test-listing');
  log('4. Enable auto-publish: Set AUTO_PUBLISH_GUMROAD=true in .env');
  log('\n📚 Documentation:');
  log('   - Setup Guide: GUMROAD-API-SETUP-GUIDE.md');
  log('   - Integration Plan: GUMROAD-INTEGRATION-PLAN.md');
  log('   - Implementation: ECOMMERCE-AUTOMATION-IMPLEMENTATION.md');
  
  console.log('\n');
}

// Run the test
testGumroadConnection().catch(error => {
  log('\n❌ Unexpected error:', 'red');
  console.error(error);
  process.exit(1);
});
