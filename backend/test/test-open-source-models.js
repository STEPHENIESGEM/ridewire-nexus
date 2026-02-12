/**
 * Open-Source LLM Test Suite
 * Tests the new multi-AI orchestrator with 15 automotive diagnostic scenarios
 * Validates quality, cost savings, and performance
 */

require('dotenv').config();
const MultiAIOrchestratorOpenSource = require('../multiAIOrchestratorOpenSource');

// Automotive diagnostic test scenarios
const testScenarios = [
  {
    id: 'P0300',
    name: 'Random Misfire',
    query: 'P0300 code on 2015 Honda Accord V6. Engine shakes at idle, check engine light flashing. What are the most likely causes and recommended repairs?',
    expectedKeywords: ['ignition coil', 'spark plug', 'misfire', 'cylinder']
  },
  {
    id: 'P0420',
    name: 'Catalyst Efficiency Low',
    query: 'P0420 catalytic converter efficiency below threshold on 2018 Toyota Camry 2.5L. No other codes, vehicle runs fine. Diagnosis?',
    expectedKeywords: ['catalytic converter', 'oxygen sensor', 'o2 sensor', 'catalyst']
  },
  {
    id: 'P0171',
    name: 'System Too Lean',
    query: 'P0171 system too lean Bank 1 on 2016 Ford F-150 EcoBoost. Rough idle, hesitation on acceleration. What should I check?',
    expectedKeywords: ['vacuum leak', 'maf sensor', 'mass air flow', 'fuel', 'intake']
  },
  {
    id: 'P0455',
    name: 'EVAP Large Leak',
    query: 'P0455 EVAP system large leak detected on 2017 Nissan Altima. Gas smell near fuel door. Common causes?',
    expectedKeywords: ['gas cap', 'fuel cap', 'evap', 'purge valve', 'leak']
  },
  {
    id: 'P0302',
    name: 'Cylinder 2 Misfire',
    query: 'P0302 cylinder 2 misfire on 2014 Chevrolet Silverado 5.3L V8. Occurs mainly under load. Diagnosis steps?',
    expectedKeywords: ['cylinder 2', 'coil', 'spark plug', 'injector', 'compression']
  },
  {
    id: 'P0442',
    name: 'EVAP Small Leak',
    query: 'P0442 EVAP small leak on 2019 Honda CR-V. No obvious fuel smell. Where to start diagnostics?',
    expectedKeywords: ['evap', 'gas cap', 'seal', 'vent valve', 'leak']
  },
  {
    id: 'P0128',
    name: 'Coolant Thermostat',
    query: 'P0128 coolant thermostat temperature below threshold on 2015 Subaru Outback. Takes long to warm up. Diagnosis?',
    expectedKeywords: ['thermostat', 'coolant', 'temperature', 'stuck open']
  },
  {
    id: 'P0401',
    name: 'EGR Insufficient Flow',
    query: 'P0401 EGR insufficient flow on 2013 Volkswagen Jetta TDI. Slight rough idle. What to check?',
    expectedKeywords: ['egr', 'valve', 'clogged', 'exhaust', 'flow']
  },
  {
    id: 'P0506',
    name: 'Idle Control Low',
    query: 'P0506 idle control system RPM lower than expected on 2016 Mazda 3. Engine stalls at stops. Causes?',
    expectedKeywords: ['idle', 'iac valve', 'throttle', 'vacuum', 'air']
  },
  {
    id: 'P0141',
    name: 'O2 Sensor Heater',
    query: 'P0141 oxygen sensor heater circuit Bank 1 Sensor 2 malfunction on 2017 Hyundai Elantra. Check solutions.',
    expectedKeywords: ['oxygen sensor', 'o2 sensor', 'heater', 'bank 1', 'sensor 2']
  },
  {
    id: 'P0014',
    name: 'Camshaft Position Timing',
    query: 'P0014 camshaft position timing over-advanced Bank 1 on 2018 BMW 328i. Rough start, low power. Diagnosis?',
    expectedKeywords: ['camshaft', 'timing', 'vvt', 'solenoid', 'oil']
  },
  {
    id: 'P0700',
    name: 'Transmission Control',
    query: 'P0700 transmission control system malfunction on 2015 Dodge Charger. Harsh shifts. What to check?',
    expectedKeywords: ['transmission', 'tcm', 'shift', 'solenoid', 'fluid']
  },
  {
    id: 'P0340',
    name: 'Camshaft Position Sensor',
    query: 'P0340 camshaft position sensor circuit malfunction on 2016 Nissan Sentra. No start condition. Diagnosis?',
    expectedKeywords: ['camshaft', 'sensor', 'position', 'circuit', 'crank']
  },
  {
    id: 'P0562',
    name: 'System Voltage Low',
    query: 'P0562 system voltage low on 2017 Jeep Wrangler. Dim lights, slow cranking. What could be wrong?',
    expectedKeywords: ['battery', 'alternator', 'voltage', 'charging', 'electrical']
  },
  {
    id: 'P0135',
    name: 'O2 Sensor Heater Bank 1',
    query: 'P0135 oxygen sensor heater circuit Bank 1 Sensor 1 on 2014 Toyota Corolla. Poor fuel economy. Repair?',
    expectedKeywords: ['oxygen sensor', 'o2 sensor', 'heater', 'bank 1', 'sensor 1']
  }
];

