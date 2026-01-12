#!/usr/bin/env node

/**
 * Gumroad Pricing Optimizer
 * 
 * A/B tests different pricing strategies
 * Analyzes conversion rates and revenue impact
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

class PricingOptimizer {
  constructor() {
    this.pricingPath = path.join(__dirname, '../../data/gumroad-pricing-tests.json');
    this.dataDir = path.join(__dirname, '../../data');
  }

  /**
   * Initialize pricing tests
   */
  async initialize() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      
      try {
        await fs.access(this.pricingPath);
      } catch {
        await this.createPricingFile();
      }
      
    } catch (error) {
      console.error('❌ Failed to initialize:', error.message);
      throw error;
    }
  }

  /**
   * Create pricing tests file
   */
  async createPricingFile() {
    const data = {
      created: new Date().toISOString(),
      activeTests: [],
      completedTests: [],
      recommendations: []
    };
    
    await fs.writeFile(this.pricingPath, JSON.stringify(data, null, 2));
    console.log('📊 Pricing optimization initialized');
  }

  /**
   * Create A/B test for product
   */
  async createTest(productId, productName, currentPrice, testPrices) {
    await this.initialize();
    
    console.log(`\n🧪 Creating pricing test for: ${productName}\n`);
    
    const test = {
      id: `test-${Date.now()}`,
      productId,
      productName,
      currentPrice,
      testPrices,
      startDate: new Date().toISOString(),
      endDate: null,
      status: 'active',
      results: testPrices.map(price => ({
        price,
        impressions: 0,
        conversions: 0,
        revenue: 0,
        conversionRate: 0
      }))
    };
    
    const data = await fs.readFile(this.pricingPath, 'utf8');
    const pricing = JSON.parse(data);
    
    pricing.activeTests.push(test);
    
    await fs.writeFile(this.pricingPath, JSON.stringify(pricing, null, 2));
    
    console.log(`✅ Test created: ${test.id}`);
    console.log(`   Current price: $${currentPrice}`);
    console.log(`   Test prices: ${testPrices.map(p => `$${p}`).join(', ')}`);
    console.log(`   Duration: 7 days recommended\n`);
    
    return test;
  }

  /**
   * Simulate test results (for demonstration)
   */
  simulateResults(test) {
    // Simulate realistic conversion rates
    // Generally: lower price = higher conversion, but not always optimal revenue
    
    test.results.forEach(result => {
      // Base conversion rate around 2-5%
      const baseCR = 0.03;
      
      // Price elasticity: lower prices get more conversions
      const priceRatio = test.currentPrice / result.price;
      const crMultiplier = Math.pow(priceRatio, 0.5); // Square root for diminishing returns
      
      result.impressions = Math.floor(Math.random() * 500) + 500; // 500-1000 impressions
      result.conversionRate = Math.min(baseCR * crMultiplier, 0.1); // Cap at 10%
      result.conversions = Math.floor(result.impressions * result.conversionRate);
      result.revenue = result.conversions * result.price;
    });
    
    return test;
  }

  /**
   * Analyze test results
   */
  analyzeTest(test) {
    console.log(`\n📊 Analyzing test: ${test.productName}\n`);
    console.log('='.repeat(60));
    
    // Find best performers
    const sortedByRevenue = [...test.results].sort((a, b) => b.revenue - a.revenue);
    const sortedByCR = [...test.results].sort((a, b) => b.conversionRate - a.conversionRate);
    
    console.log('\n💰 Results by Revenue:');
    sortedByRevenue.forEach((result, i) => {
      const marker = i === 0 ? '🏆' : '  ';
      console.log(`${marker} $${result.price.toFixed(2)}: $${result.revenue.toFixed(2)} (${result.conversions} sales, ${(result.conversionRate * 100).toFixed(2)}% CR)`);
    });
    
    console.log('\n📈 Results by Conversion Rate:');
    sortedByCR.forEach((result, i) => {
      const marker = i === 0 ? '🏆' : '  ';
      console.log(`${marker} $${result.price.toFixed(2)}: ${(result.conversionRate * 100).toFixed(2)}% CR (${result.conversions} sales, $${result.revenue.toFixed(2)})`);
    });
    
    // Calculate recommendation
    const bestRevenue = sortedByRevenue[0];
    const currentResult = test.results.find(r => r.price === test.currentPrice);
    
    const revenueIncrease = currentResult ? 
      ((bestRevenue.revenue - currentResult.revenue) / currentResult.revenue * 100).toFixed(1) :
      0;
    
    console.log('\n💡 Recommendation:');
    if (bestRevenue.price === test.currentPrice) {
      console.log(`   ✅ Keep current price: $${test.currentPrice}`);
      console.log(`   Current price is optimal for revenue`);
    } else {
      console.log(`   🔄 Change price from $${test.currentPrice} to $${bestRevenue.price}`);
      console.log(`   Expected revenue increase: ${revenueIncrease}%`);
      console.log(`   Expected conversions: ${bestRevenue.conversions} vs ${currentResult?.conversions || 0}`);
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    return {
      recommendedPrice: bestRevenue.price,
      currentPrice: test.currentPrice,
      expectedIncrease: revenueIncrease,
      bestRevenue: bestRevenue.revenue,
      bestConversionRate: sortedByCR[0].conversionRate
    };
  }

  /**
   * Run pricing optimization
   */
  async optimize() {
    console.log('\n💰 Gumroad Pricing Optimization\n');
    console.log('='.repeat(60));
    
    // Example tests for Tier 1 products
    const testProducts = [
      {
        id: 'prod-001',
        name: 'RideWire AI Prompt Library',
        currentPrice: 17.99,
        testPrices: [14.99, 17.99, 21.99, 24.99]
      },
      {
        id: 'prod-002',
        name: 'Multi-AI Diagnostic Report Templates',
        currentPrice: 19.99,
        testPrices: [16.99, 19.99, 24.99, 29.99]
      },
      {
        id: 'prod-003',
        name: 'OBD-II Code Reference Database',
        currentPrice: 29.99,
        testPrices: [24.99, 29.99, 34.99, 39.99]
      }
    ];
    
    const recommendations = [];
    
    for (const product of testProducts) {
      // Create test
      let test = await this.createTest(
        product.id,
        product.name,
        product.currentPrice,
        product.testPrices
      );
      
      // Simulate results (in production, this would be real data over time)
      test = this.simulateResults(test);
      
      // Analyze
      const recommendation = this.analyzeTest(test);
      recommendations.push({
        productId: product.id,
        productName: product.name,
        ...recommendation
      });
    }
    
    // Save recommendations
    const data = await fs.readFile(this.pricingPath, 'utf8');
    const pricing = JSON.parse(data);
    pricing.recommendations = recommendations;
    pricing.lastOptimized = new Date().toISOString();
    
    await fs.writeFile(this.pricingPath, JSON.stringify(pricing, null, 2));
    
    // Summary
    console.log('\n📊 Optimization Summary\n');
    console.log('Products analyzed:', testProducts.length);
    
    const needsChange = recommendations.filter(r => r.recommendedPrice !== r.currentPrice);
    console.log(`Price changes recommended: ${needsChange.length}`);
    
    if (needsChange.length > 0) {
      console.log('\n🔄 Recommended Changes:');
      needsChange.forEach(r => {
        console.log(`   ${r.productName}: $${r.currentPrice} → $${r.recommendedPrice} (+${r.expectedIncrease}%)`);
      });
    }
    
    console.log();
    
    return recommendations;
  }

  /**
   * Display pricing recommendations
   */
  async displayRecommendations() {
    await this.initialize();
    
    const data = await fs.readFile(this.pricingPath, 'utf8');
    const pricing = JSON.parse(data);
    
    if (pricing.recommendations.length === 0) {
      console.log('⚠️  No pricing recommendations yet. Run --optimize first.');
      return;
    }
    
    console.log('\n💡 Pricing Recommendations\n');
    console.log('='.repeat(60));
    
    pricing.recommendations.forEach(rec => {
      console.log(`\n${rec.productName}`);
      console.log(`   Current: $${rec.currentPrice}`);
      console.log(`   Recommended: $${rec.recommendedPrice}`);
      
      if (rec.recommendedPrice !== rec.currentPrice) {
        console.log(`   Impact: +${rec.expectedIncrease}% revenue`);
      } else {
        console.log(`   Status: Optimal`);
      }
    });
    
    console.log('\n' + '='.repeat(60) + '\n');
  }
}

// CLI interface
if (require.main === module) {
  const optimizer = new PricingOptimizer();
  const args = process.argv.slice(2);
  
  if (args.includes('--optimize')) {
    optimizer.optimize().catch(console.error);
  } else {
    optimizer.displayRecommendations().catch(console.error);
  }
}

module.exports = PricingOptimizer;
