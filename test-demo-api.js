/**
 * API Endpoint Test for War Room Demo
 * Tests REST endpoints without requiring database
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: data ? JSON.parse(data) : null
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Test suite
async function runTests() {
  console.log('='.repeat(80));
  console.log('WAR ROOM DEMO API ENDPOINT TESTS');
  console.log('='.repeat(80));
  console.log();
  console.log('⚠️  Note: Server must be running on port 3000');
  console.log('   Start with: npm start (in another terminal)');
  console.log();

  try {
    // Test 1: Initialize Demo
    console.log('TEST 1: POST /api/demo/initialize');
    const init = await makeRequest('POST', '/api/demo/initialize');
    if (init.statusCode === 200 && init.data.status === 'initialized') {
      console.log(`✓ Demo initialized: ${init.data.scenario}`);
    } else {
      console.log(`❌ Failed: Status ${init.statusCode}`);
    }

    // Test 2: Get Demo Status
    console.log('\nTEST 2: GET /api/demo/status');
    const status = await makeRequest('GET', '/api/demo/status');
    if (status.statusCode === 200 && status.data.timestamp) {
      console.log(`✓ Status retrieved: ${status.data.timestamp}`);
      console.log(`  Current scene: ${status.data.currentScene || 'None'}`);
    } else {
      console.log(`❌ Failed: Status ${status.statusCode}`);
    }

    // Test 3: Inject Break
    console.log('\nTEST 3: POST /api/demo/inject-break');
    const breakInjection = await makeRequest('POST', '/api/demo/inject-break', {
      type: 'api_latency',
      agent: 'ChatGPT',
      delayMs: 1000
    });
    if (breakInjection.statusCode === 200 && breakInjection.data.id) {
      console.log(`✓ Break injected: ${breakInjection.data.id}`);
      console.log(`  Type: ${breakInjection.data.type}, Agent: ${breakInjection.data.agent}`);
    } else {
      console.log(`❌ Failed: Status ${breakInjection.statusCode}`);
    }

    // Test 4: Get System Health
    console.log('\nTEST 4: GET /api/demo/health');
    const health = await makeRequest('GET', '/api/demo/health');
    if (health.statusCode === 200 && health.data.systemStatus) {
      console.log(`✓ System health: ${health.data.systemStatus}`);
      console.log(`  Active breaks: ${health.data.activeBreaks}`);
    } else {
      console.log(`❌ Failed: Status ${health.statusCode}`);
    }

    // Test 5: Get Diagnostics
    console.log('\nTEST 5: GET /api/demo/diagnostics');
    const diagnostics = await makeRequest('GET', '/api/demo/diagnostics');
    if (diagnostics.statusCode === 200 && diagnostics.data.timestamp) {
      console.log(`✓ Diagnostics retrieved`);
      console.log(`  Headline: ${diagnostics.data.headline}`);
    } else {
      console.log(`❌ Failed: Status ${diagnostics.statusCode}`);
    }

    // Test 6: Get Repair Log
    console.log('\nTEST 6: GET /api/demo/repair-log');
    const repairLog = await makeRequest('GET', '/api/demo/repair-log');
    if (repairLog.statusCode === 200) {
      console.log(`✓ Repair log retrieved`);
      console.log(`  Entries: ${repairLog.data.repairLog.length}`);
    } else {
      console.log(`❌ Failed: Status ${repairLog.statusCode}`);
    }

    // Test 7: Execute Scene 1
    console.log('\nTEST 7: POST /api/demo/scene/1');
    const scene1 = await makeRequest('POST', '/api/demo/scene/1');
    if (scene1.statusCode === 200 && scene1.data.scene) {
      console.log(`✓ Scene 1 executed: ${scene1.data.scene}`);
      console.log(`  Duration: ${(scene1.data.duration / 1000).toFixed(2)}s`);
    } else {
      console.log(`❌ Failed: Status ${scene1.statusCode}`);
    }

    // Test 8: Reset Demo
    console.log('\nTEST 8: POST /api/demo/reset');
    const reset = await makeRequest('POST', '/api/demo/reset');
    if (reset.statusCode === 200 && reset.data.status === 'reset') {
      console.log(`✓ Demo reset: ${reset.data.message}`);
    } else {
      console.log(`❌ Failed: Status ${reset.statusCode}`);
    }

    console.log();
    console.log('='.repeat(80));
    console.log('API ENDPOINT TESTS COMPLETED');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nMake sure the server is running:');
    console.error('  1. In another terminal: cd /home/runner/work/ridewire-ai-hub/ridewire-ai-hub');
    console.error('  2. Run: npm start');
    console.error('  3. Then run this test again');
    process.exit(1);
  }
}

runTests();