class TestRunner {
  constructor() {
    this.orchestrator = new MultiAIOrchestratorOpenSource();
    this.results = {
      testDate: new Date().toISOString(),
      totalTests: 0,
      passed: 0,
      failed: 0,
      totalCost: 0,
      totalTime: 0,
      tests: []
    };
  }

  /**
   * Run all test scenarios
   */
  async runAllTests() {
    console.log('🚀 Starting Open-Source LLM Test Suite\n');
    console.log('═'.repeat(80));
    console.log('Testing 15 automotive diagnostic scenarios');
    console.log('Validating: Quality, Cost, Speed, Consensus\n');
    
    // Test connection first
    console.log('🔧 Testing provider connections...\n');
    const connectionTest = await this.orchestrator.testConnections();
    console.log(`\n📊 Connection Test Results: ${connectionTest.summary.successful}/${connectionTest.summary.total} providers connected\n`);
    
    if (connectionTest.summary.successful === 0) {
      console.error('❌ No providers are accessible. Please check your API keys in .env file\n');
      console.log('Required environment variables:');
      console.log('  - CEREBRAS_API_KEY (get at https://cloud.cerebras.ai)');
      console.log('  - GROQ_API_KEY (get at https://console.groq.com)');
      console.log('  - TOGETHER_API_KEY (get at https://api.together.xyz)');
      console.log('  - OPENAI_API_KEY (existing key for tiebreaker)\n');
      return this.results;
    }
    
    console.log('═'.repeat(80));
    console.log('\n');

    // Run each test scenario
    for (let i = 0; i < testScenarios.length; i++) {
      const scenario = testScenarios[i];
      console.log(`\n${'─'.repeat(80)}`);
      console.log(`Test ${i + 1}/${testScenarios.length}: ${scenario.id} - ${scenario.name}`);
      console.log('─'.repeat(80));
      
      await this.runTest(scenario);
      
      // Wait 1 second between tests to avoid rate limits
      if (i < testScenarios.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Print summary
    this.printSummary();
    
    return this.results;
  }

  /**
   * Run a single test scenario
   * @param {Object} scenario - Test scenario
   */
  async runTest(scenario) {
    const sessionId = `TEST-${scenario.id}-${Date.now()}`;
    const startTime = Date.now();
    
    try {
      // Query the orchestrator
      const result = await this.orchestrator.queryAllAgents(scenario.query, sessionId);
      const responseTime = Date.now() - startTime;
      
      // Validate response
      const validation = this.validateResponse(result, scenario.expectedKeywords);
      
      // Record test result
      const testResult = {
        id: scenario.id,
        name: scenario.name,
        passed: validation.passed,
        responseTime,
        cost: result.cost,
        consensusScore: result.consensus?.score || 0,
        usedTiebreaker: result.usedTiebreaker,
        providersUsed: Object.keys(result.responses).filter(p => p !== 'Tiebreaker'),
        keywordsFound: validation.keywordsFound,
        keywordsMissing: validation.keywordsMissing,
        error: null
      };
      
      this.results.tests.push(testResult);
      this.results.totalTests++;
      this.results.totalCost += result.cost;
      this.results.totalTime += responseTime;
      
      if (validation.passed) {
        this.results.passed++;
        console.log(`✅ PASSED`);
      } else {
        this.results.failed++;
        console.log(`⚠️  PARTIAL PASS (missing keywords: ${validation.keywordsMissing.join(', ')})`);
      }
      
      console.log(`   Consensus: ${Math.round(result.consensus.score * 100)}%`);
      console.log(`   Tiebreaker: ${result.usedTiebreaker ? 'Yes' : 'No'}`);
      console.log(`   Cost: $${result.cost.toFixed(6)}`);
      console.log(`   Time: ${responseTime}ms`);
      
    } catch (error) {
      console.error(`❌ FAILED: ${error.message}`);
      
      this.results.tests.push({
        id: scenario.id,
        name: scenario.name,
        passed: false,
        error: error.message
      });
      
      this.results.totalTests++;
      this.results.failed++;
    }
  }

  /**
   * Validate response against expected keywords
   * @param {Object} result - Query result
   * @param {Array} expectedKeywords - Expected keywords
   * @returns {Object} Validation result
   */
  validateResponse(result, expectedKeywords) {
    // Get the final answer text
    const finalAnswer = result.consensus?.finalAnswer || '';
    const lowerAnswer = finalAnswer.toLowerCase();
    
    // Check which keywords are found
    const keywordsFound = [];
    const keywordsMissing = [];
    
    expectedKeywords.forEach(keyword => {
      if (lowerAnswer.includes(keyword.toLowerCase())) {
        keywordsFound.push(keyword);
      } else {
        keywordsMissing.push(keyword);
      }
    });
    
    // Pass if at least 50% of keywords are found
    const passed = keywordsFound.length >= Math.ceil(expectedKeywords.length * 0.5);
    
    return {
      passed,
      keywordsFound,
      keywordsMissing
    };
  }

  /**
   * Print test summary
   */
  printSummary() {
    console.log('\n\n');
    console.log('═'.repeat(80));
    console.log('📊 TEST SUMMARY');
    console.log('═'.repeat(80));
    console.log(`\nTests Run: ${this.results.totalTests}`);
    console.log(`✅ Passed: ${this.results.passed} (${Math.round(this.results.passed / this.results.totalTests * 100)}%)`);
    console.log(`⚠️  Failed: ${this.results.failed} (${Math.round(this.results.failed / this.results.totalTests * 100)}%)`);
    
    console.log('\n💰 COST ANALYSIS:');
    console.log(`   Total Cost: $${this.results.totalCost.toFixed(6)}`);
    console.log(`   Average Cost Per Query: $${(this.results.totalCost / this.results.totalTests).toFixed(6)}`);
    console.log(`   Old System Cost (estimate): $${(this.results.totalTests * 0.02).toFixed(6)}`);
    console.log(`   Savings: $${((this.results.totalTests * 0.02) - this.results.totalCost).toFixed(6)} (${Math.round((1 - this.results.totalCost / (this.results.totalTests * 0.02)) * 100)}%)`);
    
    console.log('\n⏱️  PERFORMANCE:');
    console.log(`   Total Time: ${Math.round(this.results.totalTime / 1000)}s`);
    console.log(`   Average Response Time: ${Math.round(this.results.totalTime / this.results.totalTests)}ms`);
    
    // Consensus statistics
    const stats = this.orchestrator.getStats();
    console.log('\n🧮 CONSENSUS STATISTICS:');
    console.log(`   Consensus Rate: ${stats.consensusRate}`);
    console.log(`   Tiebreaker Rate: ${stats.tiebreakerRate}`);
    
    console.log('\n═'.repeat(80));
    console.log('🎯 CONCLUSION');
    console.log('═'.repeat(80));
    
    const passRate = Math.round(this.results.passed / this.results.totalTests * 100);
    if (passRate >= 95) {
      console.log('✅ EXCELLENT: Open-source LLM system maintains high quality!');
    } else if (passRate >= 90) {
      console.log('✅ GOOD: Open-source LLM system performs well!');
    } else if (passRate >= 80) {
      console.log('⚠️  ACCEPTABLE: Some quality degradation, but cost savings may justify');
    } else {
      console.log('❌ NEEDS IMPROVEMENT: Consider adjusting consensus threshold or providers');
    }
    
    console.log(`\n💡 Quality: ${passRate}% accuracy`);
    console.log(`💵 Cost: $${(this.results.totalCost / this.results.totalTests).toFixed(6)}/query (vs $0.02 old system)`);
    console.log(`⚡ Speed: ${Math.round(this.results.totalTime / this.results.totalTests)}ms average\n`);
  }
}

// Run tests if called directly
if (require.main === module) {
  const runner = new TestRunner();
  
  runner.runAllTests()
    .then(results => {
      console.log('✅ Test suite completed\n');
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = TestRunner;
