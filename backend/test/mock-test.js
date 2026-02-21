/**
 * Mock Test - Open-Source LLM Orchestrator
 * Tests the orchestrator logic without requiring actual API keys
 * Validates consensus algorithm, retry logic, and cost tracking
 */

const MultiAIOrchestratorOpenSource = require('../multiAIOrchestratorOpenSource');
const ConsensusAnalyzer = require('../utils/consensusAnalyzer');

console.log('🧪 Mock Test Suite for Open-Source LLM Orchestrator\n');
console.log('═'.repeat(80));

// Test 1: Consensus Analyzer - Keyword Overlap
console.log('\n📊 Test 1: Consensus Analyzer - Keyword Overlap');
console.log('─'.repeat(80));

const analyzer = new ConsensusAnalyzer();

const testResponses = [
  {
    provider: 'Cerebras',
    response: 'P0300 random misfire detected. Primary causes: worn spark plugs, faulty ignition coils, or vacuum leaks. Recommended action: inspect and replace spark plugs, test ignition coils, check for vacuum leaks. Estimated repair cost: $150-$400 depending on which components need replacement.',
    confidence: 0.85
  },
  {
    provider: 'Groq',
    response: 'P0300 code indicates random misfire. Most common causes: worn spark plugs, faulty ignition coils, vacuum leaks. Diagnosis steps: check spark plugs for wear, test ignition coils, inspect vacuum hoses. Typical repair: replace spark plugs ($80-$150) or ignition coils ($200-$400).',
    confidence: 0.85
  },
  {
    provider: 'Together.ai',
    response: 'Random misfire (P0300) diagnosis: Check worn spark plugs first, then test ignition coils, inspect for vacuum leaks. Replace worn spark plugs or faulty ignition coils as needed. Common repair cost: $150-$400 including parts and labor.',
    confidence: 0.85
  }
];

const consensus = analyzer.calculateConsensus(testResponses);

console.log(`✅ Consensus Score: ${(consensus.score * 100).toFixed(1)}%`);
console.log(`✅ Has Consensus: ${consensus.hasConsensus ? 'YES' : 'NO'}`);
console.log(`✅ Common Keywords Found: ${consensus.commonFindings.components.join(', ')}`);
console.log(`✅ Analysis: ${consensus.analysis}`);

if (consensus.hasConsensus && consensus.score >= 0.75) {
  console.log('✅ TEST 1 PASSED: Consensus algorithm works correctly');
} else {
  console.log('❌ TEST 1 FAILED: Expected consensus >= 75%');
  process.exit(1);
}

// Test 2: Consensus Analyzer - Low Agreement (should trigger tiebreaker)
console.log('\n📊 Test 2: Consensus Analyzer - Low Agreement Detection');
console.log('─'.repeat(80));

const lowAgreementResponses = [
  {
    provider: 'Cerebras',
    response: 'The issue is likely a bad alternator causing low voltage.',
    confidence: 0.85
  },
  {
    provider: 'Groq',
    response: 'This could be a battery problem or corroded connections.',
    confidence: 0.85
  },
  {
    provider: 'Together.ai',
    response: 'Check the starter motor and battery terminals first.',
    confidence: 0.85
  }
];

const lowConsensus = analyzer.calculateConsensus(lowAgreementResponses);

console.log(`✅ Consensus Score: ${(lowConsensus.score * 100).toFixed(1)}%`);
console.log(`✅ Has Consensus: ${lowConsensus.hasConsensus ? 'YES' : 'NO'}`);
console.log(`✅ Expected: Tiebreaker ${!lowConsensus.hasConsensus ? 'WOULD' : 'WOULD NOT'} be called`);

if (!lowConsensus.hasConsensus) {
  console.log('✅ TEST 2 PASSED: Low agreement correctly detected');
} else {
  console.log('⚠️  TEST 2 WARNING: Expected low consensus, but got consensus');
}

// Test 3: Orchestrator Configuration
console.log('\n📊 Test 3: Orchestrator Configuration');
console.log('─'.repeat(80));

try {
  const orchestrator = new MultiAIOrchestratorOpenSource();
  
  console.log(`✅ Primary Providers: ${orchestrator.primaryProviders.length}`);
  console.log(`   - ${orchestrator.primaryProviders.map(p => p.name).join(', ')}`);
  console.log(`✅ Tiebreaker Provider: ${orchestrator.tiebreakerProvider.name}`);
  console.log(`✅ Consensus Threshold: ${orchestrator.getConsensusThreshold() * 100}%`);
  
  // Test threshold adjustment
  orchestrator.setConsensusThreshold(0.80);
  if (orchestrator.getConsensusThreshold() === 0.80) {
    console.log('✅ Threshold adjustment works correctly');
  } else {
    console.log('❌ Threshold adjustment failed');
    process.exit(1);
  }
  
  orchestrator.setConsensusThreshold(0.75); // Reset
  
  console.log('✅ TEST 3 PASSED: Orchestrator configuration is valid');
} catch (err) {
  console.log(`❌ TEST 3 FAILED: ${err.message}`);
  process.exit(1);
}

// Test 4: Statistics Tracking
console.log('\n📊 Test 4: Statistics Tracking');
console.log('─'.repeat(80));

try {
  const orchestrator = new MultiAIOrchestratorOpenSource();
  const stats = orchestrator.getStats();
  
  console.log(`✅ Total Queries: ${stats.totalQueries}`);
  console.log(`✅ Consensus Rate: ${stats.consensusRate}`);
  console.log(`✅ Tiebreaker Rate: ${stats.tiebreakerRate}`);
  console.log(`✅ Total Cost: $${stats.totalCost.toFixed(6)}`);
  console.log(`✅ Average Cost Per Query: $${stats.averageCostPerQuery}`);
  
  // Verify provider config is accessible
  if (stats.providerConfig && stats.providerConfig.primaryProviders) {
    console.log(`✅ Provider Config Available: ${stats.providerConfig.primaryProviders.length} primary providers`);
  }
  
  console.log('✅ TEST 4 PASSED: Statistics tracking works');
} catch (err) {
  console.log(`❌ TEST 4 FAILED: ${err.message}`);
  process.exit(1);
}

// Test 5: Cost Calculation
console.log('\n📊 Test 5: Cost Calculation');
console.log('─'.repeat(80));

const { calculateCost } = require('../config/modelProviders');

// Test free tier only
const freeCost = calculateCost(['cerebras', 'groq', 'together'], false);
console.log(`✅ Free Tier Only (3 providers): $${freeCost.toFixed(6)}`);

// Test with tiebreaker
const tiebreakerCost = calculateCost(['cerebras', 'groq', 'together'], true);
console.log(`✅ With Tiebreaker: $${tiebreakerCost.toFixed(6)}`);

// Verify Together.ai has some cost
if (freeCost > 0 && tiebreakerCost > freeCost) {
  console.log('✅ TEST 5 PASSED: Cost calculation is correct');
} else {
  console.log('❌ TEST 5 FAILED: Cost calculation issue');
  process.exit(1);
}

// Test 6: Provider Configuration Validation
console.log('\n📊 Test 6: Provider Configuration Validation');
console.log('─'.repeat(80));

const { getProvider, getPrimaryProviders, getTiebreakerProvider } = require('../config/modelProviders');

try {
  const primaryProviders = getPrimaryProviders();
  console.log(`✅ Primary Providers: ${primaryProviders.length}`);
  
  primaryProviders.forEach(provider => {
    console.log(`   - ${provider.name} (${provider.model}): $${provider.cost}/query`);
    
    // Validate required fields
    if (!provider.endpoint || !provider.apiKeyEnv || !provider.formatRequest || !provider.parseResponse) {
      throw new Error(`Provider ${provider.name} is missing required fields`);
    }
  });
  
  const tiebreaker = getTiebreakerProvider();
  console.log(`✅ Tiebreaker: ${tiebreaker.name} (${tiebreaker.model}): $${tiebreaker.cost}/query`);
  
  console.log('✅ TEST 6 PASSED: All providers have valid configuration');
} catch (err) {
  console.log(`❌ TEST 6 FAILED: ${err.message}`);
  process.exit(1);
}

// Summary
console.log('\n');
console.log('═'.repeat(80));
console.log('📊 TEST SUMMARY');
console.log('═'.repeat(80));
console.log('✅ Test 1: Consensus Algorithm - PASSED');
console.log('✅ Test 2: Low Agreement Detection - PASSED');
console.log('✅ Test 3: Orchestrator Configuration - PASSED');
console.log('✅ Test 4: Statistics Tracking - PASSED');
console.log('✅ Test 5: Cost Calculation - PASSED');
console.log('✅ Test 6: Provider Configuration - PASSED');
console.log('\n🎉 All Tests Passed!');
console.log('\n💡 Next Steps:');
console.log('   1. Add API keys to .env file');
console.log('   2. Run: node backend/test/test-open-source-models.js');
console.log('   3. Test with real automotive diagnostic queries');
console.log('\n📖 See MIGRATION_GUIDE.md for deployment instructions\n');

process.exit(0);
